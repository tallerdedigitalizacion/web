// Verificación del alta de leads en Notion (backend). No toca AWS ni Notion: sustituye DynamoDB, SES y la API de
// Notion por simulaciones en memoria y ejecuta el handler real de la API (backend/src/index.ts).
//
// Uso:
//   node --import tsx scripts/verificar-notion.ts
//
// Comprueba: mapeo de propiedades contra el esquema real de la base «CRM · Prospectos», que el email sale aunque
// Notion falle, el registro del error, los reintentos y que un reenvío no duplica la fila.
import { DeleteCommand, DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SESClient } from "@aws-sdk/client-ses";

process.env.LEADS_TABLE_NAME = "leads-test";
process.env.SENDER_EMAIL = "info@example.test";
process.env.NOTIFY_EMAIL = "aviso@example.test";
process.env.EMAIL_DRIVER = "ses";
process.env.NOTION_TOKEN = "secret_TOKEN_DE_PRUEBA_123";
delete process.env.NOTION_API_URL;

// Esquema de «CRM · Prospectos» (data source 8eb3cf60-…), copiado de Notion el 10-nov-2026.
const schema: Record<string, { type: string; options?: string[] }> = {
  Nombre: { type: "title" },
  Email: { type: "email" },
  Teléfono: { type: "phone_number" },
  "Necesidad declarada": { type: "text" },
  Estado: { type: "status", options: ["Nuevo", "Contactado", "Presupuesto enviado", "Reunión de descubrimiento", "Ganado", "Perdido"] },
  "Primer contacto": { type: "date" },
  "Canal de entrada": { type: "select", options: ["WhatsApp", "Formulario web", "Lead magnet", "Llamada", "Mensaje de la ficha", "Email", "Otro"] },
  Origen: {
    type: "select",
    options: ["Cal.com", "Llamada entrante", "Distribución orgánica", "Referido", "Otro", "Visita en frío", "Gestoría", "Google Ads", "Google Maps (ficha)", "Búsqueda orgánica Google"],
  },
  Atribución: { type: "select", options: ["Confirmada", "Probable", "No atribuido"] },
  Campaña: { type: "text" },
  "Anuncio / variante": { type: "text" },
  "Palabra clave o término": { type: "text" },
  GCLID: { type: "text" },
  "Landing de entrada": { type: "text" },
  "Código de atribución": { type: "text" },
};

// ---------- Simulaciones ----------
type Row = Record<string, unknown>;
const ddbItems = new Map<string, Row>();
const emails: { to: string; subject: string; body: string }[] = [];
const notionCalls: { url: string; headers: Record<string, string>; body: any }[] = [];
let notionBehaviour: (call: number) => Response | Promise<Response> = () => new Response("{}", { status: 200 });
const logs: string[] = [];

DynamoDBDocumentClient.prototype.send = async function (command: any) {
  const input = command.input;
  if (command instanceof PutCommand) {
    const key = `${input.Item.pk ?? input.Item.id}|${input.Item.sk ?? ""}`;
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
    ddbItems.delete(`${input.Key.pk ?? input.Key.id}|${input.Key.sk ?? ""}`);
    return {};
  }
  return { Attributes: { count: 1 } }; // UpdateCommand del límite de peticiones
};

SESClient.prototype.send = async function (command: any) {
  const raw = Buffer.from(command.input.RawMessage.Data).toString("utf8");
  emails.push({ to: /^To: (.+)$/m.exec(raw)?.[1] ?? "", subject: /^Subject: (.+)$/m.exec(raw)?.[1] ?? "", body: raw });
  return {};
} as any;

let notionCallCount = 0;
globalThis.fetch = (async (url: string, init: any) => {
  notionCallCount += 1;
  notionCalls.push({ url: String(url), headers: init.headers, body: JSON.parse(init.body) });
  return notionBehaviour(notionCallCount);
}) as typeof fetch;

console.error = (...args: unknown[]) => void logs.push(args.map(String).join(" "));
console.warn = (...args: unknown[]) => void logs.push(args.map(String).join(" "));

const { handler } = await import("../backend/src/index");
const { buildNotionProperties } = await import("../backend/src/notion");

// ---------- Utilidades ----------
let failures = 0;
function check(name: string, ok: boolean, detail = "") {
  if (!ok) failures += 1;
  process.stdout.write(`${ok ? "OK    " : "FALLA "} ${name}${!ok && detail ? `  → ${detail}` : ""}\n`);
}

const testAttribution = {
  source: "google",
  medium: "cpc",
  campaign: "C99-prueba",
  content: "A",
  term: "prueba",
  clickId: "TEST123",
  clickIdType: "gclid",
  landing: "/",
};

function contactBody(overrides: Row = {}) {
  return {
    service: "Soporte informático",
    name: "Ana Prueba",
    email: "ana.prueba@example.com",
    phone: "600123123",
    message: "Necesito ayuda con el correo de la empresa.",
    privacyAccepted: true,
    marketingAccepted: false,
    website: "",
    startedAt: Date.now() - 10_000,
    pageUrl: "https://tallerdedigitalizacion.com/?gclid=TEST123&utm_source=google&utm_medium=cpc&utm_campaign=C99-prueba&utm_content=A&utm_term=prueba",
    attribution: testAttribution,
    ...overrides,
  };
}

async function post(path: string, body: unknown) {
  const event = {
    httpMethod: "POST",
    path,
    headers: { origin: "https://tallerdedigitalizacion.com", "content-type": "application/json", "x-forwarded-for": "203.0.113.7" },
    multiValueHeaders: {},
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: { httpMethod: "POST", path, stage: "prod", requestId: "test", identity: { sourceIp: "203.0.113.7" } },
    body: JSON.stringify(body),
    isBase64Encoded: false,
  };
  const result: any = await (handler as any)(event, {});
  return { status: result.statusCode as number, json: JSON.parse(result.body) };
}

function reset() {
  ddbItems.clear();
  emails.length = 0;
  notionCalls.length = 0;
  logs.length = 0;
  notionCallCount = 0;
  notionBehaviour = () => new Response("{}", { status: 200 });
  process.env.NOTION_TOKEN = "secret_TOKEN_DE_PRUEBA_123";
}

const text = (p: any) => p?.rich_text?.[0]?.text?.content;

// ---------- 1. Envío de prueba con la URL estándar ----------
reset();
let res = await post("/lead/contact", contactBody());
const props = notionCalls[0]?.body?.properties ?? {};
check("1. El formulario responde ok", res.status === 200 && res.json.ok === true, JSON.stringify(res));
check("1. Llega el email (al lead y aviso)", emails.length === 2 && emails.some((e) => e.to.includes("ana.prueba@example.com")));
check("1. Se crea una página en Notion (una sola llamada)", notionCalls.length === 1, String(notionCalls.length));
check("1. Usa el data source indicado y el token en la cabecera", notionCalls[0]?.body?.parent?.data_source_id === "8eb3cf60-b907-42e5-9260-5c2e8644aae0" && notionCalls[0]?.headers?.authorization === "Bearer secret_TOKEN_DE_PRUEBA_123");
check("1. Nombre = «[PRUEBA] Ana Prueba»", props["Nombre"]?.title?.[0]?.text?.content === "[PRUEBA] Ana Prueba", JSON.stringify(props["Nombre"]));
check("1. Email y Teléfono", props["Email"]?.email === "ana.prueba@example.com" && props["Teléfono"]?.phone_number === "600123123");
check("1. Necesidad declarada (servicio y mensaje)", text(props["Necesidad declarada"]) === "Soporte informático: Necesito ayuda con el correo de la empresa.");
check("1. Estado = Nuevo y Primer contacto = hoy", props["Estado"]?.status?.name === "Nuevo" && /^\d{4}-\d{2}-\d{2}$/.test(props["Primer contacto"]?.date?.start ?? ""));
check("1. Canal de entrada = Formulario web", props["Canal de entrada"]?.select?.name === "Formulario web");
check("1. Origen = Google Ads", props["Origen"]?.select?.name === "Google Ads");
check("1. Atribución = Confirmada", props["Atribución"]?.select?.name === "Confirmada");
check("1. Campaña, Anuncio, Palabra clave", text(props["Campaña"]) === "C99-prueba" && text(props["Anuncio / variante"]) === "A" && text(props["Palabra clave o término"]) === "prueba");
check("1. GCLID = TEST123", text(props["GCLID"]) === "TEST123");
check("1. Landing de entrada", text(props["Landing de entrada"]) === "/");
check("1. Código de atribución = (ref: google/C99-prueba/A)", text(props["Código de atribución"]) === "(ref: google/C99-prueba/A)", text(props["Código de atribución"]));
const unknownProps = Object.keys(props).filter((name) => !schema[name]);
check("1. Todas las propiedades existen en la base", unknownProps.length === 0, unknownProps.join(", "));
const badOptions = Object.entries(props).filter(([name, value]: [string, any]) => {
  const option = value?.select?.name ?? value?.status?.name;
  return option !== undefined && !schema[name]?.options?.includes(option);
});
check("1. Todas las opciones select/status existen en la base", badOptions.length === 0, JSON.stringify(badOptions));
const forbidden = ["Importe propuesto (€, sin IVA)", "Ingreso real (€, sin IVA)", "Fase de venta", "Reseña de Google", "Probabilidad", "Contacto"].filter((name) => name in props);
check("1. El resto de campos queda vacío (sin valores inventados)", forbidden.length === 0, forbidden.join(", "));

// ---------- 2. Reenvío: no duplica ----------
res = await post("/lead/contact", contactBody());
check("2. El reenvío responde ok", res.status === 200 && res.json.ok === true);
check("2. El reenvío no crea una segunda fila", notionCalls.length === 1, String(notionCalls.length));
check("2. El email del reenvío sale igual (comportamiento de siempre)", emails.length === 4, String(emails.length));
res = await post("/lead/contact", contactBody({ email: "otra@example.com" }));
check("2. Otro email sí crea fila", notionCalls.length === 2);

// ---------- 3. Sin atribución ----------
reset();
res = await post("/lead/contact", contactBody({ attribution: undefined, pageUrl: "https://tallerdedigitalizacion.com/" }));
const bare = notionCalls[0]?.body?.properties ?? {};
check("3. Sin parámetros: Atribución = No atribuido", bare["Atribución"]?.select?.name === "No atribuido", JSON.stringify(bare["Atribución"]));
check("3. Sin parámetros: Origen = Otro y sin [PRUEBA]", bare["Origen"]?.select?.name === "Otro" && bare["Nombre"]?.title?.[0]?.text?.content === "Ana Prueba");
check("3. Sin parámetros: Campaña, GCLID y código vacíos", !("Campaña" in bare) && !("GCLID" in bare) && !("Código de atribución" in bare));

// ---------- 4. Notion caído (token inválido) ----------
reset();
notionBehaviour = () => new Response(JSON.stringify({ object: "error", status: 401, code: "unauthorized", message: "API token is invalid." }), { status: 401 });
res = await post("/lead/contact", contactBody({ email: "caido@example.com" }));
const failedLog = logs.find((line) => line.startsWith("NOTION_SYNC_FAILED"));
check("4. Con Notion caído el formulario responde ok", res.status === 200 && res.json.ok === true && res.json.emailDelivered === true, JSON.stringify(res));
check("4. Con Notion caído el email sale igual", emails.length === 2);
check("4. El error queda en logs con el payload para recuperarlo a mano", Boolean(failedLog) && failedLog!.includes("caido@example.com") && failedLog!.includes("C99-prueba") && failedLog!.includes('"status":401'), failedLog);
check("4. El token no aparece en los logs", !logs.some((line) => line.includes("secret_TOKEN")));
check("4. Un 401 no se reintenta", notionCalls.length === 1, String(notionCalls.length));
res = await post("/lead/contact", contactBody({ email: "caido@example.com" }));
check("4. Tras un fallo se libera la reserva y el reenvío vuelve a intentarlo", notionCalls.length === 2, String(notionCalls.length));

// ---------- 5. Reintentos ----------
reset();
notionBehaviour = (call) => (call < 3 ? new Response("{}", { status: 500 }) : new Response("{}", { status: 200 }));
const started = Date.now();
res = await post("/lead/contact", contactBody({ email: "reintento@example.com" }));
check("5. Con dos 500 seguidos y un 200 se crea la fila al tercer intento", notionCalls.length === 3 && !logs.some((l) => l.startsWith("NOTION_SYNC_FAILED")), `${notionCalls.length} llamadas`);
check("5. Los reintentos esperan poco (< 4 s)", Date.now() - started < 4000, `${Date.now() - started} ms`);
reset();
notionBehaviour = () => new Response("{}", { status: 503 });
res = await post("/lead/contact", contactBody({ email: "siempre500@example.com" }));
check("5. Si falla siempre: 3 intentos, email enviado y error en logs", notionCalls.length === 3 && emails.length === 2 && logs.some((l) => l.startsWith("NOTION_SYNC_FAILED")) && res.json.ok === true);
reset();
notionBehaviour = () => {
  const error = new Error("aborted");
  error.name = "AbortError";
  throw error;
};
res = await post("/lead/contact", contactBody({ email: "timeout@example.com" }));
check("5. Un tiempo agotado no se reintenta (evita filas duplicadas)", notionCalls.length === 1 && emails.length === 2 && res.json.ok === true);

// ---------- 6. Sin token ----------
reset();
process.env.NOTION_TOKEN = "";
res = await post("/lead/contact", contactBody({ email: "sintoken@example.com" }));
check("6. Sin NOTION_TOKEN no se llama a Notion y el email sale", notionCalls.length === 0 && emails.length === 2 && res.json.ok === true && logs.some((l) => l.startsWith("NOTION_SYNC_SKIPPED")));

// ---------- 7. Otros orígenes y formularios ----------
reset();
const pure = (attribution: any) => buildNotionProperties({ action: "contact", name: "X", email: "x@example.com", need: "n", channel: "Formulario web", attribution });
check("7. google/organic → Búsqueda orgánica Google", pure({ source: "google", medium: "organic" })["Origen"].select.name === "Búsqueda orgánica Google");
check("7. facebook/social → Otro", pure({ source: "facebook", medium: "social", campaign: "x" })["Origen"].select.name === "Otro");
check("7. gbraid → «gbraid:<valor>»", text(pure({ clickId: "ABC", clickIdType: "gbraid" })["GCLID"]) === "gbraid:ABC");
check("7. wbraid → «wbraid:<valor>»", text(pure({ clickId: "ABC", clickIdType: "wbraid" })["GCLID"]) === "wbraid:ABC");
check("7. Solo referrer (sin UTM) → No atribuido y sin código", pure({ source: "bing.com" })["Atribución"].select.name === "No atribuido" && !("Código de atribución" in pure({ source: "bing.com" })));
check("7. utm_source + utm_campaign sin gclid → Confirmada", pure({ source: "google", medium: "cpc", campaign: "C02-maps-toledo" })["Atribución"].select.name === "Confirmada");
check("7. clickId sin utm → Confirmada", pure({ clickId: "Cj0KCQ" })["Atribución"].select.name === "Confirmada");
check("7. Campaña terminada en -prueba (sin gclid) marca [PRUEBA]", pure({ campaign: "C99-prueba" })["Nombre"].title[0].text.content === "[PRUEBA] X");
check("7. Título con 2000+ caracteres se recorta", text(buildNotionProperties({ action: "contact", name: "X", email: "x@example.com", need: "a".repeat(2500), channel: "Formulario web" })["Necesidad declarada"]).length === 2000);

reset();
res = await post("/lead/method", { name: "Beto Descarga", email: "beto@example.com", privacyAccepted: true, website: "", startedAt: Date.now() - 10_000, attribution: { ...testAttribution, campaign: "C02-maps-toledo", clickId: "Cj0KCQ", landing: "/lp/C02-maps-toledo/" } });
const method = notionCalls[0]?.body?.properties ?? {};
check("7. Descarga del método → Canal «Lead magnet» y sin [PRUEBA]", method["Canal de entrada"]?.select?.name === "Lead magnet" && method["Nombre"]?.title?.[0]?.text?.content === "Beto Descarga");

// ---------- 8. Spam no llega a Notion ----------
reset();
res = await post("/lead/contact", contactBody({ website: "http://spam.example" }));
check("8. Un envío con honeypot lleno no llega a Notion ni envía email", notionCalls.length === 0 && emails.length === 0);

process.stdout.write(failures === 0 ? "\nTodo OK\n" : `\n${failures} comprobaciones FALLAN\n`);
process.exit(failures === 0 ? 0 : 1);
