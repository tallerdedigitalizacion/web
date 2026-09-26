import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { canonicalOverrides, normalizePath } from "./src/config/seoRoutes.mjs";

const site = process.env.PUBLIC_SITE_URL || "https://tallerdedigitalizacion.com";
const base = process.env.PUBLIC_BASE_PATH || "/";

export default defineConfig({
  site,
  base,
  output: "static",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/404") && !(normalizePath(new URL(page).pathname) in canonicalOverrides),
      serialize: (item) => ({ ...item, lastmod: new Date().toISOString() }),
    }),
  ],
});
