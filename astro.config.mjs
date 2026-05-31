import { defineConfig } from "astro/config";

const site = process.env.PUBLIC_SITE_URL || "https://tallerdedigitalizacion.com";
const base = process.env.PUBLIC_BASE_PATH || "/";

export default defineConfig({
  site,
  base,
  output: "static",
});
