import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { canonicalOverrides, normalizePath } from "./src/config/seoRoutes.mjs";
import { noindexBlogPaths } from "./src/config/blogNoindex.mjs";
import { legacyRedirects, redirectPageHtml } from "./src/config/legacyRedirects.mjs";

const site = process.env.PUBLIC_SITE_URL || "https://tallerdedigitalizacion.com";
const base = process.env.PUBLIC_BASE_PATH || "/";
const noindexPaths = new Set(noindexBlogPaths());

// Astro genera las redirecciones como meta refresh, que pierde la query string (UTM, gclid). Al terminar la
// compilación se reescriben con un script que la conserva (ver src/config/legacyRedirects.mjs).
const redirectsKeepingQuery = () => ({
  name: "redirects-keeping-query",
  hooks: {
    "astro:build:done": async ({ dir }) => {
      const prefix = base.replace(/\/$/, "");
      for (const [from, to] of Object.entries(legacyRedirects)) {
        const target = `${prefix}${to}`;
        const file = fileURLToPath(new URL(`.${from.replace(/\/$/, "")}/index.html`, dir));
        await mkdir(dirname(file), { recursive: true });
        await writeFile(file, redirectPageHtml(target, new URL(target, site).toString()));
      }
    },
  },
});

export default defineConfig({
  site,
  base,
  output: "static",
  redirects: legacyRedirects,
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/404") && !page.endsWith("/hub/") && !page.endsWith("/reserva-confirmada/") && !page.endsWith("/booking-confirmed/") && !(normalizePath(new URL(page).pathname) in canonicalOverrides) && !noindexPaths.has(normalizePath(new URL(page).pathname)),
      serialize: (item) => ({ ...item, lastmod: new Date().toISOString() }),
    }),
    redirectsKeepingQuery(),
  ],
});
