import { defineConfig } from "astro/config";

const site = process.env.PUBLIC_SITE_URL || "https://tallerdedigitalizacion.github.io";
const base = process.env.PUBLIC_BASE_PATH || "/web";

export default defineConfig({
  site,
  base,
  output: "static",
});
