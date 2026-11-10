// Verificación del webhook de Cal.com → CRM de Notion (backend). No toca AWS, Cal.com ni Notion: sustituye DynamoDB
// y la API de Notion por simulaciones en memoria y ejecuta el handler real (backend/src/index.ts).
//
// Uso:
//   node --import tsx scripts/verificar-cal-webhook.ts
//
// Comprueba: firma HMAC (válida, falsa, ausente, secreto sin configurar), solo BOOKING_CREATED, mapeo de nombre,
// email, teléfono y hora de la llamada, canal «Reserva de llamada», no duplicar una reserva reenviada, atribución
// cuando llega en metadata, y que un fallo de Notion no devuelve error a Cal.com (para que no reintente).
import { createHmac } from "node:crypto";
import { DeleteCommand, DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const SECRET = "secreto-de-prueba-no-real";
process.env.LEADS_TABLE_NAME = "leads-test";
process.env.SENDER_EMAIL = "info@example.test";
process.env.NOTION_TOKEN = "secret_TOKEN_DE_PRUEBA_123";
process.env.CAL_WEBHOOK_SECRET = SECRET;
delete process.env.NOTION_API_URL;

type Row = Record<string, unknown>;
const ddbItems = new Map<string, Row>();
const notionCalls: { body: any }[] = [];
let notionStatus = 200;
const logs: string[] = [];

DynamoDBDocumentClient.prototype.send = async function (command: any) {
  const input = command.input;
  if (command instanceof PutCommand) {
    const key = `${input.Item.pk}|${input.Item.sk ?? ""}`;
    if (input.ConditionExpression) {
      const existing = ddbItems.get(key);
      if (existing && Number(existing.expiresAt) >= Number(input.ExpressionAttributeValues[":now"])) {
        const error = new Error("The conditional request failed");
        error.name = "ConditionalCheckFailedException";
        throw error;
      }
    }
    ddbItems.set(key, input.Item);
    return {};
  }
  if (command instanceof DeleteCommand) {
    ddbItems.delete(`${input.Key.pk}|${input.Key.sk ?? ""}`);
    return {};
  }
  return { Attributes: { count: 1 } };
};

globalThis.fetch = (async (_url: string, init: any) => {
  notionCalls.push({ body: JSON.parse(init.body) });
  return new Response("{}", { status: notionStatus });
}) as typeof fetch;
console.error = (...args: unknown[]) => void logs.push(args.map(String).join(" "));
console.warn = (...args: unknown[]) => void logs.push(args.map(String).join(" "));

const { handler } = await import("../backend/src/index");
const { verifyCalSignature } = await import("../backend/src/calWebhook");

let failures = 0;
function check(name: string, ok: boolean, detail = "") {
  if (!ok) failures += 1;
  process.stdout.write(`${ok ? "OK    " : "FALLA "} ${name}${!ok && detail ? `  → ${detail}` : ""}\n`);
}

const sign = (body: string, secret = SECRET) => createHmac("sha256", secret).update(body).digest("hex");

async function webhook(body: unknown, headers: Record<string, string> | "firmar" = "firmar") {
  const raw = typeof body === "string" ? body : JSON.stringify(body);
  const event = {
    httpMethod: "POST",
    path: "/webhook/cal",
    // Cal.com no manda cabecera Origin: es una llamada de servidor.
    headers: { "content-type": "application/json", ...(headers === "firmar" ? { "x-cal-signature-256": sign(raw) } : headers) },
    multiValueHeaders: {},
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: { httpMethod: "POST", path: "/webhook/cal", stage: "prod", requestId: "test", identity: { sourceIp: "198.51.100.9" } },
    body: raw,
    isBase64Encoded: false,
  };
  const result: any = await (handler as any)(event, {});
  return { status: result.statusCode as number, json: JSON.parse(result.body) };
}

function reset() {
  ddbItems.clear();
  notionCalls.length = 0;
  logs.length = 0;
  notionStatus = 200;
}

const booking = (overrides: Row = {}, payloadOverrides: Row = {}) => ({
  triggerEvent: "BOOKING_CREATED",
  createdAt: "2026-11-11T09:00:00.000Z",
  payload: {
    type: "free-30-min-call",
    title: "Llamada gratuita de 30 minutos entre Pablo Leone y Ana Prueba",
    uid: "uid-reserva-001",
    bookingId: 4521,
    startTime: "2026-11-20T09:30:00.000Z", // 10:30 en Madrid (CET)
    endTime: "2026-11-20T10:00:00.000Z",
    organizer: { name: "Pablo Leone", email: "info@tallerdedigitalizacion.com", timeZone: "Europe/Madrid" },
    attendees: [{ name: "Ana Prueba", email: "ana.prueba@example.com", timeZone: "Europe/Madrid", language: { locale: "es" } }],
    responses: { name: { label: "Nombre", value: "Ana Prueba" }, email: { label: "Email", value: "ana.prueba@example.com" } },
    ...payloadOverrides,
  },
  ...overrides,
});

const text = (p: any) => p?.rich_text?.[0]?.text?.content;

// ---------- 1. Firma ----------
reset();
check("1. verifyCalSignature acepta la firma correcta", verifyCalSignature("{}", sign("{}"), SECRET));
check("1. verifyCalSignature rechaza otro secreto, vacío y basura", !verifyCalSignature("{}", sign("{}", "otro"), SECRET) && !verifyCalSignature("{}", "", SECRET) && !verifyCalSignature("{}", "zz", SECRET) && !verifyCalSignature("{}", sign("{}"), ""));
let res = await webhook(booking(), {});
check("1. Sin cabecera de firma → 401 y sin fila", res.status === 401 && notionCalls.length === 0, JSON.stringify(res));
res = await webhook(booking(), { "x-cal-signature-256": sign(JSON.stringify(booking()), "secreto-falso") });
check("1. Firma falsa → 401 y sin fila", res.status === 401 && notionCalls.length === 0);
const good = sign(JSON.stringify(booking()));
res = await webhook(booking(), { "x-cal-signature-256": good.slice(0, -1) + (good.endsWith("0") ? "1" : "0") });
check("1. Firma alterada → 401 y sin fila", res.status === 401 && notionCalls.length === 0, JSON.stringify(res));
reset();

// ---------- 2. Reserva válida ----------
res = await webhook(booking());
const props = notionCalls[0]?.body?.properties ?? {};
check("2. Reserva firmada → 200 y una fila en Notion", res.status === 200 && res.json.notion === "created" && notionCalls.length === 1, JSON.stringify(res));
check("2. Nombre y email del asistente (no los del organizador)", props["Nombre"]?.title?.[0]?.text?.content === "Ana Prueba" && props["Email"]?.email === "ana.prueba@example.com");
check("2. Canal = Reserva de llamada y Origen = Cal.com", props["Canal de entrada"]?.select?.name === "Reserva de llamada" && props["Origen"]?.select?.name === "Cal.com", JSON.stringify([props["Canal de entrada"], props["Origen"]]));
check("2. Necesidad: fecha y hora en Madrid y nombre del evento", text(props["Necesidad declarada"])?.startsWith("Reserva de llamada: 2026-11-20 10:30 (hora de Madrid)") === true, text(props["Necesidad declarada"]));
check("2. Estado = Nuevo y Primer contacto = hoy", props["Estado"]?.status?.name === "Nuevo" && /^\d{4}-\d{2}-\d{2}$/.test(props["Primer contacto"]?.date?.start ?? ""));
check("2. Sin atribución en el webhook → No atribuido", props["Atribución"]?.select?.name === "No atribuido" && !("GCLID" in props));
const hora = await webhook(booking({}, { startTime: "2026-07-15T08:00:00.000Z", uid: "uid-verano" }));
check("2. Hora de verano (CEST): 08:00 UTC = 10:00", text(notionCalls[1]?.body?.properties?.["Necesidad declarada"])?.includes("2026-07-15 10:00") === true && hora.status === 200, text(notionCalls[1]?.body?.properties?.["Necesidad declarada"]));

// ---------- 3. Reenvío ----------
reset();
await webhook(booking());
res = await webhook(booking());
check("3. La misma reserva reenviada no crea otra fila", res.status === 200 && res.json.notion === "duplicate" && notionCalls.length === 1, JSON.stringify(res));
res = await webhook(booking({}, { uid: "uid-reserva-002" }));
check("3. Otra reserva del mismo email sí crea fila", res.json.notion === "created" && notionCalls.length === 2);

// ---------- 4. Otros eventos ----------
reset();
for (const triggerEvent of ["BOOKING_CANCELLED", "BOOKING_RESCHEDULED", "PING"]) {
  res = await webhook(booking({ triggerEvent }));
  check(`4. ${triggerEvent} → 200 y se ignora`, res.status === 200 && Boolean(res.json.ignored) && notionCalls.length === 0, JSON.stringify(res));
}
res = await webhook(booking({}, { attendees: [], responses: {} }));
check("4. Reserva sin email → 200 y se ignora (Cal.com no reintenta)", res.status === 200 && Boolean(res.json.ignored) && notionCalls.length === 0, JSON.stringify(res));
res = await webhook("esto no es json");
check("4. Cuerpo no JSON con firma válida → 400", res.status === 400, JSON.stringify(res));

// ---------- 5. Atribución en metadata ----------
reset();
res = await webhook(
  booking({}, { metadata: { utm_source: "google", utm_medium: "cpc", utm_campaign: "C99-prueba", utm_content: "A", utm_term: "prueba", gclid: "TEST123", landing: "/desarrollo-software-a-medida/" } }),
);
const attr = notionCalls[0]?.body?.properties ?? {};
check("5. Con metadata: Origen Google Ads, Atribución Confirmada, GCLID", attr["Origen"]?.select?.name === "Google Ads" && attr["Atribución"]?.select?.name === "Confirmada" && text(attr["GCLID"]) === "TEST123", JSON.stringify(attr["Origen"]));
check("5. Con metadata: campaña, anuncio, término, landing, código y [PRUEBA]", text(attr["Campaña"]) === "C99-prueba" && text(attr["Anuncio / variante"]) === "A" && text(attr["Palabra clave o término"]) === "prueba" && text(attr["Landing de entrada"]) === "/desarrollo-software-a-medida/" && text(attr["Código de atribución"]) === "(ref: google/C99-prueba/A)" && attr["Nombre"]?.title?.[0]?.text?.content === "[PRUEBA] Ana Prueba");

// ---------- 6. Notion caído ----------
reset();
notionStatus = 401;
res = await webhook(booking());
check("6. Notion falla → 200 (Cal.com no reintenta) y queda NOTION_SYNC_FAILED en logs", res.status === 200 && res.json.notion === "failed" && logs.some((line) => line.startsWith("NOTION_SYNC_FAILED")), JSON.stringify(res));
notionStatus = 200;
res = await webhook(booking());
check("6. Tras el fallo se libera la reserva y un reenvío sí crea la fila", res.json.notion === "created", JSON.stringify(res));

// ---------- 7. Secreto sin configurar ----------
reset();
const { config } = await import("../backend/src/config");
config.calWebhookSecret = "";
res = await webhook(booking());
check("7. Sin CAL_WEBHOOK_SECRET en la función → 401 aunque la firma sea de otro", res.status === 401 && notionCalls.length === 0);

process.stdout.write(failures === 0 ? "\nTodo OK\n" : `\n${failures} comprobación(es) FALLAN\n`);
process.exit(failures === 0 ? 0 : 1);
