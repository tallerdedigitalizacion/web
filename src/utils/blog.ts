import { getCollection } from "astro:content";

// Solo se publican los artículos cuya fecha ya ha llegado. La GitHub Action de despliegue
// reconstruye la web cada mañana, así que un artículo con fecha futura aparece solo ese día.
// Para revisar los programados en local: BLOG_PREVIEW=1 npm run dev
export async function getPublishedPosts() {
  const now = process.env.BLOG_PREVIEW ? new Date("9999-12-31") : new Date();
  const posts = await getCollection("blog", ({ data }) => data.pubDate <= now);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export type BlogCategory = "servicio" | "progreso" | "caso" | "pregunta";

// Orden de la barra de filtros del índice.
export const blogCategories: { slug: BlogCategory; label: string; description: string }[] = [
  { slug: "servicio", label: "Servicios", description: "Artículos sobre los servicios del taller: qué incluyen, cómo se trabajan y para quién son." },
  { slug: "progreso", label: "Progreso del taller", description: "Cómo avanza el Taller de Digitalización: lo que probamos, lo que construimos y lo que aprendemos por el camino." },
  { slug: "caso", label: "Casos reales", description: "Casos reales de PyMEs y negocios locales: el problema de partida, qué se hizo y qué resultado dio." },
  { slug: "pregunta", label: "Preguntas de empresa", description: "Respuestas claras a las preguntas de informática y digitalización que me hacen las empresas." },
];

export const categoryLabel = (slug: BlogCategory) => blogCategories.find((category) => category.slug === slug)!.label;
export const categoryPath = (slug: BlogCategory) => `/blog/categoria/${slug}/`;

// Categorías con al menos un artículo ya publicado, en el orden de la barra de filtros.
export async function getPublishedCategories() {
  const posts = await getPublishedPosts();
  const used = new Set(posts.map((post) => post.data.categoria));
  return blogCategories.filter((category) => used.has(category.slug));
}
