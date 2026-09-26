import { getCollection } from "astro:content";

// Solo se publican los artículos cuya fecha ya ha llegado. La GitHub Action de despliegue
// reconstruye la web cada mañana, así que un artículo con fecha futura aparece solo ese día.
// Para revisar los programados en local: BLOG_PREVIEW=1 npm run dev
export async function getPublishedPosts() {
  const now = process.env.BLOG_PREVIEW ? new Date("9999-12-31") : new Date();
  const posts = await getCollection("blog", ({ data }) => data.pubDate <= now);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
