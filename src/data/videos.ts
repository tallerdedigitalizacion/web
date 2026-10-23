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
  "conciliacion-proveedores": "",
  "dar-de-baja-software-historico": "",
  "consulta-cobertura-ia": "",
  "entrada-facturas-automatica": "",
  // Portfolio
  "portfolio-billar-arrabal": "",
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
