import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().max(170),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // Clasifica el artículo; las etiquetas visibles están en src/utils/blog.ts.
    categoria: z.enum(["servicio", "progreso", "caso", "pregunta"]).default("pregunta"),
    // ID de YouTube (11 caracteres); si existe, se incrusta arriba del texto.
    videoYoutube: z.string().regex(/^[A-Za-z0-9_-]{11}$/).optional(),
    // Si falta, el formulario de contacto del artículo no preselecciona servicio.
    relatedService: z.string().optional(),
    // true: el artículo se publica con noindex,follow y sale del sitemap.
    noindex: z.boolean().default(false),
  }),
});

export const collections = { blog };
