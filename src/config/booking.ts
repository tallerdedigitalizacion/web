// Única fuente de verdad de los enlaces de "reservar llamada", uno por idioma. Cámbialos aquí y se
// actualizan en toda la web, en los emails del backend y en los selectores de seguimiento (UTMs, GA4).
export const BOOKING_URL_ES = "https://cal.com/taller-de-digitalizacion/llamada-gratuita-de-15-minutos";
export const BOOKING_URL_EN = "https://cal.com/taller-de-digitalizacion/free-15-min-call";

// Alias del enlace en español (idioma por defecto del sitio).
export const BOOKING_URL = BOOKING_URL_ES;
export const BOOKING_URLS = [BOOKING_URL_ES, BOOKING_URL_EN];

export function bookingUrlFor(lang: string | undefined): string {
  return lang === "en" ? BOOKING_URL_EN : BOOKING_URL_ES;
}
