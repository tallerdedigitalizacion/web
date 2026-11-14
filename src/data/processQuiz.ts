// Cuestionario «¿Dónde estás tú?» de la campaña C05 (automatización de procesos con IA) y su guía en PDF.
// Lo comparten la web (src/components/ProcessQuiz.astro) y el backend (backend/src/email/templates.ts, backend/src/schemas.ts):
// el resultado se calcula igual en los dos sitios, con estas mismas reglas y estos mismos textos. No importa nada de Astro.
//
// Textos y reglas: tarea «2 · C05 · Guía (3 fases) + cuestionario diagnóstico + suscripción opcional» del tablero de Notion.
// Aprobados por Pablo el 2026-11-14, salvo el texto legal de consentimiento y privacidad (`consent`), que Pablo debe validar
// ANTES de publicar. Los valores internos son los mismos en español y en inglés para poder sumarlos.

export type QuizLang = "es" | "en";
type Bi = Record<QuizLang, string>;

export const quizQuestionKeys = ["doc_procesos", "automatizacion_previa", "infraestructura", "dependencia_persona", "trazabilidad"] as const;
export type QuizQuestionKey = (typeof quizQuestionKeys)[number];

export const quizSituationValues = ["facturas", "clientes", "datos", "informes", "pedidos", "persona", "ninguna"] as const;
export type QuizSituation = (typeof quizSituationValues)[number];

export const quizStartingPoints = ["fase-1", "fase-1-calma", "fase-2-pequeno", "fase-2-limitada", "fase-2"] as const;
export type QuizStartingPoint = (typeof quizStartingPoints)[number];

// Valores permitidos por pregunta (P1–P5). P6 (situaciones) es de selección múltiple.
export const quizAnswerValues = {
  doc_procesos: ["si", "parcial", "no", "nose"],
  automatizacion_previa: ["varias", "alguna", "ninguna", "nose"],
  infraestructura: ["equipo", "externo", "cerrada", "nose"],
  dependencia_persona: ["otro", "retraso", "para"],
  trazabilidad: ["si", "esfuerzo", "no"],
} as const satisfies Record<QuizQuestionKey, readonly string[]>;

export interface QuizAnswers {
  doc_procesos: string;
  automatizacion_previa: string;
  infraestructura: string;
  dependencia_persona: string;
  trazabilidad: string;
  situaciones: string[];
}

export interface QuizQuestion {
  key: QuizQuestionKey | "situaciones";
  multiple: boolean;
  title: Bi;
  options: { value: string; label: Bi }[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    key: "doc_procesos",
    multiple: false,
    title: { es: "¿Tienes tus procesos documentados y formalizados?", en: "Are your processes documented and formalised?" },
    options: [
      { value: "si", label: { es: "Sí, por escrito y actualizados", en: "Yes, in writing and up to date" } },
      { value: "parcial", label: { es: "A medias: notas sueltas o cada uno lo sabe de memoria", en: "Partly: loose notes, or everyone knows it by heart" } },
      { value: "no", label: { es: "No", en: "No" } },
      { value: "nose", label: { es: "No sé qué significa «formalizado»", en: "I'm not sure what «formalised» means" } },
    ],
  },
  {
    key: "automatizacion_previa",
    multiple: false,
    title: {
      es: "¿Usas hoy alguna automatización o script (reglas en el correo, Zapier/Make, macros, integraciones)?",
      en: "Do you use any automation or scripts today (email rules, Zapier/Make, macros, integrations)?",
    },
    options: [
      { value: "varias", label: { es: "Sí, varias", en: "Yes, several" } },
      { value: "alguna", label: { es: "Alguna suelta", en: "A few, here and there" } },
      { value: "ninguna", label: { es: "Ninguna: la IA sería mi primer contacto con automatizar", en: "None: AI would be my first contact with automation" } },
      { value: "nose", label: { es: "No estoy seguro", en: "Not sure" } },
    ],
  },
  {
    key: "infraestructura",
    multiple: false,
    title: { es: "¿Qué infraestructura técnica tienes?", en: "What technical infrastructure do you have?" },
    options: [
      { value: "equipo", label: { es: "Equipo o departamento de informática", en: "An IT team or department" } },
      { value: "externo", label: { es: "Un informático externo puntual", en: "An external IT person on call" } },
      { value: "cerrada", label: { es: "Solo programas cerrados, email y WhatsApp, sin nadie técnico", en: "Only closed software, email and WhatsApp, nobody technical" } },
      { value: "nose", label: { es: "No lo sé", en: "I don't know" } },
    ],
  },
  {
    key: "dependencia_persona",
    multiple: false,
    title: {
      es: "Si la persona que hace este proceso falta una semana, ¿qué pasa?",
      en: "If the person who does this process is away for a week, what happens?",
    },
    options: [
      { value: "otro", label: { es: "Otro lo cubre sin problema", en: "Someone else covers it without trouble" } },
      { value: "retraso", label: { es: "Se retrasa", en: "It gets delayed" } },
      { value: "para", label: { es: "Se para", en: "It stops" } },
    ],
  },
  {
    key: "trazabilidad",
    multiple: false,
    title: { es: "¿Podrías reconstruir quién hizo qué y cuándo en ese proceso?", en: "Could you reconstruct who did what, and when, in that process?" },
    options: [
      { value: "si", label: { es: "Sí, queda registrado", en: "Yes, it is recorded" } },
      { value: "esfuerzo", label: { es: "Con esfuerzo", en: "With effort" } },
      { value: "no", label: { es: "No", en: "No" } },
    ],
  },
  {
    key: "situaciones",
    multiple: true,
    title: { es: "¿Te reconoces en alguna de estas situaciones?", en: "Do you recognise yourself in any of these situations?" },
    options: [
      { value: "facturas", label: { es: "Facturas y cobros a mano", en: "Invoices and payments handled by hand" } },
      { value: "clientes", label: { es: "Las mismas preguntas de clientes una y otra vez", en: "The same customer questions answered again and again" } },
      { value: "datos", label: { es: "Datos copiados de un programa a otro", en: "Data copied from one program to another" } },
      { value: "informes", label: { es: "Informes montados a mano", en: "Reports put together by hand" } },
      { value: "pedidos", label: { es: "Pedidos o citas entre correo, WhatsApp y hoja de cálculo", en: "Orders or appointments handled across email, WhatsApp and a spreadsheet" } },
      { value: "persona", label: { es: "Tareas que solo sabe hacer una persona", en: "Tasks that only one person knows how to do" } },
      { value: "ninguna", label: { es: "Ninguna", en: "None of these" } },
    ],
  },
];

// ---------------------------------------------------------------------------------------------------------------------
// Resultado: «punto de partida» por reglas (sin IA, sin promesas). Se aplica la primera regla que se cumpla.
// ---------------------------------------------------------------------------------------------------------------------
const isOneOf = (value: string, list: string[]) => list.includes(value);

export function quizStartingPoint(answers: Pick<QuizAnswers, "doc_procesos" | "automatizacion_previa" | "infraestructura">): QuizStartingPoint {
  const noAutomation = isOneOf(answers.automatizacion_previa, ["ninguna", "nose"]);
  const closedInfra = isOneOf(answers.infraestructura, ["cerrada", "nose"]);
  if (answers.doc_procesos !== "si") return "fase-1"; // A
  if (closedInfra && noAutomation) return "fase-1-calma"; // B
  if (noAutomation) return "fase-2-pequeno"; // C
  if (closedInfra) return "fase-2-limitada"; // D
  return "fase-2"; // E
}

// Página de la guía a la que enlaza cada fase, por idioma. OJO: el PDF en español que hay hoy en public/downloads tiene 6 páginas
// (sin la página «¿Cómo sé si esto es para mí?»): fase 1 = pág. 3 y fase 2 = pág. 4. El PDF en inglés tiene 7: fase 1 = pág. 4 y
// fase 2 = pág. 5 (los números de la tarea de Notion). Si se sustituye el PDF español por la versión de 7 páginas, poner 4 y 5.
export const quizGuidePhasePage: Record<QuizLang, Record<1 | 2, number>> = {
  es: { 1: 3, 2: 4 },
  en: { 1: 4, 2: 5 },
};

export const quizPhaseOf = (code: QuizStartingPoint): 1 | 2 => (code.startsWith("fase-1") ? 1 : 2);

const startingPointCopy: Record<QuizLang, Record<QuizStartingPoint, { title: string; text: string }>> = {
  es: {
    "fase-1": {
      title: "Tu punto de partida: la fase 1",
      text: "Empieza por documentar. Hoy tus procesos no están del todo escritos, y lo que no está escrito no se puede automatizar, ni por una persona ni por una IA. Es la parte menos vistosa y la más rentable: sirve con o sin IA.",
    },
    "fase-1-calma": {
      title: "Tu punto de partida: la fase 1, con calma",
      text: "Ahora mismo ni has automatizado antes ni tienes a qué conectar una IA. La IA no hace sola lo que nadie ha ordenado: trabaja sobre procesos ya escritos y sobre programas a los que se pueda acceder. Quédate en la fase 1 y vuelve cuando tengas un proceso escrito y un programa del que se puedan sacar los datos.",
    },
    "fase-2-pequeno": {
      title: "Tu punto de partida: cierra la fase 1 y prueba la fase 2 con un solo proceso",
      text: "Tienes los procesos escritos, pero nunca has automatizado. Es normal: el primer paso no es técnico, es entender qué significa automatizar. La IA facilita la automatización, no la sustituye. Elige un proceso pequeño y pruébalo con una persona supervisando.",
    },
    "fase-2-limitada": {
      title: "Tu punto de partida: la fase 2, con un alcance limitado",
      text: "Se puede empezar, pero con programas cerrados y sin nadie técnico la IA tendrá pocos sitios a los que conectarse. Antes conviene mirar qué conexiones admiten tus programas (exportar datos, API) y quién va a supervisar.",
    },
    "fase-2": {
      title: "Tu punto de partida: la fase 2",
      text: "Tienes los procesos escritos, algo de práctica automatizando y quien pueda conectar y supervisar. Es el momento de dárselos a una IA con supervisión y aprender de cada pasada.",
    },
  },
  en: {
    "fase-1": {
      title: "Your starting point: phase 1",
      text: "Start by documenting. Your processes are not fully written down yet, and what isn't written down can't be automated, by a person or by an AI. It's the least glamorous part and the most worthwhile: it pays off with or without AI.",
    },
    "fase-1-calma": {
      title: "Your starting point: phase 1, taking it slowly",
      text: "Right now you haven't automated anything before and you have nothing to connect an AI to. AI doesn't do on its own what nobody has organised: it works on processes that are already written down and on software whose data you can reach. Stay in phase 1 and come back when you have one process written down and a program you can get data out of.",
    },
    "fase-2-pequeno": {
      title: "Your starting point: finish phase 1 and try phase 2 with a single process",
      text: "You have your processes written down, but you have never automated. That's normal: the first step isn't technical, it's understanding what automating means. AI makes automation easier; it doesn't replace it. Pick one small process and try it with a person supervising.",
    },
    "fase-2-limitada": {
      title: "Your starting point: phase 2, with a limited scope",
      text: "You can start, but with closed software and nobody technical, the AI will have few places to connect to. First check what connections your programs allow (data export, API) and who will supervise.",
    },
    "fase-2": {
      title: "Your starting point: phase 2",
      text: "You have your processes written down, some practice automating and someone who can connect and supervise. It's time to hand them to an AI under supervision and learn from every run.",
    },
  },
};

const phase3Note: Bi = {
  es: "Antes de dejarlo desatendido, la fase 3 te pedirá poder reconstruir quién hizo qué y cuándo.",
  en: "Before leaving it unattended, phase 3 will ask you to be able to reconstruct who did what, and when.",
};

// Una línea por pregunta («lo que ya tienes / lo que te falta»), según la respuesta.
const lineCopy: Record<QuizLang, Record<QuizQuestionKey, (value: string) => string>> = {
  es: {
    doc_procesos: (value) =>
      ({
        si: "Procesos documentados: lo tienes.",
        parcial: "A medias: parte está escrito y parte vive en la cabeza de alguien. Termina de escribirlo (fase 1).",
        no: "Tus procesos no están escritos (fase 1).",
        nose: "«Formalizar» es dejar por escrito quién hace qué, en qué orden y con qué excepciones. Es lo primero que necesitas (fase 1).",
      })[value] ?? "",
    automatizacion_previa: (value) =>
      isOneOf(value, ["varias", "alguna"])
        ? "Ya automatizas algo: la IA se apoyará en eso."
        : "No has automatizado todavía. Mucha gente cree que la IA es el principio de la automatización; en realidad la facilita. Sin práctica, el obstáculo suele ser entender qué significa automatizar (fases 1 y 2).",
    infraestructura: (value) =>
      isOneOf(value, ["equipo", "externo"])
        ? "Tienes quien puede conectar y supervisar."
        : "Solo programas cerrados y nadie técnico: hay pocos sitios donde conectar una IA y nadie que la supervise (fases 2 y 3).",
    dependencia_persona: (value) =>
      value === "otro"
        ? "Alguien más puede cubrirlo: buena señal."
        : "Depende de una persona: si falta, se retrasa o se para. Hay que sacar ese conocimiento de su cabeza (fase 1).",
    trazabilidad: (value) =>
      value === "si"
        ? "Puedes reconstruir quién hizo qué y cuándo: tendrás ventaja en la fase 3."
        : "No queda un registro claro de quién hizo qué y cuándo; sin él no hay auditoría de lo que haga una IA (fase 3).",
  },
  en: {
    doc_procesos: (value) =>
      ({
        si: "Documented processes: you have this.",
        parcial: "Partly: some of it is written down and some lives in someone's head. Finish writing it down (phase 1).",
        no: "Your processes are not written down (phase 1).",
        nose: "«Formalising» means writing down who does what, in which order and with which exceptions. It is the first thing you need (phase 1).",
      })[value] ?? "",
    automatizacion_previa: (value) =>
      isOneOf(value, ["varias", "alguna"])
        ? "You already automate something: the AI will build on that."
        : "You haven't automated anything yet. Many people think AI is where automation begins; in fact it makes automation easier. Without practice, the obstacle is usually understanding what automating means (phases 1 and 2).",
    infraestructura: (value) =>
      isOneOf(value, ["equipo", "externo"])
        ? "You have someone who can connect and supervise."
        : "Only closed software and nobody technical: there are few places to connect an AI and nobody to supervise it (phases 2 and 3).",
    dependencia_persona: (value) =>
      value === "otro"
        ? "Someone else can cover it: a good sign."
        : "It depends on one person: if they are away it slows down or stops. That knowledge has to come out of their head (phase 1).",
    trazabilidad: (value) =>
      value === "si"
        ? "You can reconstruct who did what, and when: you will have an edge in phase 3."
        : "There is no clear record of who did what and when; without it there is no audit of what an AI does (phase 3).",
  },
};

const situationsCopy: Record<QuizLang, { recognised: string; none: string }> = {
  es: {
    recognised: "Te has reconocido en:",
    none: "No te has reconocido en ninguna situación. Probablemente no necesites automatizar nada ahora; si cambia, vuelve.",
  },
  en: {
    recognised: "You recognised yourself in:",
    none: "You didn't recognise yourself in any situation. You probably don't need to automate anything right now; if that changes, come back.",
  },
};

// «ninguna» combinada con otra situación se ignora.
export function quizSituations(values: readonly string[]): string[] {
  const real = values.filter((value) => value !== "ninguna" && quizSituationValues.includes(value as QuizSituation));
  return [...new Set(real)];
}

export interface QuizResult {
  code: QuizStartingPoint;
  title: string;
  /** Texto del resultado; en la regla E, con la nota de la fase 3 si la trazabilidad es «esfuerzo» o «no». */
  text: string;
  /** Una línea por pregunta: lo que ya tiene y lo que le falta. */
  lines: string[];
  /** Las mismas líneas con su estado: «have» (lo que ya tiene, en verde), «missing» (lo que le falta, en rojo) y «note» (la última, las situaciones). */
  items: { status: "have" | "missing" | "note"; text: string }[];
  /** Fase de la guía a la que enlaza (1 o 2) y su página en el PDF de este idioma. */
  guidePhase: 1 | 2;
  guidePage: number;
  situations: string[];
}

// ¿La respuesta a cada pregunta cuenta como «lo que ya tienes»? Es la misma condición que elige el texto de `lineCopy`.
const hasIt: Record<QuizQuestionKey, (value: string) => boolean> = {
  doc_procesos: (value) => value === "si",
  automatizacion_previa: (value) => isOneOf(value, ["varias", "alguna"]),
  infraestructura: (value) => isOneOf(value, ["equipo", "externo"]),
  dependencia_persona: (value) => value === "otro",
  trazabilidad: (value) => value === "si",
};

export function quizResult(answers: QuizAnswers, lang: QuizLang): QuizResult {
  const code = quizStartingPoint(answers);
  const copy = startingPointCopy[lang][code];
  const text = code === "fase-2" && isOneOf(answers.trazabilidad, ["esfuerzo", "no"]) ? `${copy.text} ${phase3Note[lang]}` : copy.text;
  const lines = quizQuestionKeys.map((key) => lineCopy[lang][key](answers[key]));
  const items: QuizResult["items"] = quizQuestionKeys.map((key, index) => ({ status: hasIt[key](answers[key]) ? "have" : "missing", text: lines[index] }));
  const situations = quizSituations(answers.situaciones);
  const situationsQuestion = quizQuestions.find((question) => question.key === "situaciones");
  const labels = situations.map((value) => situationsQuestion?.options.find((option) => option.value === value)?.label[lang] ?? value);
  const situationsLine = labels.length > 0 ? `${situationsCopy[lang].recognised} ${labels.join(", ")}.` : situationsCopy[lang].none;
  lines.push(situationsLine);
  items.push({ status: "note", text: situationsLine });
  const guidePhase = quizPhaseOf(code);
  return { code, title: copy.title, text, lines, items, guidePhase, guidePage: quizGuidePhasePage[lang][guidePhase], situations };
}

// Parámetros de `quiz_complete` (valores internos, iguales en los dos idiomas; sin datos personales).
export function quizCompleteParams(answers: QuizAnswers, lang: QuizLang) {
  return {
    idioma: lang,
    doc_procesos: answers.doc_procesos,
    automatizacion_previa: answers.automatizacion_previa,
    infraestructura: answers.infraestructura,
    dependencia_persona: answers.dependencia_persona,
    trazabilidad: answers.trazabilidad,
    punto_partida: quizStartingPoint(answers),
    num_situaciones: quizSituations(answers.situaciones).length,
  };
}

// ---------------------------------------------------------------------------------------------------------------------
// Guía, email y consentimiento
// ---------------------------------------------------------------------------------------------------------------------
export const quizGuide: Record<QuizLang, { path: string; title: string }> = {
  es: { path: "/downloads/guia-automatizacion-procesos-ia.pdf", title: "Cómo automatizar un proceso con IA" },
  en: { path: "/downloads/ai-process-automation-guide.pdf", title: "How to automate a process with AI" },
};

// Email de bienvenida al minicurso (se envía desde info@ al suscribirse). Texto simple: qué recibirá y cómo darse de baja. El texto
// legal (responsable y baja) va aquí y no en la pantalla del formulario. El minicurso (6 emails, uno por semana, con plantillas y
// explicaciones) se envía aparte: este email solo da la bienvenida.
export function quizEmailParts(lang: QuizLang, name: string, privacyLink: string) {
  const first = name.trim().split(/\s+/)[0] || "";
  if (lang === "en") {
    return {
      subject: "Welcome to the free mini-course",
      greeting: `Hello${first ? `, ${first}` : ""}:`,
      body: "Thank you for subscribing to the free mini-course. It is 6 emails, one per week. Each one comes with templates and explanations so your business can work through the phases of bringing AI in by itself.",
      reply: "If you have any question, just reply to this email.",
      bye: "Best wishes,",
      signer: "Pablo Leone",
      signature: "Taller de Digitalización",
      legalIntro: "You are receiving this email because you subscribed to the mini-course at tallerdedigitalizacion.com.",
      unsubscribe: "You can unsubscribe at any time by replying to this email or writing to info@tallerdedigitalizacion.com.",
      controller: "Controller: Pablo Ezequiel Leone Signetti (Taller de Digitalización).",
      privacyIntro: "More information in the privacy policy:",
      privacyLink,
    };
  }
  return {
    subject: "Bienvenido al minicurso gratuito",
    greeting: `Hola${first ? `, ${first}` : ""}:`,
    body: "Gracias por suscribirte al minicurso gratuito. Son 6 emails, uno por semana. Cada uno trae plantillas y explicaciones para que tu empresa recorra por sí misma las fases de implementación de la IA.",
    reply: "Si tienes cualquier duda, responde a este correo.",
    bye: "Un saludo,",
    signer: "Pablo Leone",
    signature: "Taller de Digitalización",
    legalIntro: "Recibes este correo porque te suscribiste al minicurso en tallerdedigitalizacion.com.",
    unsubscribe: "Puedes darte de baja cuando quieras respondiendo a este correo o escribiendo a info@tallerdedigitalizacion.com.",
    controller: "Responsable: Pablo Ezequiel Leone Signetti (Taller de Digitalización).",
    privacyIntro: "Más información en la política de privacidad:",
    privacyLink,
  };
}

// Consentimiento del formulario del minicurso: una sola casilla, corta. Las condiciones y responsabilidades están en la política de
// privacidad; el texto de baja va en el email de bienvenida.
export const quizConsent = {
  es: { required: ["He leído la ", "política de privacidad", " y acepto recibir el minicurso gratuito por email."] },
  en: { required: ["I have read the ", "privacy policy", " and agree to receive the free mini-course by email."] },
} as const;

// Sección «Nuestro método» de las landings de método: resumen breve (las tres fases de la guía) y el botón para descargarla.
export const quizMethod: Record<
  QuizLang,
  { eyebrow: string; title: string; intro: string; phases: { name: string; text: string }[]; button: string; note: string; linkId: string }
> = {
  es: {
    eyebrow: "Nuestro método",
    title: "Automatizar un proceso con IA, en tres fases",
    intro: "Así trabajo con cada empresa, en resumen. La guía lo explica paso a paso.",
    phases: [
      { name: "1 · Documentar", text: "Dejar por escrito quién hace qué, en qué orden y con qué excepciones. Lo que no está escrito no se puede automatizar, ni por una persona ni por una IA." },
      { name: "2 · Automatizar con supervisión", text: "Dar un proceso pequeño a una IA, con una persona que lo supervisa, y aprender de cada pasada." },
      { name: "3 · Dejarlo trabajar con trazabilidad", text: "Poder reconstruir quién hizo qué y cuándo, para dejar el proceso desatendido con confianza." },
    ],
    button: "Descargar la guía paso a paso (PDF)",
    note: "Gratis y sin dejar tus datos.",
    linkId: "guia-metodo",
  },
  en: {
    eyebrow: "Our method",
    title: "Automating a process with AI, in three phases",
    intro: "This is how I work with every business, in short. The guide explains it step by step.",
    phases: [
      { name: "1 · Document", text: "Write down who does what, in which order and with which exceptions. What isn't written down can't be automated, by a person or by an AI." },
      { name: "2 · Automate under supervision", text: "Hand a small process to an AI, with a person supervising it, and learn from every run." },
      { name: "3 · Let it run with traceability", text: "Be able to reconstruct who did what, and when, so you can leave the process unattended with confidence." },
    ],
    button: "Download the step-by-step guide (PDF)",
    note: "Free, and no details needed.",
    linkId: "guia-metodo",
  },
};

// Rótulos de la interfaz (no son texto aprobado en Notion: microcopy mínima para los botones y los títulos).
export const quizUi: Record<
  QuizLang,
  {
    eyebrow: string;
    title: string;
    intro: string;
    progress: string;
    questionOf: (n: number, total: number) => string;
    multipleHint: string;
    back: string;
    next: string;
    seeResult: string;
    pickOne: string;
    pickSome: string;
    resultEyebrow: string;
    haveTitle: string;
    missTitle: string;
    nextHeading: string;
    bookCta: string;
    courseCta: string;
    courseTitle: string;
    courseIntro: string;
    backToResult: string;
    name: string;
    nameHint: string;
    email: string;
    send: string;
    sending: string;
    sentTitle: string;
    sentText: string;
    sentNoEmail: string;
    restart: string;
    error: string;
    consentRequired: string;
  }
> = {
  es: {
    eyebrow: "Cuestionario",
    title: "¿Dónde estás tú?",
    intro: "Seis preguntas. Ves tu resultado en pantalla antes de dejar ningún dato.",
    progress: "Progreso del cuestionario",
    questionOf: (n, total) => `Pregunta ${n} de ${total}`,
    multipleHint: "Puedes marcar varias.",
    back: "Atrás",
    next: "Siguiente",
    seeResult: "Ver mi resultado",
    pickOne: "Elige una opción para continuar.",
    pickSome: "Marca al menos una opción para continuar.",
    resultEyebrow: "Tu resultado",
    haveTitle: "Lo que ya tienes",
    missTitle: "Lo que te falta",
    nextHeading: "Siguientes pasos",
    bookCta: "¿Lo vemos en una llamada gratuita de 30 min?",
    courseCta: "Recibir un minicurso gratuito",
    courseTitle: "Minicurso gratuito por email",
    courseIntro: "Son 6 emails gratuitos, uno por semana. Cada uno trae plantillas y explicaciones para que tu empresa recorra por sí misma las fases de implementación de la IA.",
    backToResult: "Volver a mi resultado",
    name: "Nombre (opcional)",
    nameHint: "",
    email: "Email",
    send: "Suscribirme",
    sending: "Enviando…",
    sentTitle: "Ya estás suscrito",
    sentText: "Te hemos enviado un email de bienvenida (mira en spam si no llega). Recibirás el minicurso, un email por semana.",
    sentNoEmail: "Hemos recibido tu suscripción, pero ahora mismo no hemos podido enviarte el email de bienvenida. Recibirás igualmente el minicurso.",
    restart: "Repetir el cuestionario",
    error: "No se pudo enviar. Inténtalo de nuevo en un momento.",
    consentRequired: "Para suscribirte hay que aceptar la política de privacidad.",
  },
  en: {
    eyebrow: "Questionnaire",
    title: "Where are you?",
    intro: "Six questions. You see your result on screen before leaving any details.",
    progress: "Questionnaire progress",
    questionOf: (n, total) => `Question ${n} of ${total}`,
    multipleHint: "You can tick several.",
    back: "Back",
    next: "Next",
    seeResult: "See my result",
    pickOne: "Choose an option to continue.",
    pickSome: "Tick at least one option to continue.",
    resultEyebrow: "Your result",
    haveTitle: "What you already have",
    missTitle: "What is missing",
    nextHeading: "Next steps",
    bookCta: "Shall we look at it on a free 30-minute call?",
    courseCta: "Get a free mini-course",
    courseTitle: "Free mini-course by email",
    courseIntro: "It is 6 free emails, one per week. Each one comes with templates and explanations so your business can work through the phases of bringing AI in by itself.",
    backToResult: "Back to my result",
    name: "Name (optional)",
    nameHint: "",
    email: "Email",
    send: "Subscribe",
    sending: "Sending…",
    sentTitle: "You are subscribed",
    sentText: "We have sent you a welcome email (check your spam folder if it doesn't arrive). You will receive the mini-course, one email per week.",
    sentNoEmail: "We have received your subscription, but we could not send the welcome email right now. You will still receive the mini-course.",
    restart: "Take the questionnaire again",
    error: "It could not be sent. Please try again in a moment.",
    consentRequired: "To subscribe you need to accept the privacy policy.",
  },
};
