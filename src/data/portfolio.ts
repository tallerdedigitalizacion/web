// Proyectos del portfolio. De momento solo hay uno; la página /portfolio/ se construye con estos datos.
export const billarArrabal = {
  name: "Marcador Billar El Arrabal",
  appUrl: "https://billararrabal.tallerdedigitalizacion.com/",
  // El vídeo de YouTube se registra en src/data/videos.ts (clave "portfolio-billar-arrabal").
  images: {
    menu: { src: "/portfolio/billar-arrabal-menu.jpg", alt: "Menú principal de la app del Billar El Arrabal, con los botones Nueva partida, Estadísticas, Opciones y Ayuda", width: 800, height: 500 },
    scoreboard: { src: "/portfolio/billar-arrabal-marcador.jpg", alt: "Marcador de la app durante una partida: puntos, promedio, entrada, tiempo y barra de tiempo del turno de cada jugador", width: 800, height: 500 },
    og: { src: "/portfolio/og-billar-arrabal.jpg", alt: "Marcador de la app del Billar El Arrabal durante una partida" },
  },
  features: [
    "Marcador de carambola con puntos, entradas, promedio y fallos de cada jugador.",
    "Barra de tiempo por turno que se va vaciando mientras el jugador piensa.",
    "Graba la partida en vídeo con el marcador sobreimpreso.",
    "Sube la grabación a YouTube.",
    "Estadísticas por entrada.",
    "En español e inglés, en el navegador y gratis.",
  ],
  quote: {
    lines: ["Me gusta mucho la barra de tiempo que va mostrando.", "Así de simple, la app la pueden usar todos."],
    author: "Pedro, Billar El Arrabal",
  },
};

// Páginas de servicio que, además del caso real, enseñan un proyecto del portfolio (con su vídeo si lo hay).
// Clave: ruta de la página; valor: clave del vídeo en src/data/videos.ts.
const portfolioByPath: Record<string, string> = {
  "/herramientas-internas-medida/": "portfolio-billar-arrabal",
};

export const portfolioVideoKeyForPath = (path: string) => {
  const normalized = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}/`;
  return portfolioByPath[normalized];
};
