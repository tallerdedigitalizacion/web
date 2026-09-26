import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { canonicalOverrides, normalizePath } from "./src/config/seoRoutes.mjs";

const site = process.env.PUBLIC_SITE_URL || "https://tallerdedigitalizacion.com";
const base = process.env.PUBLIC_BASE_PATH || "/";

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
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/404") && !(normalizePath(new URL(page).pathname) in canonicalOverrides),
      serialize: (item) => ({ ...item, lastmod: new Date().toISOString() }),
    }),
  ],
});
