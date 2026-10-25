// Vídeos de YouTube de la web, un sitio único para todos.
// Pega el enlace del vídeo (o solo su ID) en la clave que corresponda. Si la clave está vacía o no existe,
// el vídeo no se muestra: no hay vídeo de relleno.
//
// Las claves de caso son el `slug` de cada caso en src/data/casePages.ts. El vídeo sale en:
//   - la página /casos/<slug>/
//   - debajo del "Caso real" de todas las páginas de servicio, producto y diagnóstico que enseñan ese caso.
// Las claves de portfolio salen en su página de /portfolio/.
export const videos: Record<string, string> = {
  // Casos reales
  "conciliacion-proveedores": "https://www.youtube.com/watch?v=0RZ21zqMD3o",
  "dar-de-baja-software-historico": "https://www.youtube.com/watch?v=rZhTE-mLBT0",
  "consulta-cobertura-ia": "https://www.youtube.com/watch?v=hQCEmBElN7c",
  "entrada-facturas-automatica": "https://www.youtube.com/watch?v=BHFEujLCyM4",
  // Portfolio
  "portfolio-billar-arrabal": "https://www.youtube.com/watch?v=ajKE3t1VLT4",
};

// Vídeos por tema de servicio: clave -> enlace y título (el de YouTube, que también es el título accesible del reproductor).
export const topicVideos: Record<string, { url: string; title: string }> = {
  "ai-whatsapp": { url: "https://www.youtube.com/watch?v=2741B3XU7bY", title: "Un asistente de IA que contesta tu WhatsApp, también a las 3 de la mañana" },
  ciberseguridad: { url: "https://www.youtube.com/watch?v=psPH_800Xqg", title: "Auditoría de ciberseguridad para tu empresa, explicada en cristiano" },
  contrasenas: { url: "https://www.youtube.com/watch?v=Oibcvu5Rmjw", title: "Las contraseñas de tu empresa: un gestor para que no estén repartidas por todos lados" },
  crm: { url: "https://www.youtube.com/watch?v=6JOSFFPzjJM", title: "Un CRM para que no se te pierda ningún cliente que te escribe por WhatsApp, correo o teléfono" },
  diagnostico: { url: "https://www.youtube.com/watch?v=HPLAUnjJRQU", title: "¿Necesita tu empresa un diagnóstico? Si no sabes explicar el problema, sí" },
  funnel: { url: "https://www.youtube.com/watch?v=Iku8FQQCHEo", title: "Funnel de ventas completo: del anuncio a la landing, el CRM y los emails" },
  "google-drive": { url: "https://www.youtube.com/watch?v=aJlOeqpnB_8", title: "Ordena el Google Drive de tu empresa: seguridad, trazabilidad y formación" },
  "google-workspace": { url: "https://www.youtube.com/watch?v=vFeppzgYCCM", title: "Correos compartidos (info@, administración@) sin caos: Google Workspace bien montado" },
  mantenimiento: { url: "https://www.youtube.com/watch?v=bo43V0HEqqg", title: "Mantenimiento informático proactivo: backups que se restauran y ordenadores que duran más" },
  "oraculo-ia": { url: "https://www.youtube.com/watch?v=vnchqfTXhWQ", title: "El oráculo interno: una IA que responde a tu equipo con los procesos de tu empresa" },
  "web-lenta": { url: "https://www.youtube.com/watch?v=VWb_iq_xN34", title: "Tu web carga lenta y no sale en Google: cómo saber por qué y arreglarlo" },
  webs: { url: "https://www.youtube.com/watch?v=gM2_OmlEWVk", title: "Hacer una web con IA es fácil. Hacerla bien, no: lo que necesitas saber" },
};

// Qué vídeo por tema sale en cada página de servicio (ruta -> clave de topicVideos). Sale en una sección "En vídeo" justo
// encima del "Caso real"; las páginas sin entrada aquí no llevan vídeo. Las páginas en inglés no llevan vídeo (los vídeos están en español).
const topicByPath: Record<string, string> = {
  "/agente-ia-atencion-cliente/": "ai-whatsapp",
  "/ciberseguridad-empresas-toledo/": "ciberseguridad",
  "/gestor-contrasenas-empresas/": "contrasenas",
  "/gestion-centralizada-accesos/": "contrasenas",
  "/gestion-leads-crm/": "crm",
  "/centralizacion-leads/": "crm",
  "/diagnostico-en-tu-empresa/": "diagnostico",
  "/diagnostico-caos-operativo/": "diagnostico",
  "/diagnostico-digitalizacion/": "diagnostico",
  "/landing-page-campanas/": "funnel",
  "/landing-pages-conversion/": "funnel",
  "/reestructuracion-google-drive/": "google-drive",
  "/google-workspace-empresas-toledo/": "google-workspace",
  "/reorganizacion-google-workspace/": "google-workspace",
  "/mantenimiento-informatico-toledo/": "mantenimiento",
  "/informatico-empresas-toledo/": "mantenimiento",
  "/informatico-fuensalida-torrijos/": "mantenimiento",
  "/informatico-illescas-la-sagra/": "mantenimiento",
  "/informatico-navalcarnero-mostoles/": "mantenimiento",
  "/oraculo-interno/": "oraculo-ia",
  "/asistente-ia-empresa/": "oraculo-ia",
  "/optimizacion-velocidad-web/": "web-lenta",
  "/informe-gratuito-web/": "web-lenta",
  "/diseno-web-toledo/": "webs",
};

// Acepta un enlace de YouTube (watch?v=, youtu.be/, /embed/, /shorts/, /live/) o un ID suelto (11 caracteres).
const idPattern = /^[A-Za-z0-9_-]{11}$/;

export const youtubeId = (value?: string): string | undefined => {
  const raw = value?.trim();
  if (!raw) return undefined;
  if (idPattern.test(raw)) return raw;
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    const candidate =
      host === "youtu.be"
        ? url.pathname.split("/")[1]
        : url.searchParams.get("v") ?? url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
    return candidate && idPattern.test(candidate) ? candidate : undefined;
  } catch {
    return undefined;
  }
};

export const videoIdFor = (key: string): string | undefined => youtubeId(videos[key]);

export const topicVideoForPath = (path: string): { id: string; title: string } | undefined => {
  const normalized = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}/`;
  const topic = topicVideos[topicByPath[normalized]];
  const id = youtubeId(topic?.url);
  return topic && id ? { id, title: topic.title } : undefined;
};
