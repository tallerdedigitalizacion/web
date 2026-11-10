// URLs antiguas que ya no tienen contenido propio y llevan a la página vigente.
//
// La web se publica en GitHub Pages, que no puede responder con un 301 HTTP. Astro genera para cada entrada una página
// con <meta http-equiv="refresh">, que pierde la query string (UTM, gclid…). Después de compilar, la integración de
// astro.config.mjs reescribe esas páginas con `redirectPageHtml`: un script que conserva query y hash, el enlace
// canónico a la página nueva y, sin JavaScript, el meta refresh de siempre.
export const legacyRedirects = {
  // URLs publicadas entre junio y julio de 2026 que se sustituyeron por páginas nuevas.
  "/auditoria-web": "/informe-gratuito-web/",
  "/en/web-audit": "/free-website-report/",
  "/agente-oraculo-ia-interno": "/asistente-ia-empresa/",
  "/agente-soporte-cliente-ia": "/agente-ia-atencion-cliente/",
  "/arranque-digital-negocios": "/diseno-web-toledo/",
  // Octubre de 2026: nombres de comprador en la URL.
  "/funnel-web": "/landing-page-campanas/",
  "/external-oracle": "/ai-chatbot-small-business/",
  "/internal-oracle": "/ai-knowledge-base/",
  "/lead-centralization": "/crm-implementation/",
  "/centralized-access-management": "/business-password-manager-setup/",
  // Noviembre de 2026: landings de campaña (Google Ads) con nombre que describe el servicio.
  "/herramientas-internas-medida": "/desarrollo-software-a-medida/",
  "/custom-internal-tools": "/custom-software-development/",
};

const escapeHtml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// `target` es la ruta de destino con la base ya aplicada (p. ej. "/desarrollo-software-a-medida/"); `absolute`, su URL completa.
export function redirectPageHtml(target, absolute) {
  const safeTarget = escapeHtml(target);
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Redirigiendo… / Redirecting…</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="${escapeHtml(absolute)}">
<script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script>
<noscript><meta http-equiv="refresh" content="0;url=${safeTarget}"></noscript>
</head>
<body>
<p>Esta página se ha movido a <a href="${safeTarget}">${safeTarget}</a>. / This page has moved to <a href="${safeTarget}">${safeTarget}</a>.</p>
</body>
</html>
`;
}
