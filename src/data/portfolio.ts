// Proyectos del portfolio. De momento solo hay uno; la página /portfolio/ se construye con estos datos.
export const billarArrabal = {
  name: "Marcador Billar El Arrabal",
  appUrl: "https://billararrabal.tallerdedigitalizacion.com/",
  // ID del vídeo de YouTube que se incrusta en la página. Es un vídeo de prueba:
  // cámbialo por el vídeo propio (lo que va después de "v=" en la URL de YouTube).
  // Si lo dejas vacío (""), la página muestra un aviso de "vídeo próximamente".
  videoId: "jNQXAC9IVRw",
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
