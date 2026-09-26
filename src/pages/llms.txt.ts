import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { siteConfig } from "@/config/site";
import { localPages } from "@/data/localPages";
import { productPages } from "@/data/productPages";
import { serviceCatalog } from "@/data/services";

// Se genera en cada build para que los asistentes de IA vean siempre las páginas y datos actuales.
export const GET: APIRoute = async () => {
  const url = (path: string) => new URL(path, siteConfig.publicUrl).toString();
  const posts = (await getCollection("blog")).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const { address } = siteConfig;
  const catalogHrefs = new Set(serviceCatalog.map((service) => service.href));
  const extraPages = [...localPages, ...productPages].filter((page) => !catalogHrefs.has(`/${page.slug}/`));

  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> Soporte informático, ciberseguridad, webs y digitalización para empresas, autónomos y PyMEs. Base en ${address.addressLocality} (${address.addressRegion}, España). Trabajo presencial en un radio de ${siteConfig.serviceRadiusKm} km y en remoto con toda España. Lo dirige ${siteConfig.founder}, con ${siteConfig.experienceYears} años de experiencia resolviendo problemas técnicos para empresas, cientos de clientes atendidos y certificado como desarrollador de software.`,
    "",
    "## Datos de contacto",
    "",
    `- Nombre: ${siteConfig.name} (titular: ${siteConfig.founder})`,
    `- Dirección: ${address.streetAddress}, ${address.postalCode} ${address.addressLocality}, ${address.addressRegion}, España`,
    `- Teléfono: +34 ${siteConfig.phoneDisplay}`,
    `- Email: ${siteConfig.contactEmail}`,
    `- Horario: ${siteConfig.openingHours.map((h) => h.label).join("; ")}`,
    `- Reservar llamada gratuita (30 min): ${siteConfig.bookingUrl}`,
    `- Soporte remoto: AnyDesk (${url("/soporte-remoto/")})`,
    `- Reseñas en Google: ${siteConfig.googleBusinessUrl}`,
    `- LinkedIn de ${siteConfig.founder}: ${siteConfig.linkedinUrl}`,
    "",
    "## Servicios",
    "",
    ...serviceCatalog.map((service) => `- [${service.label}](${url(service.href)}): ${service.summary}`),
    ...extraPages.map((page) => `- [${page.h1.replace(/\.$/, "")}](${url(`/${page.slug}/`)}): ${page.description}`),
    `- [Website speed optimization (English)](${url("/website-speed-optimization/")}): the website speed service for English-speaking clients.`,
    "",
    `## Zona de servicio presencial (municipios a menos de ${siteConfig.serviceRadiusKm} km de ${address.addressLocality})`,
    "",
    ...siteConfig.serviceRegions.map((region) => `- ${region.name}: ${region.towns.join(", ")}`),
    "",
    "## Cómo trabaja",
    "",
    "- Primera llamada gratuita de 30 minutos; si no hay encaje, lo dice.",
    "- Presupuesto cerrado antes de empezar.",
    "- Proceso: llamada, propuesta cerrada, implementación y mantenimiento.",
    "- Explicaciones sin tecnicismos y sin vender servicios innecesarios.",
    "",
    "## Blog",
    "",
    ...posts.map((post) => `- [${post.data.title}](${url(`/blog/${post.slug}/`)}): ${post.data.description}`),
    "",
    "## Legal",
    "",
    `- [Aviso legal](${url("/aviso-legal/")})`,
    `- [Política de privacidad](${url("/politica-privacidad/")})`,
    "",
  ];

  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
