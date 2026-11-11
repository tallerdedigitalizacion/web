// Webhook de Cal.com → CRM de Notion. Cada reserva nueva (BOOKING_CREATED) crea una fila «Reserva de llamada».
// Funciones puras (firma y mapeo), sin depender de config.ts, para poder probarlas sin AWS.
import { createHmac, timingSafeEqual } from "node:crypto";
import { isTestLead, notionOrigin, type NotionAttribution, type NotionLead } from "./notion";

/** Una reserva solo se da de alta una vez: Cal.com reintenta los envíos fallidos y este margen cubre sus reintentos. */
export const BOOKING_DEDUPE_SECONDS = 7 * 24 * 60 * 60;

/** Cal.com firma el cuerpo en bruto con HMAC-SHA256 (hex) y lo manda en la cabecera X-Cal-Signature-256. */
export function verifyCalSignature(rawBody: string, signature: string | undefined, secret: string) {
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest();
  const received = Buffer.from(signature.trim().replace(/^sha256=/i, ""), "hex");
  return received.length === expected.length && timingSafeEqual(received, expected);
}

type CalAttendee = { name?: string; email?: string; phoneNumber?: string };
type CalResponseValue = { value?: unknown } | string;

export type CalWebhookBody = {
  triggerEvent?: string;
  payload?: {
    uid?: string;
    bookingId?: number | string;
    title?: string;
    eventTitle?: string;
    type?: string;
    startTime?: string;
    attendees?: CalAttendee[];
    responses?: Record<string, CalResponseValue>;
    metadata?: Record<string, unknown>;
  };
};

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const responseText = (responses: Record<string, CalResponseValue> | undefined, key: string) => {
  const entry = responses?.[key];
  return text(typeof entry === "object" && entry !== null ? entry.value : entry);
};

/** Fecha y hora de la llamada en la zona del negocio: «2026-11-20 10:30 (hora de Madrid)». */
export function formatCallTime(startTime: string | undefined) {
  const date = startTime ? new Date(startTime) : undefined;
  if (!date || Number.isNaN(date.getTime())) return "fecha no indicada";
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return `${parts} (hora de Madrid)`;
}

// Cal.com solo devuelve en el webhook lo que viaja en `metadata` o en los campos de la reserva; si la atribución
// llega, se lee de ahí con los mismos nombres que usa la web (utm_*, gclid…). Si no llega, la reserva queda sin atribuir.
function attributionFromBooking(payload: NonNullable<CalWebhookBody["payload"]>): NotionAttribution | undefined {
  const metadata = payload.metadata ?? {};
  const pick = (...keys: string[]) => {
    for (const key of keys) {
      const value = text(metadata[key]) || responseText(payload.responses, key);
      if (value) return value;
    }
    return "";
  };
  // Los nombres llegan tal cual los guarda la web en `metadata[...]` (CampaignBooking.astro): utm_*, gclid, landing y ref.
  const gclid = pick("gclid");
  const gbraid = pick("gbraid");
  const wbraid = pick("wbraid");
  const clickId = gclid || gbraid || wbraid || pick("clickId");
  const attribution: NotionAttribution = {
    source: pick("utm_source", "source"),
    medium: pick("utm_medium", "medium"),
    campaign: pick("utm_campaign", "campaign"),
    content: pick("utm_content", "content"),
    term: pick("utm_term", "term"),
    clickId,
    clickIdType: gclid ? "gclid" : gbraid ? "gbraid" : wbraid ? "wbraid" : undefined,
    landing: pick("landing"),
  };
  return Object.values(attribution).some(Boolean) ? attribution : undefined;
}

export type CalBookingResult =
  | { kind: "ignored"; reason: string }
  | { kind: "booking"; lead: NotionLead };

/** Convierte el cuerpo del webhook en un alta de CRM. Solo se atiende BOOKING_CREATED. */
export function notionLeadFromCalWebhook(body: CalWebhookBody): CalBookingResult {
  if (body.triggerEvent !== "BOOKING_CREATED") return { kind: "ignored", reason: `evento ${body.triggerEvent ?? "desconocido"}` };
  const payload = body.payload;
  if (!payload) return { kind: "ignored", reason: "sin payload" };

  const attendee = payload.attendees?.[0];
  const email = text(attendee?.email) || responseText(payload.responses, "email");
  if (!email) return { kind: "ignored", reason: "reserva sin email del asistente" };
  const rawName = text(attendee?.name) || responseText(payload.responses, "name") || email;
  const phone = text(attendee?.phoneNumber) || responseText(payload.responses, "attendeePhoneNumber");
  const bookingId = text(payload.uid) || (payload.bookingId !== undefined ? String(payload.bookingId) : "");
  const attribution = attributionFromBooking(payload);
  // Con campaña o clic de Google la reserva viene de un anuncio; sin ellos solo se sabe que entró por Cal.com.
  const fromAd = Boolean(attribution?.campaign || attribution?.clickId);
  const detected = notionOrigin(attribution);
  // Reservas de prueba: nombre o email que empiezan por PRUEBA. Si ya se marcan por la campaña, buildNotionProperties pone el prefijo.
  const looksTest = /^prueba/i.test(rawName) || /^prueba/i.test(email);
  const name = looksTest && !isTestLead(attribution) ? `[PRUEBA] ${rawName}` : rawName;
  const eventName = text(payload.eventTitle) || text(payload.title) || text(payload.type);

  return {
    kind: "booking",
    lead: {
      action: "cal-booking",
      name,
      email,
      phone: phone || undefined,
      need: `Reserva de llamada: ${formatCallTime(payload.startTime)}${eventName ? ` · ${eventName}` : ""}`,
      channel: "Reserva de llamada",
      attribution,
      origin: detected !== "Otro" ? detected : fromAd ? "Google Ads" : "Cal.com",
      attributionState: fromAd ? "Confirmada" : "No atribuido",
      // Sin id de reserva se cae a email + hora, que sigue siendo único por cita.
      dedupeKey: bookingId || `${email.toLowerCase()}#${text(payload.startTime)}`,
      dedupeWindowSeconds: BOOKING_DEDUPE_SECONDS,
    },
  };
}
