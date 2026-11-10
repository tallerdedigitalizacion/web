// Alta del lead en el CRM de Notion (base «CRM · Prospectos»). Se ejecuta ADEMÁS del email, nunca en su lugar:
// ninguna función de este fichero lanza excepciones, y un fallo de Notion solo deja una línea en los logs con lo
// necesario para recuperar el lead a mano.
//
// El fichero no depende de config.ts a propósito: lo comparten la Lambda de la API de leads y la de la autoauditoría
// web, que tienen entornos distintos.

export type NotionChannel = "Formulario web" | "Lead magnet" | "Reserva de llamada" | "Email" | "Otro";

export type NotionAttribution = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  clickId?: string;
  clickIdType?: "gclid" | "gbraid" | "wbraid";
  landing?: string;
};

export type NotionLead = {
  /** Acción del formulario ("contact", "method", …): forma parte de la clave de idempotencia. */
  action: string;
  name: string;
  email: string;
  phone?: string;
  /** Necesidad declarada: mensaje o servicio elegido. */
  need: string;
  channel: NotionChannel;
  attribution?: NotionAttribution;
  /** Clave propia de idempotencia (p. ej. el id de una reserva); si falta, se usa acción + email. */
  dedupeKey?: string;
  /** Ventana de la reserva anti-duplicados; si falta, DUPLICATE_WINDOW_SECONDS. */
  dedupeWindowSeconds?: number;
  /** Origen a usar cuando la atribución no lo determina (p. ej. «Cal.com» para las reservas). */
  fallbackOrigin?: string;
};

export type NotionSyncResult = "created" | "duplicate" | "skipped" | "failed";

/** Reserva anti-duplicados: true si esta clave es nueva en la ventana; false si ya se había reservado. */
export type ClaimFn = (key: string, ttlSeconds: number) => Promise<boolean>;
export type ReleaseFn = (key: string) => Promise<void>;

export type NotionSettings = {
  token: string;
  dataSourceId: string;
  apiUrl: string;
  version: string;
};

const DEFAULT_DATA_SOURCE_ID = "8eb3cf60-b907-42e5-9260-5c2e8644aae0";
const NOTION_VERSION = "2025-09-03";

/** Ventana en la que un reenvío del mismo email y acción no crea otra fila. */
export const DUPLICATE_WINDOW_SECONDS = 60;
const MAX_ATTEMPTS = 3;
const ATTEMPT_TIMEOUT_MS = 4000;
const BACKOFF_MS = [400, 1000];
// Tope de todo el proceso: en Lambda no se puede seguir trabajando tras responder, así que Notion corre en paralelo
// al email y, pase lo que pase, el visitante no espera más de esto por su culpa.
const TOTAL_BUDGET_MS = 9000;

export function notionSettings(env: NodeJS.ProcessEnv = process.env): NotionSettings {
  return {
    token: env.NOTION_TOKEN || "",
    dataSourceId: env.NOTION_DATA_SOURCE_ID || DEFAULT_DATA_SOURCE_ID,
    apiUrl: (env.NOTION_API_URL || "https://api.notion.com").replace(/\/$/, ""),
    version: NOTION_VERSION,
  };
}

// Un lead es de prueba si su campaña termina en «-prueba» o su clic empieza por «TEST».
export function isTestLead(attribution?: NotionAttribution) {
  return /-prueba$/i.test(attribution?.campaign || "") || /^TEST/.test(attribution?.clickId || "");
}

function clean(value?: string) {
  return (value || "").trim();
}

// Mismas reglas que el código de WhatsApp de CookieBanner.astro: (ref: <utm_source>/<utm_campaign>[/<utm_content>]).
// Solo con parámetros UTM: un source que viene del dominio de referencia (sin medium ni campaign) no cuenta.
export function attributionCode(attribution?: NotionAttribution) {
  const source = clean(attribution?.source);
  const hasUtm = Boolean(clean(attribution?.medium) || clean(attribution?.campaign) || clean(attribution?.content) || clean(attribution?.term));
  if (!source || !hasUtm) return "";
  const code = [source, clean(attribution?.campaign) || clean(attribution?.medium), clean(attribution?.content)]
    .filter(Boolean)
    .join("/")
    .replace(/[^\w/.-]/g, "")
    .slice(0, 60);
  return code ? `(ref: ${code})` : "";
}

export function notionOrigin(attribution?: NotionAttribution) {
  const source = clean(attribution?.source).toLowerCase();
  const medium = clean(attribution?.medium).toLowerCase();
  if (source === "google" && medium === "cpc") return "Google Ads";
  if (source === "google" && medium === "organic") return "Búsqueda orgánica Google";
  return "Otro";
}

export function notionAttributionState(attribution?: NotionAttribution) {
  const confirmed = Boolean(clean(attribution?.clickId) || (clean(attribution?.source) && clean(attribution?.campaign)));
  return confirmed ? "Confirmada" : "No atribuido";
}

// El gclid va tal cual; gbraid y wbraid llevan prefijo para no confundirlos con un gclid.
export function notionClickId(attribution?: NotionAttribution) {
  const clickId = clean(attribution?.clickId);
  if (!clickId) return "";
  const type = attribution?.clickIdType;
  return type === "gbraid" || type === "wbraid" ? `${type}:${clickId}` : clickId;
}

// Notion limita cada fragmento de texto a 2000 caracteres.
function clip(value: string) {
  return value.length > 2000 ? `${value.slice(0, 1997)}...` : value;
}

const richText = (value: string) => ({ rich_text: [{ type: "text", text: { content: clip(value) } }] });

// Fecha de hoy (sin hora) en la zona del negocio.
export function todayInMadrid(now = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Madrid" }).format(now);
}

/**
 * Propiedades de la página, con los nombres exactos de la base. Solo se rellena lo que se conoce: el resto
 * (importes, fase, reseña, etc.) queda vacío, sin valores por defecto inventados.
 */
export function buildNotionProperties(lead: NotionLead, now = new Date()) {
  const attribution = lead.attribution;
  const properties: Record<string, unknown> = {};
  const setText = (name: string, value: string) => {
    if (value) properties[name] = richText(value);
  };

  const title = `${isTestLead(attribution) ? "[PRUEBA] " : ""}${clean(lead.name)}`;
  properties["Nombre"] = { title: [{ type: "text", text: { content: clip(title) } }] };
  properties["Email"] = { email: clean(lead.email) };
  if (clean(lead.phone)) properties["Teléfono"] = { phone_number: clean(lead.phone) };
  setText("Necesidad declarada", clean(lead.need));
  properties["Estado"] = { status: { name: "Nuevo" } };
  properties["Primer contacto"] = { date: { start: todayInMadrid(now) } };
  properties["Canal de entrada"] = { select: { name: lead.channel } };
  const origin = notionOrigin(attribution);
  properties["Origen"] = { select: { name: origin === "Otro" && lead.fallbackOrigin ? lead.fallbackOrigin : origin } };
  properties["Atribución"] = { select: { name: notionAttributionState(attribution) } };
  setText("Campaña", clean(attribution?.campaign));
  setText("Anuncio / variante", clean(attribution?.content));
  setText("Palabra clave o término", clean(attribution?.term));
  setText("GCLID", notionClickId(attribution));
  setText("Landing de entrada", clean(attribution?.landing));
  setText("Código de atribución", attributionCode(attribution));
  return properties;
}

function idempotencyKey(lead: NotionLead) {
  if (lead.dedupeKey) return `${lead.action}#${lead.dedupeKey}`;
  return `${lead.action}#${clean(lead.email).toLowerCase()}`;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type AttemptResult = { ok: true } | { ok: false; retry: boolean; status?: number; message: string };

async function attemptCreate(settings: NotionSettings, properties: Record<string, unknown>, timeoutMs: number): Promise<AttemptResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${settings.apiUrl}/v1/pages`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${settings.token}`,
        "notion-version": settings.version,
        "content-type": "application/json",
      },
      body: JSON.stringify({ parent: { type: "data_source_id", data_source_id: settings.dataSourceId }, properties }),
      signal: controller.signal,
    });
    if (response.ok) return { ok: true };
    const detail = (await response.text().catch(() => "")).slice(0, 300);
    // 429 y 5xx son transitorios. El resto (401 token inválido, 403 sin acceso a la base, 400 propiedad inexistente…)
    // se repetiría igual: no se reintenta.
    return { ok: false, retry: response.status === 429 || response.status >= 500, status: response.status, message: detail };
  } catch (error) {
    // Un tiempo agotado es ambiguo (Notion pudo crear la fila igualmente): no se reintenta para no duplicarla.
    const timedOut = error instanceof Error && error.name === "AbortError";
    return { ok: false, retry: !timedOut, message: error instanceof Error ? `${error.name}: ${error.message}` : "Error de red" };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Crea la fila en Notion. Nunca lanza. Con 3 intentos y un tope de tiempo total; si falla, deja en el log una
 * línea `NOTION_SYNC_FAILED` con las propiedades completas para poder crear la fila a mano.
 */
export async function syncLeadToNotion(
  lead: NotionLead,
  deps: { claim?: ClaimFn; release?: ReleaseFn; settings?: NotionSettings; now?: Date } = {},
): Promise<NotionSyncResult> {
  const settings = deps.settings ?? notionSettings();
  if (!settings.token) {
    console.warn("NOTION_SYNC_SKIPPED: NOTION_TOKEN no está configurado; el lead no se envía a Notion.");
    return "skipped";
  }

  let claimedKey = "";
  try {
    const properties = buildNotionProperties(lead, deps.now);

    if (deps.claim) {
      const key = idempotencyKey(lead);
      try {
        if (!(await deps.claim(key, lead.dedupeWindowSeconds ?? DUPLICATE_WINDOW_SECONDS))) return "duplicate";
        claimedKey = key;
      } catch (error) {
        // Mejor una fila duplicada que perder el lead: se sigue sin reserva.
        console.error("NOTION_CLAIM_FAILED:", error instanceof Error ? error.message : error);
      }
    }

    const deadline = Date.now() + TOTAL_BUDGET_MS;
    let last: AttemptResult = { ok: false, retry: false, message: "Sin intentos" };
    let attempts = 0;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      const remaining = deadline - Date.now();
      if (remaining <= 0) break;
      attempts = attempt;
      last = await attemptCreate(settings, properties, Math.min(ATTEMPT_TIMEOUT_MS, remaining));
      if (last.ok) return "created";
      if (!last.retry || attempt === MAX_ATTEMPTS) break;
      await sleep(Math.min(BACKOFF_MS[attempt - 1] ?? 1000, Math.max(0, deadline - Date.now())));
    }

    // Si no se creó, se libera la reserva para que un reenvío del visitante pueda volver a intentarlo.
    if (claimedKey && deps.release) await deps.release(claimedKey).catch(() => undefined);
    console.error(
      `NOTION_SYNC_FAILED ${JSON.stringify({
        action: lead.action,
        attempts,
        status: last.ok ? undefined : last.status,
        reason: last.ok ? undefined : last.message,
        // Lo necesario para crear la fila a mano en Notion (sin el token).
        properties,
      })}`,
    );
    return "failed";
  } catch (error) {
    if (claimedKey && deps.release) await deps.release(claimedKey).catch(() => undefined);
    console.error(
      `NOTION_SYNC_FAILED ${JSON.stringify({
        action: lead.action,
        reason: error instanceof Error ? error.message : "Error desconocido",
        lead: { name: lead.name, email: lead.email, need: lead.need, attribution: lead.attribution },
      })}`,
    );
    return "failed";
  }
}
