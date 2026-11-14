// Verificación de la guía de C05 y su cuestionario (backend + reglas de resultado). No toca AWS, Notion ni correo: sustituye
// DynamoDB, SES y la API de Notion por simulaciones en memoria y ejecuta el handler real (backend/src/index.ts) con el cuerpo
// que envía la web (src/components/ProcessQuiz.astro).
//
// Uso:
//   node --import tsx scripts/verificar-guia-c05.ts
//
// Comprueba: las reglas A–E del resultado en ES y EN, el mapeo a «CRM · Prospectos» (propiedades, opciones y cuerpo de la
// página con respuestas, idioma y suscripción), el email 1 (asunto, enlace a la guía, resultado, reserva, idioma), el aviso
// con toda la atribución (term y clickId incluidos), el antiduplicados, el honeypot y que un esquema inválido se rechaza.
import { DeleteCommand, DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SESClient } from "@aws-sdk/client-ses";

process.env.LEADS_TABLE_NAME = "leads-test";
process.env.SENDER_EMAIL = "info@example.test";
process.env.NOTIFY_EMAIL = "aviso@example.test";
process.env.EMAIL_DRIVER = "ses";
process.env.NOTION_TOKEN = "secret_TOKEN_DE_PRUEBA_123";
process.env.SITE_URL = "https://tallerdedigitalizacion.com";
delete process.env.NOTION_API_URL;

// Esquema de «CRM · Prospectos» (igual que scripts/verificar-notion.ts).
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

type Row = Record<string, unknown>;
const ddbItems = new Map<string, Row>();
const emails: { to: string; subject: string; body: string }[] = [];
const notionCalls: { url: string; headers: Record<string, string>; body: any }[] = [];
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
  return { Attributes: { count: 1 } };
};

SESClient.prototype.send = async function (command: any) {
  const raw = Buffer.from(command.input.RawMessage.Data).toString("utf8");
  emails.push({ to: /^To: (.+)$/m.exec(raw)?.[1] ?? "", subject: /^Subject: (.+)$/m.exec(raw)?.[1] ?? "", body: raw });
  return {};
} as any;

globalThis.fetch = (async (url: string, init: any) => {
  notionCalls.push({ url: String(url), headers: init.headers, body: JSON.parse(init.body) });
  return new Response("{}", { status: 200 });
}) as typeof fetch;

console.error = (...args: unknown[]) => void logs.push(args.map(String).join(" "));
console.warn = (...args: unknown[]) => void logs.push(args.map(String).join(" "));

const { handler } = await import("../backend/src/index");
const { quizResult, quizStartingPoint, quizCompleteParams } = await import("../src/data/processQuiz");

let failures = 0;
function check(name: string, ok: boolean, detail = "") {
  if (!ok) failures += 1;
  process.stdout.write(`${ok ? "OK    " : "FALLA "} ${name}${!ok && detail ? `  → ${detail}` : ""}\n`);
}

const attribution = {
  source: "google",
  medium: "cpc",
  campaign: "C99-prueba",
  content: "A",
  term: "prueba",
  clickId: "TEST123",
  clickIdType: "gclid",
  landing: "/automatizacion-procesos-ia/",
};

// Combinaciones de prueba: una por regla A–E.
const combos = {
  "fase-1": { doc_procesos: "parcial", automatizacion_previa: "alguna", infraestructura: "equipo", dependencia_persona: "retraso", trazabilidad: "si", situaciones: ["facturas", "datos"] },
  "fase-1-calma": { doc_procesos: "si", automatizacion_previa: "ninguna", infraestructura: "cerrada", dependencia_persona: "otro", trazabilidad: "no", situaciones: ["ninguna"] },
  "fase-2-pequeno": { doc_procesos: "si", automatizacion_previa: "nose", infraestructura: "externo", dependencia_persona: "para", trazabilidad: "esfuerzo", situaciones: ["clientes", "persona", "ninguna"] },
  "fase-2-limitada": { doc_procesos: "si", automatizacion_previa: "varias", infraestructura: "nose", dependencia_persona: "otro", trazabilidad: "si", situaciones: ["informes"] },
  "fase-2": { doc_procesos: "si", automatizacion_previa: "alguna", infraestructura: "equipo", dependencia_persona: "otro", trazabilidad: "esfuerzo", situaciones: ["pedidos"] },
} as const;

// ---------- 0. Reglas del resultado ----------
for (const [expected, answers] of Object.entries(combos)) {
  check(`0. Regla → ${expected}`, quizStartingPoint(answers as any) === expected, quizStartingPoint(answers as any));
}
const e = quizResult(combos["fase-2"] as any, "es");
check("0. Regla E con trazabilidad «esfuerzo» añade la nota de la fase 3 (ES)", e.text.endsWith("la fase 3 te pedirá poder reconstruir quién hizo qué y cuándo."), e.text);
const eOk = quizResult({ ...combos["fase-2"], trazabilidad: "si" } as any, "en");
check("0. Regla E con trazabilidad «si» no añade la nota (EN)", !eOk.text.includes("phase 3 will ask"));
const eEn = quizResult(combos["fase-2"] as any, "en");
check("0. Regla E con trazabilidad «esfuerzo» añade la nota (EN)", eEn.text.endsWith("phase 3 will ask you to be able to reconstruct who did what, and when."));
check("0. Orden de las reglas: P1≠si manda aunque P3/P2 también encajen en B", quizStartingPoint({ doc_procesos: "no", automatizacion_previa: "ninguna", infraestructura: "cerrada" }) === "fase-1");
check("0. «ninguna» combinada con otra se ignora (num_situaciones = 2)", quizCompleteParams(combos["fase-2-pequeno"] as any, "es").num_situaciones === 2);
check("0. Solo «ninguna» → 0 situaciones y texto de «no te has reconocido»", quizCompleteParams(combos["fase-1-calma"] as any, "es").num_situaciones === 0 && quizResult(combos["fase-1-calma"] as any, "es").lines.at(-1)!.startsWith("No te has reconocido"));
check("0. Seis líneas por resultado", quizResult(combos["fase-1"] as any, "es").lines.length === 6 && quizResult(combos["fase-1"] as any, "en").lines.length === 6);
check("0. Páginas de la guía (ES 6 págs.: fase 1 → 3, fase 2 → 4; EN 7 págs.: 4 y 5)", quizResult(combos["fase-1"] as any, "es").guidePage === 3 && quizResult(combos["fase-2"] as any, "es").guidePage === 4 && quizResult(combos["fase-1"] as any, "en").guidePage === 4 && quizResult(combos["fase-2"] as any, "en").guidePage === 5);

// ---------- Utilidades ----------
function body(overrides: Row = {}) {
  return {
    name: "Ana Prueba",
    email: "ana.guia@example.com",
    language: "es",
    answers: combos["fase-2-pequeno"],
    privacyAccepted: true,
    marketingAccepted: true,
    courseSubscription: true,
    website: "",
    startedAt: Date.now() - 20_000,
    pageUrl: "https://tallerdedigitalizacion.com/automatizacion-procesos-ia/?gclid=TEST123&utm_source=google&utm_medium=cpc&utm_campaign=C99-prueba&utm_content=A&utm_term=prueba",
    attribution,
    userAgent: "verificar-guia-c05",
    ...overrides,
  };
}

async function post(payload: unknown) {
  const path = "/lead/process-quiz";
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
    body: JSON.stringify(payload),
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
}

const text = (p: any) => p?.rich_text?.[0]?.text?.content;
// El cuerpo sale en UTF-8 tal cual; el asunto va codificado (=?UTF-8?B?…?=).
const decodedBody = (raw: string) => raw;
const decodedSubject = (subject: string) => {
  const match = /^=\?UTF-8\?B\?(.+)\?=$/.exec(subject.trim());
  return match ? Buffer.from(match[1], "base64").toString("utf8") : subject;
};

// ---------- 1. Español: fase-2-pequeno con suscripción ----------
reset();
let res = await post(body());
check("1. Responde ok y con el envío del email", res.status === 200 && res.json.ok === true && res.json.emailDelivered === true, JSON.stringify(res));
check("1. Llega el email al lead y el aviso", emails.length === 2 && emails.some((m) => m.to.includes("ana.guia@example.com")) && emails.some((m) => m.to.includes("aviso@example.test")), JSON.stringify(emails.map((m) => m.to)));
const leadMail = emails.find((m) => m.to.includes("ana.guia@example.com"))!;
const leadText = decodedBody(leadMail.body);
check("1. Email 1: asunto «Tu guía y tu punto de partida»", decodedSubject(leadMail.subject) === "Tu guía y tu punto de partida", decodedSubject(leadMail.subject));
check("1. Email 1: enlace a la guía ES (no adjunto)", leadText.includes("https://tallerdedigitalizacion.com/downloads/guia-automatizacion-procesos-ia.pdf") && !/Content-Disposition: attachment/i.test(leadMail.body));
check("1. Email 1: «Hola, Ana:» y título del resultado", leadText.includes("Hola, Ana:") && leadText.includes("Tu punto de partida: cierra la fase 1 y prueba la fase 2 con un solo proceso"));
check("1. Email 1: enlace de reserva en español y firma", leadText.includes("llamada-gratuita") && leadText.includes("Taller de Digitalización") && leadText.includes("Si no pediste este correo"));
const notice = decodedBody(emails.find((m) => m.to.includes("aviso@example.test"))!.body);
check("1. Aviso: atribución completa (term y clickId incluidos)", notice.includes("Término (utm_term): prueba") && notice.includes("ID de clic (gclid): TEST123") && notice.includes("Campaña (utm_campaign): C99-prueba") && notice.includes("Contenido (utm_content): A"));
check("1. Aviso: punto de partida y mini-curso", notice.includes("Punto de partida: fase-2-pequeno") && notice.includes("Mini-curso: SÍ"));
const saved = [...ddbItems.values()].find((row) => row.action === "process-quiz")!;
check("1. Base de datos: acción, idioma, punto de partida, suscripción y atribución", saved?.language === "es" && saved?.startingPoint === "fase-2-pequeno" && saved?.courseSubscription === true && (saved?.attribution as any)?.clickId === "TEST123" && (saved?.attribution as any)?.term === "prueba", JSON.stringify(saved));
const props = notionCalls[0]?.body?.properties ?? {};
check("1. Notion: una sola fila, canal «Lead magnet», Origen Google Ads, Confirmada", notionCalls.length === 1 && props["Canal de entrada"]?.select?.name === "Lead magnet" && props["Origen"]?.select?.name === "Google Ads" && props["Atribución"]?.select?.name === "Confirmada");
check("1. Notion: «[PRUEBA] Ana Prueba», campaña, anuncio, término, GCLID, landing y código", props["Nombre"]?.title?.[0]?.text?.content === "[PRUEBA] Ana Prueba" && text(props["Campaña"]) === "C99-prueba" && text(props["Anuncio / variante"]) === "A" && text(props["Palabra clave o término"]) === "prueba" && text(props["GCLID"]) === "TEST123" && text(props["Landing de entrada"]) === "/automatizacion-procesos-ia/" && text(props["Código de atribución"]) === "(ref: google/C99-prueba/A)");
check("1. Notion: necesidad declarada con punto de partida, idioma y mini-curso", /fase-2-pequeno/.test(text(props["Necesidad declarada"]) ?? "") && /ES/.test(text(props["Necesidad declarada"]) ?? "") && /mini-curso: sí/.test(text(props["Necesidad declarada"]) ?? ""), text(props["Necesidad declarada"]));
const unknown = Object.keys(props).filter((name) => !schema[name]);
check("1. Notion: todas las propiedades existen en la base (esquema sin cambios)", unknown.length === 0, unknown.join(", "));
const children = notionCalls[0]?.body?.children ?? [];
const childText = children.map((c: any) => c[c.type]?.rich_text?.[0]?.text?.content).join("\n");
check("1. Notion: cuerpo con campaña C05, idioma, punto de partida, suscripción y las 6 respuestas", children.length > 0 && childText.includes("Campaña C05") && childText.includes("Idioma: español (ES)") && childText.includes("Punto de partida: fase-2-pequeno") && childText.includes("Suscrito al mini-curso: SÍ") && children.filter((c: any) => c.type === "bulleted_list_item").length === 6, childText);
check("1. Notion: la situación «ninguna» combinada con otras se ignora (solo «Las mismas preguntas…» y «Tareas que solo…»)", /Las mismas preguntas de clientes una y otra vez \(clientes\); Tareas que solo sabe hacer una persona \(persona\)/.test(childText) && !childText.includes("(ninguna)"), childText);

// ---------- 2. Reenvío: no duplica la fila ----------
res = await post(body());
check("2. Reenvío en menos de 60 s: no crea otra fila en Notion", notionCalls.length === 1, String(notionCalls.length));

// ---------- 3. Inglés: fase-1 sin suscripción, sin nombre ----------
reset();
res = await post(body({ email: "bob.guide@example.com", name: "", language: "en", answers: combos["fase-1"], courseSubscription: false, marketingAccepted: false }));
check("3. EN sin nombre: responde ok", res.status === 200 && res.json.ok === true, JSON.stringify(res));
const enMail = emails.find((m) => m.to.includes("bob.guide@example.com"))!;
const enText = decodedBody(enMail.body);
check("3. EN: asunto «Your guide and your starting point»", decodedSubject(enMail.subject) === "Your guide and your starting point", decodedSubject(enMail.subject));
check("3. EN: enlace a la guía EN, «Hello:» sin nombre, resultado EN y reserva EN", enText.includes("https://tallerdedigitalizacion.com/downloads/ai-process-automation-guide.pdf") && enText.includes("Hello:") && enText.includes("Your starting point: phase 1") && enText.includes("free-30-min-call"), "");
const enProps = notionCalls[0]?.body?.properties ?? {};
const enChildren = (notionCalls[0]?.body?.children ?? []).map((c: any) => c[c.type]?.rich_text?.[0]?.text?.content).join("\n");
check("3. EN en Notion: título = email (sin nombre), idioma EN y mini-curso «no»", enProps["Nombre"]?.title?.[0]?.text?.content === "[PRUEBA] bob.guide@example.com" && enChildren.includes("Idioma: inglés (EN)") && enChildren.includes("Suscrito al mini-curso: no"), enChildren);
const enSaved = [...ddbItems.values()].find((row) => row.action === "process-quiz")!;
check("3. EN: base de datos con idioma «en» y suscripción false", enSaved?.language === "en" && enSaved?.courseSubscription === false);

// ---------- 4. Sin atribución (visita orgánica) ----------
reset();
res = await post(body({ email: "organico@example.com", attribution: undefined, pageUrl: "https://tallerdedigitalizacion.com/automatizacion-procesos-ia/" }));
const bare = notionCalls[0]?.body?.properties ?? {};
check("4. Sin parámetros: No atribuido, sin [PRUEBA]", bare["Atribución"]?.select?.name === "No atribuido" && bare["Nombre"]?.title?.[0]?.text?.content === "Ana Prueba" && !("GCLID" in bare));

// ---------- 5. Validación y spam ----------
reset();
res = await post(body({ answers: { ...combos["fase-1"], doc_procesos: "quizas" } }));
check("5. Respuesta con valor inválido: 400 y sin email ni fila", res.status === 400 && notionCalls.length === 0 && emails.length === 0, `${res.status} ${notionCalls.length} ${emails.length}`);
reset();
res = await post(body({ privacyAccepted: false }));
check("5. Sin aceptar la privacidad: 400 y sin email ni fila", res.status === 400 && emails.length === 0 && notionCalls.length === 0);
reset();
res = await post(body({ website: "http://spam.example" }));
check("5. Honeypot lleno: no envía email ni crea fila", emails.length === 0 && notionCalls.length === 0);
reset();
res = await post(body({ answers: { ...combos["fase-1"], situaciones: [] } }));
check("5. Sin ninguna situación marcada: 400", res.status === 400);

// ---------- 6. Notion caído: el email sale igualmente ----------
reset();
process.env.NOTION_TOKEN = "";
res = await post(body({ email: "sintoken@example.com" }));
check("6. Sin NOTION_TOKEN: no se llama a Notion y el email sale", notionCalls.length === 0 && emails.length === 2 && res.json.ok === true && logs.some((l) => l.startsWith("NOTION_SYNC_SKIPPED")));

process.stdout.write(failures === 0 ? "\nTodo OK\n" : `\n${failures} comprobaciones FALLAN\n`);
process.exit(failures === 0 ? 0 : 1);
