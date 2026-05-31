import { defineConfig } from "astro/config";

const site = process.env.PUBLIC_SITE_URL || "https://tallerdedigitalizacion.com";

export default defineConfig({
  site,
  output: "static",
});
