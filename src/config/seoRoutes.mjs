// Reglas de URL compartidas por BaseLayout (canonical/hreflang) y astro.config.mjs (sitemap).

// Páginas antiguas que se solapan con una página más completa: siguen publicadas para no romper enlaces,
// pero declaran la nueva como canónica y salen del sitemap.
export const canonicalOverrides = {
  "/oraculo-interno": "/asistente-ia-empresa",
  "/oraculo-externo": "/agente-ia-atencion-cliente",
  "/gestion-centralizada-accesos": "/gestor-contrasenas-empresas",
  "/centralizacion-leads": "/gestion-leads-crm",
  "/landing-pages-conversion": "/funnel-web",
  "/reorganizacion-google-workspace": "/google-workspace-empresas-toledo",
};

// Parejas ES/EN publicadas como hreflang (sin redirecciones automáticas por idioma, que Google desaconseja).
export const languagePairs = [
  ["/", "/en"],
  ["/diagnostico-digitalizacion", "/digitalization-assessment"],
  ["/google-workspace-empresas-toledo", "/google-workspace-reorganization"],
  ["/reestructuracion-google-drive", "/corporate-google-drive-restructuring"],
  ["/gestor-contrasenas-empresas", "/centralized-access-management"],
  ["/gestion-leads-crm", "/lead-centralization"],
  ["/funnel-web", "/conversion-landing-pages"],
  ["/asistente-ia-empresa", "/internal-oracle"],
  ["/agente-ia-atencion-cliente", "/external-oracle"],
  ["/integracion-sistemas", "/systems-integration"],
  ["/herramientas-internas-medida", "/custom-internal-tools"],
  ["/informe-gratuito-web", "/free-website-report"],
  ["/optimizacion-velocidad-web", "/website-speed-optimization"],
];

export const normalizePath = (path) => (path.length > 1 ? path.replace(/\/$/, "") : path);
