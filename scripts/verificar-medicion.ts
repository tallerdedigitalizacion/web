// Verificación de la parte de servidor de la medición: comprueba que la atribución que envía la web sobrevive al
// esquema del backend (no se corta ni se pierde ningún campo) y que el email de aviso la muestra entera.
// No envía nada, no toca AWS y no necesita variables de entorno.
//
// Uso:
//   npx tsx scripts/verificar-medicion.ts                    # con la carga de ejemplo (URL de prueba estándar)
//   npx tsx scripts/verificar-medicion.ts payload.json       # con la carga real copiada de la pestaña Red
//
// `payload.json` es el cuerpo de la petición POST /lead/contact (o el que devuelva
// `tdVerify.interceptLeads()` en la consola; ver docs/verificacion-medicion.md).
import { readFileSync } from "node:fs";
import { contactLeadSchema } from "../backend/src/schemas";
import { notificationEmail } from "../backend/src/email/templates";

const expected = {
  source: "google",
  medium: "cpc",
  campaign: "C99-prueba",
  content: "A",
  term: "prueba",
  clickId: "TEST123",
  clickIdType: "gclid",
};

const sample = {
  service: "Soporte informático",
  name: "Prueba Medición",
  email: "prueba@example.com",
  company: "",
  phone: "",
  message: "Mensaje de prueba de la verificación de medición.",
  privacyAccepted: true,
  marketingAccepted: false,
  website: "",
  startedAt: Date.now() - 10_000,
  pageUrl: "https://tallerdedigitalizacion.com/lp/C99-prueba/?gclid=TEST123&utm_source=google&utm_medium=cpc&utm_campaign=C99-prueba&utm_content=A&utm_term=prueba",
  attribution: { ...expected, landing: "/lp/C99-prueba/" },
  userAgent: "verificar-medicion",
};

const file = process.argv[2];
const payload: unknown = file ? JSON.parse(readFileSync(file, "utf8")) : sample;
const useExpected = !file;

const parsed = contactLeadSchema.parse(payload);
const { website: _website, ...row } = parsed;
const email = notificationEmail("contact", parsed, "Lead id: (simulado)");

const results: [string, boolean, string][] = [];
const check = (label: string, ok: boolean, detail = "") => results.push([label, ok, detail]);

const attribution = (row.attribution ?? {}) as Record<string, string | undefined>;
for (const key of ["source", "medium", "campaign", "content", "term", "clickId", "clickIdType", "landing"]) {
  check(`fila de la base de datos: attribution.${key}`, Boolean(attribution[key]), String(attribution[key] ?? "(vacío)"));
}
check("fila de la base de datos: pageUrl", Boolean(row.pageUrl), String(row.pageUrl ?? "(vacío)"));

const text = email.text;
for (const label of ["Fuente (utm_source)", "Medio (utm_medium)", "Campaña (utm_campaign)", "Contenido (utm_content)", "Término (utm_term)", "Landing", "Página (pageUrl)"]) {
  const line = text.split("\n").find((l) => l.startsWith(`${label}:`));
  check(`email de aviso: ${label}`, Boolean(line) && !line!.endsWith(": -"), line ?? "(falta)");
}
const clickLine = text.split("\n").find((l) => l.startsWith("ID de clic"));
check("email de aviso: ID de clic con su tipo", Boolean(clickLine) && /^ID de clic \((gclid|gbraid|wbraid)\):/.test(clickLine!) && !clickLine!.endsWith(": -"), clickLine ?? "(falta)");
check("email de aviso (HTML): ID de clic con su tipo", /ID de clic \((gclid|gbraid|wbraid)\):/.test(email.html));

if (useExpected) {
  for (const [key, value] of Object.entries(expected)) {
    check(`valor esperado de la URL de prueba: ${key}`, attribution[key] === value, `${attribution[key]} (esperado ${value})`);
  }
}

// Un gclid largo no debe cortarse ni rechazarse.
const longClickId = "Cj0KCQjw".padEnd(180, "x");
const longPayload = { ...(payload as object), attribution: { ...attribution, clickId: longClickId }, pageUrl: `https://tallerdedigitalizacion.com/?gclid=${longClickId}&${"utm_term=a&".repeat(30)}` };
let longOk = false;
try {
  longOk = contactLeadSchema.parse(longPayload).attribution?.clickId === longClickId;
} catch {
  longOk = false;
}
check("gclid de 180 caracteres: se acepta entero", longOk);

console.log("\n=== Fila que se guardaría en DynamoDB (simulada, sin ipHash) ===");
console.log(JSON.stringify(row, null, 2));
console.log("\n=== Email de aviso (texto) ===");
console.log(text);
console.log("\n=== Resultado ===");
let failed = 0;
for (const [label, ok, detail] of results) {
  if (!ok) failed++;
  console.log(`${ok ? "OK   " : "FALLA"} ${label}${detail ? ` -> ${detail}` : ""}`);
}
console.log(failed === 0 ? "\nTodo OK" : `\n${failed} punto(s) con FALLA`);
process.exit(failed === 0 ? 0 : 1);
