// Interruptores de publicación. Cambia un valor y vuelve a compilar.
//
// automationLandingLive: las landings de automatización (/automatizacion-procesos-ia/ y /ai-process-automation/, campaña C05) están
// publicadas como prueba A/B frente a las de software a medida (C04). Para aparcarlas otra vez: 1) pon esto en false; 2) renombra
// src/pages/automatizacion-procesos-ia.astro y src/pages/ai-process-automation.astro añadiéndoles un guion bajo al principio
// (Astro ignora los archivos que empiezan por _). Con false, /ai-process-automation/ vuelve a ser la página antigua en inglés
// (src/data/servicePagesEn.ts), sin pareja en español.
export const automationLandingLive = true;
