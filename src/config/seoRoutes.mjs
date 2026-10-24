// Reglas de URL compartidas por BaseLayout (canonical/hreflang) y astro.config.mjs (sitemap).

// Páginas antiguas que se solapan con una página más completa: siguen publicadas para no romper enlaces,
// pero declaran la nueva como canónica y salen del sitemap.
export const canonicalOverrides = {
  "/oraculo-interno": "/asistente-ia-empresa",
  "/oraculo-externo": "/agente-ia-atencion-cliente",
  "/gestion-centralizada-accesos": "/gestor-contrasenas-empresas",
  "/centralizacion-leads": "/gestion-leads-crm",
  "/landing-pages-conversion": "/landing-page-campanas",
  "/reorganizacion-google-workspace": "/google-workspace-empresas-toledo",
};

// Parejas ES/EN publicadas como hreflang (sin redirecciones automáticas por idioma, que Google desaconseja).
export const languagePairs = [
  ["/", "/en"],
  ["/diagnostico-digitalizacion", "/digitalization-assessment"],
  ["/google-workspace-empresas-toledo", "/google-workspace-reorganization"],
  ["/reestructuracion-google-drive", "/corporate-google-drive-restructuring"],
  ["/gestor-contrasenas-empresas", "/business-password-manager-setup"],
  ["/gestion-leads-crm", "/crm-implementation"],
  ["/landing-page-campanas", "/conversion-landing-pages"],
  ["/asistente-ia-empresa", "/ai-knowledge-base"],
  ["/agente-ia-atencion-cliente", "/ai-chatbot-small-business"],
  ["/integracion-sistemas", "/systems-integration"],
  ["/herramientas-internas-medida", "/custom-internal-tools"],
  ["/informe-gratuito-web", "/free-website-report"],
  ["/politica-privacidad", "/privacy-policy"],
  ["/optimizacion-velocidad-web", "/website-speed-optimization"],
  ["/mantenimiento-informatico-toledo", "/managed-it-support"],
  ["/mantenimiento-wordpress", "/managed-website"],
  ["/plan-operaciones-ia", "/operations-ai-plan"],
];

export const normalizePath = (path) => (path.length > 1 ? path.replace(/\/$/, "") : path);
