import { readdirSync, readFileSync } from "node:fs";

// URLs de artículos del blog marcados con `noindex: true` en su frontmatter. astro.config.mjs las usa para
// sacarlas del sitemap (el filtro del sitemap solo ve URLs, no el contenido del blog).
export function noindexBlogPaths(dir = new URL("../content/blog/", import.meta.url)) {
  return readdirSync(dir)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .filter((file) => {
      const frontmatter = readFileSync(new URL(file, dir), "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
      return /^noindex:\s*true\s*$/m.test(frontmatter);
    })
    .map((file) => `/blog/${file.replace(/\.mdx?$/, "")}`);
}
