// Interruptores de publicación. Cambia un valor y vuelve a compilar.
//
// automationLandingLive: las landings de automatización (/automatizacion-procesos-ia/ y /ai-process-automation/) están aparcadas hasta que
// Pablo las revise. Para publicarlas: 1) pon esto en true; 2) renombra src/pages/_automatizacion-procesos-ia.astro y
// src/pages/_ai-process-automation.astro quitándoles el guion bajo (Astro ignora los archivos que empiezan por _).
// Mientras sea false, /ai-process-automation/ sigue siendo la página antigua en inglés (src/data/servicePagesEn.ts), sin pareja en español.
export const automationLandingLive = false;
