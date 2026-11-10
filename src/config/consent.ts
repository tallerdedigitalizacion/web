// Constantes del consentimiento de cookies compartidas por el script del <head> (BaseLayout) y el banner
// (CookieBanner). Si cambian, cambian en los dos sitios a la vez.

// Clave de localStorage donde el banner guarda la decisión del visitante.
export const consentStorageKey = "td_cookie_consent";

// Se sube cuando cambian las categorías del banner, para volver a pedir el consentimiento una vez.
// 4: la categoría «Marketing» (Google Ads / Meta) está siempre disponible, antes solo con Meta Pixel.
export const consentVersion = 4;

// La AEPD recomienda no conservar el consentimiento más de 24 meses; lo pedimos de nuevo a los 12.
export const consentMaxAgeMs = 365 * 24 * 60 * 60 * 1000;
