import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { canonicalOverrides, normalizePath } from "./src/config/seoRoutes.mjs";
import { noindexBlogPaths } from "./src/config/blogNoindex.mjs";

const site = process.env.PUBLIC_SITE_URL || "https://tallerdedigitalizacion.com";
const base = process.env.PUBLIC_BASE_PATH || "/";
const noindexPaths = new Set(noindexBlogPaths());

export default defineConfig({
  site,
  base,
  output: "static",
  // URLs publicadas entre junio y julio de 2026 que se sustituyeron por páginas nuevas.
  redirects: {
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
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/404") && !page.endsWith("/hub/") && !(normalizePath(new URL(page).pathname) in canonicalOverrides) && !noindexPaths.has(normalizePath(new URL(page).pathname)),
      serialize: (item) => ({ ...item, lastmod: new Date().toISOString() }),
    }),
  ],
});
