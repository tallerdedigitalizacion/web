// Landings de campaña de Google Ads (Comunidad de Madrid). Dos ofertas, cada una en español y en inglés:
//   producto: desarrollo de software a medida · método: automatización de procesos con IA.
// Las cuatro páginas comparten esqueleto y casi todo el texto (`shared`); aquí solo cambia lo propio de cada una.
// Las pinta CampaignPage.astro dentro de CampaignLayout.astro; las páginas de src/pages son una línea cada una.
//
// Anuncios: los de español apuntan a la URL en español y los de inglés a la inglesa; no hay redirección por idioma.
// Sufijo de URL final: utm_source=google&utm_medium=cpc&utm_campaign=C04-software (producto) o C05-automatizacion (método)
// &utm_content={creative}&utm_term={keyword}.
//
// Escalera de precios (fija, sin fechas, sin descuentos): diagnóstico 90 € · primera implementación 400 € · plan de 6 semanas 2.000 €.
// Cada paso cuesta lo que pone, sin restar lo anterior. Siempre se empieza por el diagnóstico.
//
// Lo que Pablo debe completar o confirmar va como [PABLO: …] (comentarios y `pabloMarkers`). Solo se ve con `npm run dev`.

export type Lang = "es" | "en";
export type Pair = [string, string];

export interface PainSet {
  items: string[];
  note: Pair;
}

export interface TriageOption {
  label: string;
  behind: string;
  first: string;
}

export interface CaseCard {
  title: string;
  before: string;
  after: string;
  // Ficha completa (en español): solo los casos que la tienen.
  href?: string;
}

export interface Testimonial {
  name: string;
  role: string;
  // Testimonio en vídeo: enlace o ID de YouTube. Se publica en cuanto lo tenga.
  videoId?: string;
  // Testimonio escrito: SOLO se publica con `approved: true`, y eso solo debe ponerse cuando la persona ha leído el texto, lo ha
  // corregido si hacía falta y ha autorizado por escrito que salga con su nombre y su empresa. Los textos de aquí son borradores
  // hechos con datos reales que dio Pablo; no son citas hasta que cada persona los apruebe. En `npm run dev` se ven con un aviso.
  quote?: string;
  approved?: boolean;
  // Relación con Pablo, si la hay: se dice siempre junto al nombre.
  relation?: string;
}

export interface CampaignPage {
  offer: "producto" | "metodo";
  lang: Lang;
  path: string;
  pairPath: string;
  campaignId: "C04-software" | "C05-automatizacion";
  seo: { title: string; description: string };
  hero: { eyebrow: string; h1: string; subtitle: string };
  painIds: PainId[];
  what?: { eyebrow: string; title: string; intro: string; items: Pair[] };
  how: { eyebrow: string; title: string; intro: string };
  extraWhy?: Pair;
  faq: Pair[];
  formService: string;
  schema: { name: string; serviceType: string; description: string };
}

type PainId = "p1" | "p3" | "p4" | "p5" | "p6" | "p7" | "p12";

// Vídeo de Pablo, uno por idioma, el mismo en las dos ofertas. Va en la sección «Contratas a una persona, no a una agencia».
// [PABLO: grabar el vídeo ES (60-90 s: «Hola, soy Pablo Leone, el ingeniero detrás de Taller de Digitalización…», qué haces y que hablan
//  contigo directamente; en método, explicando el caso de Nimbus), subirlo a YouTube y pegar aquí el enlace o el ID. Lo mismo con el EN.
//  Si quieres un póster distinto de la foto, un JPG 1280×720 en /public.]
// Mientras `id` esté vacío, la sección muestra la foto de Pablo y no hay ningún marcador visible.
export const campaignVideos: Record<Lang, { id?: string; title: string; poster: string; posterAlt: string; caption: string; playLabel: string }> = {
  es: {
    id: undefined,
    title: "Vídeo: quién es Pablo Leone y cómo trabaja",
    poster: "/pablo-leone.jpeg",
    posterAlt: "Pablo Leone, desarrollador de software",
    caption: "Pablo Leone · desarrollador de software, 18 años de experiencia",
    playLabel: "Reproducir el vídeo de presentación",
  },
  en: {
    id: undefined,
    title: "Video: who Pablo Leone is and how he works",
    poster: "/pablo-leone.jpeg",
    posterAlt: "Pablo Leone, software developer",
    caption: "Pablo Leone · software developer, 18 years of experience",
    playLabel: "Play the introduction video",
  },
};

// Lista de lo que Pablo debe completar o confirmar. Se muestra solo en `npm run dev`.
export const pabloMarkers = [
  "[PABLO: vídeo ES de 60-90 s para «Contratas a una persona, no a una agencia» (en método, explicando el caso de Nimbus) + póster 1280×720 si quieres uno distinto de la foto] → campaignVideos.es en src/data/campaigns.ts",
  "[PABLO: vídeo EN de 60-90 s, mismo mensaje] → campaignVideos.en",
  "[PABLO: testimonios escritos de Homero, Patricia y Javier: son borradores con datos reales. Cada persona debe leer el texto, corregirlo si quiere y autorizar por escrito que salga con su nombre y empresa. Solo entonces pon `approved: true` en `testimonials.list` (campaigns.ts). Si algún día hay vídeo, pon `videoId`. Mientras tanto la sección no se muestra]",
];

// ---------------------------------------------------------------------------------------------------------------------
// Textos comunes por idioma
// ---------------------------------------------------------------------------------------------------------------------
interface Shared {
  htmlLangName: string;
  langNav: string;
  headerBook: string;
  heroBook: string;
  chips: string[];
  triage: { eyebrow: string; title: string; intro: string; behindLabel: string; firstLabel: string; bookCta: string; options: TriageOption[] };
  pains: { eyebrow: string; title: string };
  painPool: Record<PainId, string>;
  painNote: Pair;
  // `bullets`: puntos que se leen uno debajo de otro (un punto, una idea).
  // `price`: el precio del paso, grande y centrado en la columna derecha (los pasos sin precio no lo llevan).
  // `priceNote`: línea pequeña bajo el precio (por ejemplo, «* Si ya has pagado el diagnóstico»).
  // `guarantee`: punto destacado al final de los puntos, con un asterisco que lleva a las condiciones (#garantia).
  steps: { title: string; text: string; price?: string; priceNote?: string; bullets?: string[]; guarantee?: string }[];
  authority: { eyebrow: string; title: string; paragraphs: string[]; facts: Pair[]; linkedin: string; cv: string };
  cases: { eyebrow: string; title: string; intro: string; beforeLabel: string; afterLabel: string; open: string; prev: string; next: string; cards: CaseCard[] };
  testimonials: { eyebrow: string; title: string; list: Testimonial[] };
  faq: { eyebrow: string; title: string; guarantee: Pair; vat: Pair; timeline: Pair; owner: Pair; language: Pair; ai: Pair; remote: Pair; tools: Pair };
  booking: { eyebrow: string; title: string; intro: string; openLabel: string; loadingLabel: string; fallbackLabel: string; consentNote: string; confirmedTitle: string; confirmedText: string };
  form: { title: string; intro: string; choiceLabel: string; choicePlaceholder: string; otherChoice: string; explainLabel: string; messageLabel: string };
  hint: { text: string; link: string; dismiss: string };
  footer: { legal: string; privacy: string; cookies: string; cookieSettings: string; nav: string };
}

const caseHref = (slug: string) => `/casos/${slug}/`;

export const shared: Record<Lang, Shared> = {
  es: {
    htmlLangName: "Español",
    langNav: "Idioma",
    headerBook: "Reservar llamada",
    heroBook: "Reservar llamada gratis con Pablo",
    chips: [
      "Llamada gratuita de 30 min, sin compromiso",
      "Hablas con un técnico, no con un comercial",
      "Garantía de devolución",
      "Precio cerrado desde el principio",
      "Te respondo en menos de 24 horas",
    ],
    triage: {
      eyebrow: "¿Es para ti?",
      title: "¿Cómo sé si esto es para mí?",
      intro: "Elige lo que más se parece a tu empresa y te cuento qué suele haber detrás y por dónde empezaría. No hace falta dejar tu email.",
      behindLabel: "Qué suele haber detrás",
      firstLabel: "Primer paso",
      bookCta: "Reservar llamada gratis con Pablo",
      options: [
        {
          label: "Mi empresa depende demasiado de las personas que sostienen los procesos",
          behind: "Los procesos solo están en la cabeza de quien los hace y, si esa persona falta, se frena todo.",
          first: "Documentar el proceso y construir la herramienta que lo haga funcionar sin depender de nadie.",
        },
        {
          label: "Los sistemas que uso para trabajar me obligan a sincronizarlos a mano",
          behind: "Alguien hace de puente entre ellos, copiando datos de uno a otro.",
          first: "Conectar los que más datos se pasan entre sí.",
        },
        {
          label: "Hacemos demasiados trabajos manuales y repetitivos",
          behind: "Tareas que se repiten cada mes: facturas, altas, proveedores. Es lo que antes se automatiza y donde más errores se cuelan.",
          first: "Automatizar la que más horas consume y dejar a una persona solo para validar.",
        },
        {
          label: "Necesitamos herramientas que nos agilicen el trabajo",
          behind: "Suele haber un Excel o un proceso hecho a mano que frena al equipo.",
          first: "El diagnóstico, para ver qué herramienta tiene más impacto.",
        },
        {
          label: "Mis clientes me preguntan siempre lo mismo",
          behind: "Son consultas que se repiten y que alguien responde a mano cada vez.",
          first: "Un portal de cliente o un asistente con IA que las responda con tus datos y pase a una persona lo difícil.",
        },
        {
          label: "Son demasiados problemas mezclados y no sé por cuál empezar",
          behind: "Es lo más habitual.",
          first: "La llamada de 30 minutos para ponerlos en palabras y ver si podemos trabajar juntos. Después, el diagnóstico los ordena por impacto.",
        },
      ],
    },
    pains: { eyebrow: "¿Te suena?", title: "Si piensas alguna de estas cosas, hablemos" },
    painPool: {
      p1: "La empresa no puede funcionar si falta una persona.",
      p3: "Cada mes repetimos a mano las mismas tareas.",
      p4: "Mis programas no se hablan y alguien hace de puente a mano.",
      p5: "No puedo hacer un presupuesto sin volver a la oficina.",
      p6: "Cruzamos datos de varias plataformas a mano, a veces con un Excel impreso.",
      p7: "Pagamos un servicio porque no sabemos sacar nuestros propios datos.",
      p12: "Mi equipo me pregunta siempre lo mismo.",
    },
    painNote: ["No sé explicar el problema, pero me cuesta dinero.", "Es muy normal. No hace falta que sepas explicarlo ni qué solución existe: lo ponemos en palabras juntos en la llamada y te digo si tiene arreglo."],
    steps: [
      { title: "Llamada gratuita de 30 minutos", price: "Gratis", text: "Me cuentas qué pasa y cómo trabajáis. Sirve para saber si podemos trabajar juntos. Si no veo cómo ayudarte, te lo digo." },
      {
        title: "Diagnóstico",
        price: "90 €",
        text: "Dos horas de reuniones para entender los problemas de tu empresa y un informe con la lista ordenada por impacto.",
        bullets: [
          "Para cada problema: qué voy a resolver, cómo, cuánto cuesta, cuánto tarda y qué impacto tiene.",
          "Necesito que me enseñes cómo trabajas hoy.",
        ],
      },
      {
        title: "Primera implementación",
        price: "400 €",
        text: "Prototipo del problema de mayor impacto, con revisiones según avanza.",
        bullets: ["Incluye desarrollo, puesta en marcha y formación."],
        guarantee: "Si no estás conforme en los 30 días siguientes a la entrega, te devuelvo el dinero sin preguntas.",
      },
      {
        title: "Plan de 6 semanas",
        price: "2.000 €",
        text: "En 6 semanas implementamos al menos 3 problemas de la lista del diagnóstico.",
        bullets: ["Sumando la primera implementación, son al menos 4 en total."],
      },
      { title: "Después del plan", text: "Podemos seguir trabajando juntos como partners. La forma la hablamos entonces, según lo que necesite tu empresa." },
    ],
    authority: {
      eyebrow: "Quién está detrás",
      title: "Contratas a una persona, no a una agencia",
      paragraphs: [
        "Soy Pablo Leone y llevo 18 años desarrollando software. He sido tech lead, he liderado equipos de desarrollo en fintech, salud y telecomunicaciones, y fundé en 2015 PDG Solutions, una agencia de desarrollo que funcionó hasta 2019, con clientes en Reino Unido, Irlanda, Alemania y Latinoamérica. Trabajo en remoto para empresas internacionales.",
        "Cuando me contratas, hablas conmigo: yo entiendo tu problema, yo lo construyo y yo respondo del resultado. No hay un comercial en medio ni un equipo al que derivarte.",
      ],
      facts: [
        ["18 años", "desarrollando software para empresas europeas de fintech, salud y telecomunicaciones"],
        ["Ex tech lead", "de equipos de desarrollo de aplicaciones web distribuidas para startups"],
        ["PDG Solutions", "agencia de desarrollo que fundé en 2015 y que funcionó hasta 2019, con clientes en Reino Unido, Irlanda, Alemania y Latinoamérica"],
      ],
      linkedin: "LinkedIn de Pablo Leone",
      cv: "CV (PDF)",
    },
    cases: {
      eyebrow: "Casos reales",
      title: "Así era antes y así es ahora",
      intro: "Trabajos ya hechos para empresas reales, sobre todo de telecomunicaciones.",
      beforeLabel: "Antes",
      afterLabel: "Ahora",
      open: "Ver el caso completo",
      prev: "Caso anterior",
      next: "Caso siguiente",
      cards: [
        { title: "Facturas de proveedores", before: "Entraban a mano: 1 semana de trabajo.", after: "Se dejan en una carpeta de Google Drive y el sistema las introduce solo.", href: caseHref("entrada-facturas-automatica") },
        { title: "Presupuestos desde el propio sitio", before: "Todo vivía en el ERP: el presupuesto se hacía a mano y luego se enviaba. 1 presupuesto cada 2 días por técnico.", after: "Se le pide a la IA, cruza los datos del ERP y lo envía tras una revisión, desde el propio sitio. Menos kilómetros y horas de desplazamiento, y 1 presupuesto al día por técnico." },
        { title: "Una licencia que solo se pagaba por los datos", before: "60 € al mes para poder consultar datos antiguos.", after: "Sin licencia: los datos se integran con IA y cualquiera puede preguntarlos.", href: caseHref("dar-de-baja-software-historico") },
        { title: "La web de la empresa", before: "La agencia cobraba 240 € al mes por mantener el SEO de la web y, además, la empresa pagaba el servidor: más de 2.800 € al año.", after: "La web y su SEO se hacen ahora con IA y se alojan en un servidor gratuito: de más de 2.800 € al año a 0 €." },
        { title: "Saber si una dirección tiene cobertura", before: "Había que consultar 3 sistemas y se tardaba unos 10 minutos en saber si había cobertura y qué precio ofrecer.", after: "Se pregunta a una IA y responde en segundos.", href: caseHref("consulta-cobertura-ia") },
        { title: "Cruce de proveedores", before: "Los costes se arrastraban durante meses y llegaron a acumular unos cuantos cientos de euros.", after: "El sistema lo previene: compara y avisa de lo que no cuadra, y el goteo de pérdida queda en 0 €.", href: caseHref("conciliacion-proveedores") },
        { title: "Un «cerebro» con IA para la empresa", before: "Si el CEO no estaba, nadie sabía hacer los procesos: se frenaba el equipo, se perdía tiempo y el CEO vivía con estrés.", after: "Un cerebro con IA responde cualquier pregunta, reduce el estrés del CEO y desbloquea el trabajo. En administración había 3 personas y ahora hace falta 1: las otras 2 pasaron a ventas y atención al cliente." },
        { title: "Cuadrar el programa de gestión, la gestoría y el banco", before: "Una semana de espeleología cruzando datos manuales de forma imprecisa entre al menos 3 sistemas y el banco.", after: "Se alimenta a la IA con la información y cruza los datos para obtener una contabilidad completa y precisa en una hora." },
      ],
    },
    testimonials: {
      eyebrow: "Testimonios",
      title: "Lo que dicen quienes han trabajado conmigo",
      list: [
        {
          name: "Homero",
          role: "CEO de AAINJAA",
          quote: "No sabíamos lo que se podía hacer con la IA ni que lo que necesitábamos era desarrollo a medida. Pablo nos hizo una web propia, con la que dejamos de pagar la anterior, y una aplicación que usamos. Ahora nuestras cosas van mejor.",
          approved: false,
        },
        {
          name: "Patricia",
          role: "Cofundadora de Nimbus",
          relation: "hermana de Pablo",
          quote: "Teníamos tareas repetitivas y procesos que solo conocía una persona. Con las herramientas que Pablo hizo a medida, las facturas entran solas, la cobertura se consulta con una pregunta y hay un asistente que responde las dudas del equipo.",
          approved: false,
        },
        {
          name: "Javier",
          role: "CEO de Nimbus",
          quote: "Antes un técnico entregaba un presupuesto cada dos días. Ahora entrega uno al día, desde el propio sitio, y se ahorra kilómetros y horas de desplazamiento.",
          approved: false,
        },
      ],
    },
    faq: {
      eyebrow: "Preguntas frecuentes",
      title: "Dudas habituales antes de empezar",
      // Las preguntas de precios y garantía van aquí (no bajo los pasos). La de la garantía es el destino del asterisco del paso 3.
      guarantee: ["¿Cómo funciona la garantía de devolución?", "Tienes 30 días desde la entrega de la primera solución para probarla. Si en ese plazo no estás conforme, escribe un email a Taller de Digitalización pidiendo la devolución. Te devuelvo íntegro lo que pagaste por la primera implementación, con IVA y por el mismo medio de pago, con la factura rectificativa correspondiente y en el plazo de una semana. A cambio, dejas de usar lo entregado y no conservas el código ni la solución. Sin excusas ni trámites. El diagnóstico no se devuelve."],
      vat: ["¿Los precios llevan IVA? ¿Cómo se paga?", "Los precios no incluyen IVA. Se paga por adelantado, cada fase antes de empezarla."],
      timeline: ["¿Cuánto tarda la primera implementación?", "El plazo te lo doy al terminar el diagnóstico, cuando ya sé qué problema se resuelve y cómo."],
      owner: ["¿Quién es el dueño del código?", "Tú. El código, las cuentas y la documentación quedan a tu nombre, y la propiedad pasa a ti cuando se paga la entrega final."],
      language: ["¿En qué idioma trabajamos?", "En español o en inglés, como prefieras: la llamada, la propuesta y la documentación van en el idioma que elijas."],
      ai: ["¿Usas IA para programar?", "Sí, para desarrollar más rápido. El criterio, la revisión del trabajo y la responsabilidad del resultado son míos: respondo yo de lo que te entrego."],
      remote: ["¿Trabajas en presencial o en remoto?", "En persona en Madrid y alrededores, y en remoto para el resto de España. Si hace falta una visita puntual fuera de esa zona, lo hablamos."],
      tools: ["¿Tengo que cambiar todas mis herramientas actuales?", "No necesariamente. Reviso primero lo que ya tienes y solo construyo lo que haga falta, conectándolo con lo que ya funciona."],
    },
    booking: {
      eyebrow: "Reserva",
      title: "Elige hueco para tu llamada gratuita",
      intro: "30 minutos, sin guion comercial. Eliges día y hora aquí mismo, sin salir de la página.",
      openLabel: "Ver huecos disponibles",
      loadingLabel: "Cargando el calendario…",
      fallbackLabel: "Abrir el calendario en otra pestaña",
      consentNote: "El calendario lo ofrece Cal.com, un servicio externo. Se carga al aceptar las cookies o al pulsar el botón.",
      confirmedTitle: "¡Llamada reservada!",
      confirmedText: "Te llegará un email con la fecha, la hora y el enlace para cambiarla o cancelarla.",
    },
    form: {
      title: "O cuéntame tu caso",
      intro: "Elige lo que más se parece a lo tuyo, o cuéntamelo con tus palabras, y si quieres añade una observación. Te respondo en menos de 24 horas.",
      choiceLabel: "¿Qué te pasa?",
      choicePlaceholder: "Elige una opción…",
      otherChoice: "Ninguna de estas: te lo explico",
      explainLabel: "Explícamelo",
      messageLabel: "¿Algo que quieras añadir? (opcional)",
    },
    hint: { text: "This page is also available in English.", link: "Read in English", dismiss: "Cerrar aviso" },
    footer: { legal: "Aviso legal", privacy: "Política de privacidad", cookies: "Política de cookies", cookieSettings: "Configurar cookies", nav: "Enlaces legales y contacto" },
  },

  en: {
    htmlLangName: "English",
    langNav: "Language",
    headerBook: "Book a call",
    heroBook: "Book a free call with Pablo",
    chips: [
      "Free 30-minute call, no strings",
      "You talk to a technician, not a salesperson",
      "Money-back guarantee",
      "Fixed price from the start",
      "I reply within 24 hours",
    ],
    triage: {
      eyebrow: "Is it for you?",
      title: "How do I know if this is for me?",
      intro: "Pick what looks most like your business and I'll tell you what is usually behind it and where I would start. No email needed.",
      behindLabel: "What is usually behind it",
      firstLabel: "First step",
      bookCta: "Book a free call with Pablo",
      options: [
        {
          label: "My business depends too much on the people who hold the processes together",
          behind: "The processes only live in the head of whoever does them and, if that person is out, everything slows down.",
          first: "Document the process and build the tool that makes it work without depending on anyone.",
        },
        {
          label: "The systems I work with force me to sync them by hand",
          behind: "Someone acts as the bridge between them, copying data from one to another.",
          first: "Connect the ones that pass the most data to each other.",
        },
        {
          label: "We do too much manual, repetitive work",
          behind: "Tasks that repeat every month: invoices, sign-ups, suppliers. It is the first thing to automate and where most mistakes creep in.",
          first: "Automate the one that uses the most hours and leave a person only to validate.",
        },
        {
          label: "We need tools that speed up our work",
          behind: "There is usually a spreadsheet or a process done by hand that slows the team down.",
          first: "The diagnosis, to see which tool has the most impact.",
        },
        {
          label: "My customers keep asking me the same things",
          behind: "They are repeated questions that someone answers by hand every time.",
          first: "A customer portal or an AI assistant that answers them with your data and hands the hard ones to a person.",
        },
        {
          label: "There are too many problems mixed together and I don't know where to start",
          behind: "It is the most common case.",
          first: "The 30-minute call to put them into words and see whether we can work together. After that, the diagnosis ranks them by impact.",
        },
      ],
    },
    pains: { eyebrow: "Sound familiar?", title: "If you catch yourself thinking any of this, let's talk" },
    painPool: {
      p1: "The business can't run if one person is missing.",
      p3: "Every month we repeat the same tasks by hand.",
      p4: "My programs don't talk to each other and someone bridges them by hand.",
      p5: "I can't write a quote without going back to the office.",
      p6: "We cross-check data from several platforms by hand, sometimes with a printed spreadsheet.",
      p7: "We pay for a service because we can't get our own data out.",
      p12: "My team keeps asking me the same things.",
    },
    painNote: ["I can't explain the problem, but it's costing me money.", "That's very common. You don't need to know how to describe it, or what the solution is: we put it into words together on the call, and I tell you whether it can be fixed."],
    steps: [
      { title: "Free 30-minute call", price: "Free", text: "You tell me what is going on and how you work. It is to see whether we can work together. If I don't see how I can help, I'll say so." },
      {
        title: "Diagnosis",
        price: "€90",
        text: "Two hours of meetings to understand your company's problems and a report with the list ranked by impact.",
        bullets: [
          "For each problem: what I will solve, how, what it costs, how long it takes and what impact it has.",
          "I need you to show me how you work today.",
        ],
      },
      {
        title: "First implementation",
        price: "€400",
        text: "A prototype of the highest-impact problem, with reviews as it moves forward.",
        bullets: ["It includes development, launch and training."],
        guarantee: "If you are not happy within 30 days of delivery, I refund your money, no questions asked.",
      },
      {
        title: "6-week plan",
        price: "€2,000",
        text: "In 6 weeks we implement at least 3 problems from the diagnosis list.",
        bullets: ["Adding the first implementation, that is at least 4 in total."],
      },
      { title: "After the plan", text: "We can keep working together as partners. We agree how then, depending on what your business needs." },
    ],
    authority: {
      eyebrow: "Who is behind this",
      title: "You hire a person, not an agency",
      paragraphs: [
        "I'm Pablo Leone and I have been developing software for 18 years. I have been a tech lead, I have led development teams in fintech, health and telecom, and I founded PDG Solutions in 2015, a development agency that ran until 2019, with clients in the UK, Ireland, Germany and Latin America. I work remotely for international companies.",
        "When you hire me, you talk to me: I understand your problem, I build it and I answer for the result. There is no salesperson in the middle and no team to hand you off to.",
      ],
      facts: [
        ["18 years", "building software for European companies in fintech, health and telecom"],
        ["Former tech lead", "of development teams building distributed web applications for startups"],
        ["PDG Solutions", "development agency I founded in 2015 and that ran until 2019, with clients in the UK, Ireland, Germany and Latin America"],
      ],
      linkedin: "Pablo Leone on LinkedIn",
      cv: "CV (PDF)",
    },
    cases: {
      eyebrow: "Real cases",
      title: "How it was before, and how it is now",
      intro: "Work already done for real companies, mostly in telecoms.",
      beforeLabel: "Before",
      afterLabel: "Now",
      open: "Read the full case (in Spanish)",
      prev: "Previous case",
      next: "Next case",
      cards: [
        { title: "Supplier invoices", before: "Entered by hand: 1 week of work.", after: "They are dropped into a Google Drive folder and the system enters them on its own.", href: caseHref("entrada-facturas-automatica") },
        { title: "Quotes from the customer's site", before: "Everything lived in the ERP: quotes were written by hand and then sent. 1 quote every 2 days per technician.", after: "You ask the AI for a quote, it pulls the ERP data and sends it after a review, from the site itself. Fewer kilometres and hours of travel, and 1 quote a day per technician." },
        { title: "A licence kept only for the data", before: "€60 a month just to look up old data.", after: "No licence: the data is integrated with AI and anyone can ask it questions.", href: caseHref("dar-de-baja-software-historico") },
        { title: "The company website", before: "The agency charged €240 a month to maintain the site's SEO, and the company also paid for the server: more than €2,800 a year.", after: "The site and its SEO are now done with AI and hosted on a free server: from more than €2,800 a year to €0." },
        { title: "Checking coverage for an address", before: "3 systems to check, about 10 minutes to know whether there was coverage and what price to offer.", after: "You ask an AI and it answers in seconds.", href: caseHref("consulta-cobertura-ia") },
        { title: "Supplier cross-check", before: "Costs dragged on for months and added up to a few hundred euros in losses.", after: "The system prevents it: it compares and flags what doesn't add up, and the leak is down to €0.", href: caseHref("conciliacion-proveedores") },
        { title: "An AI «brain» for the company", before: "When the CEO was away, nobody knew how to run the processes: the team slowed down, time was lost and the CEO was under stress.", after: "An AI brain answers any question, lowers the CEO's stress and unblocks the work. Administration had 3 people and now needs 1: the other 2 moved to sales and customer service." },
        { title: "Reconciling the internal system, the accountant and the bank", before: "A week of digging through data by hand, imprecisely, across at least 3 systems and the bank.", after: "The AI is fed the information and cross-checks the data to produce complete, accurate accounts in one hour." },
      ],
    },
    testimonials: {
      eyebrow: "Testimonials",
      title: "What people who have worked with me say",
      list: [
        {
          name: "Homero",
          role: "CEO of AAINJAA",
          quote: "We didn't know what could be done with AI, or that what we needed was custom development. Pablo built us our own website, which let us stop paying for the old one, and an app we use. Things are going better for us now.",
          approved: false,
        },
        {
          name: "Patricia",
          role: "Co-founder of Nimbus",
          relation: "Pablo's sister",
          quote: "We had repetitive tasks and processes that only one person knew. With the tools Pablo built for us, invoices enter on their own, coverage is checked with a single question and an assistant answers the team's questions.",
          approved: false,
        },
        {
          name: "Javier",
          role: "CEO of Nimbus",
          quote: "A technician used to deliver one quote every two days. Now they deliver one a day, from the site itself, and save kilometres and hours of travel.",
          approved: false,
        },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Common questions before getting started",
      guarantee: ["How does the money-back guarantee work?", "You have 30 days from the delivery of the first solution to try it. If you are not happy within that period, send an email to Taller de Digitalización asking for a refund. I refund in full what you paid for the first implementation, VAT included and through the same payment method, with the corresponding credit note and within one week. In return, you stop using what was delivered and do not keep the code or the solution. No excuses and no paperwork. The diagnosis is not refunded."],
      vat: ["Do the prices include VAT? How do I pay?", "Prices do not include VAT. Payment is in advance, each phase before it starts."],
      timeline: ["How long does the first implementation take?", "I give you the timeline when the diagnosis is finished, once I know which problem gets solved and how."],
      owner: ["Who owns the code?", "You do. The code, the accounts and the documentation are in your name, and ownership passes to you when the final payment is made."],
      language: ["Which language do we work in?", "English or Spanish, whichever you prefer: the call, the proposal and the documentation are in the language you choose."],
      ai: ["Do you use AI to write the code?", "Yes, to build faster. The judgement, the review of the work and the responsibility for the result are mine: I answer for what I deliver."],
      remote: ["Do you work in person or remotely?", "In person in Madrid and the surrounding area, and remotely for the rest of Spain. If a one-off visit is needed outside that area, we talk it through."],
      tools: ["Do I have to replace all my current tools?", "Not necessarily. I look at what you already have first and only build what is needed, connecting it to what already works."],
    },
    booking: {
      eyebrow: "Book",
      title: "Pick a time for your free call",
      intro: "30 minutes, no sales script. You choose the day and time right here, without leaving the page.",
      openLabel: "See available times",
      loadingLabel: "Loading the calendar…",
      fallbackLabel: "Open the calendar in a new tab",
      consentNote: "The calendar is provided by Cal.com, an external service. It loads when you accept cookies or press the button.",
      confirmedTitle: "Call booked!",
      confirmedText: "You'll get an email with the date, the time and the link to change or cancel it.",
    },
    form: {
      title: "Or tell me your case",
      intro: "Pick what looks most like yours, or tell me in your own words, and add a note if you want. I reply within 24 hours.",
      choiceLabel: "What's going on?",
      choicePlaceholder: "Pick an option…",
      otherChoice: "None of these: let me explain",
      explainLabel: "Explain it to me",
      messageLabel: "Anything you'd like to add? (optional)",
    },
    hint: { text: "Esta página también está disponible en español.", link: "Leer en español", dismiss: "Dismiss notice" },
    footer: { legal: "Legal notice", privacy: "Privacy policy", cookies: "Cookie policy", cookieSettings: "Cookie settings", nav: "Legal links and contact" },
  },
};

// Calendario de Cal.com incrustado (código «inline embed» de Cal.com). `link` es usuario/evento; `namespace` es el nombre del
// evento (los dos son los de 30 minutos).
export const cal: Record<Lang, { link: string; namespace: string }> = {
  es: { link: "taller-de-digitalizacion/llamada-gratuita-de-minutos30", namespace: "llamada-gratuita-de-minutos30" },
  en: { link: "taller-de-digitalizacion/free-30-min-call", namespace: "free-30-min-call" },
};

// ---------------------------------------------------------------------------------------------------------------------
// Las cuatro páginas
// ---------------------------------------------------------------------------------------------------------------------
const faqFor = (lang: Lang, extra: Pair[] = []): Pair[] => {
  const f = shared[lang].faq;
  return [f.guarantee, f.vat, f.timeline, f.owner, f.tools, f.remote, f.language, f.ai, ...extra];
};

// FAQ del método: además de las comunes, las de seguridad de datos, ChatGPT/Claude, control, coach y cuándo no merece la pena.
const methodFaqEs: Pair[] = [
  ["¿Es seguro usar IA con los datos de mis clientes?", "Los datos se guardan en un sitio que controlas tú, como una cuenta de tu empresa en la nube, y solo trabajo con los que hacen falta para el proceso que automatizamos. Lo hablamos antes de empezar. Si no quieres que la información pase por un modelo de IA externo, se puede montar un modelo local en un servidor propio: es otro presupuesto, pero se puede."],
  ["Ya tengo ChatGPT o Claude, ¿no me basta?", "Son buenas herramientas, pero responden cuando tú les preguntas. Lo que hago yo es que el trabajo se haga solo: conecto la IA con tus programas y tus datos, la pruebo con tus casos reales y dejo a una persona para validar lo importante. Una suscripción no hace eso por ti."],
  ["¿Voy a tener que ceder el control de mi empresa a una IA?", "No. La IA prepara, cruza, avisa y propone. Lo que cuesta dinero o no se puede deshacer lo confirma siempre una persona."],
  ["¿Eres un coach o un técnico?", "Técnico. No te digo cómo llevar tu negocio: eso lo sabes tú. Yo organizo lo que ya funciona y lo automatizo."],
  ["¿Cuándo no merece la pena automatizar?", "Cuando el proceso cambia cada semana o se hace solo un par de veces al año. Si es tu caso, te lo digo en la llamada y no te vendo nada."],
];
const methodFaqEn: Pair[] = [
  ["Is it safe to use AI with my customers' data?", "Your data is stored somewhere you control, such as a cloud account in your company's name, and I only work with what the process we automate needs. We agree that before we start. If you don't want information to go through an external AI model, a local model can be set up on your own server: that is a separate quote, but it can be done."],
  ["I already have ChatGPT or Claude. Isn't that enough?", "They are good tools, but they answer when you ask them something. What I do is make the work happen on its own: I connect AI to your programs and your data, test it with your real cases and leave a person to validate what matters. A subscription doesn't do that for you."],
  ["Will I have to hand control of my business to an AI?", "No. The AI prepares, cross-checks, alerts and proposes. Anything that costs money or can't be undone is always confirmed by a person."],
  ["Are you a coach or a technician?", "A technician. I don't tell you how to run your business: you know that. I organise what already works and automate it."],
  ["When is automating not worth it?", "When the process changes every week or only happens a couple of times a year. If that's your case, I'll tell you on the call and I won't sell you anything."],
];

export const campaignPages: CampaignPage[] = [
  {
    offer: "producto",
    lang: "es",
    path: "/desarrollo-software-a-medida/",
    pairPath: "/custom-software-development/",
    campaignId: "C04-software",
    seo: {
      title: "Desarrollo de software a medida | Pablo Leone",
      description: "Desarrollo de software a medida para pymes y autónomos: aplicaciones, webs e integraciones. Diagnóstico por 90 € y trato directo con Pablo Leone.",
    },
    hero: {
      eyebrow: "Pymes y autónomos",
      h1: "Desarrollo de software a medida para tu empresa",
      subtitle: "Tu equipo deja de depender de un Excel y de una sola persona: te construyo la aplicación a medida que encaja con cómo trabajas.",
    },
    painIds: ["p1", "p3", "p4", "p5", "p6"],
    what: {
      eyebrow: "Qué hago",
      title: "Software a medida para tu empresa",
      intro: "Software a medida que se adapta a tu empresa.",
      items: [
        ["Aplicaciones a medida", "Un programa a medida, un panel de gestión o un portal interno hechos para cómo trabaja tu equipo."],
        ["Desarrollo web a medida", "Portales para tus clientes, formularios con reglas propias y apps web que se usan desde el navegador."],
        ["Automatizaciones a medida", "Rutinas y tareas programadas que juntas forman una solución a medida, adaptada a tu empresa y no al revés."],
        ["Integraciones entre plataformas", "Conecto tu web, CRM, ERP y facturación para que los datos se muevan solos."],
        ["Optimización de procesos", "Documento cómo trabajas, lo ordeno y lo automatizo."],
        ["IA integrada en tus procesos", "IA en el trabajo de cada departamento para agilizarlo: copilotos, consultas a tus datos, lectura de facturas."],
      ],
    },
    how: {
      eyebrow: "Cómo trabajo",
      title: "Cinco pasos, cada uno con su precio y lo que incluye",
      intro: "Uso IA para desarrollar más rápido. El criterio, la revisión del trabajo y la responsabilidad del resultado son míos.",
    },
    faq: faqFor("es"),
    formService: "Software a medida para empresas",
    schema: {
      name: "Desarrollo de software a medida",
      serviceType: "Desarrollo de software a medida",
      description: "Aplicaciones, webs, integraciones y automatizaciones a medida para pymes y autónomos, con diagnóstico previo y precios cerrados.",
    },
  },
  {
    offer: "producto",
    lang: "en",
    path: "/custom-software-development/",
    pairPath: "/desarrollo-software-a-medida/",
    campaignId: "C04-software",
    seo: {
      title: "Custom software development | Pablo Leone",
      description: "Custom software development for small businesses: apps, web applications and integrations. Diagnosis for €90, directly with Pablo Leone.",
    },
    hero: {
      eyebrow: "Small businesses and freelancers",
      h1: "Custom software development for your business",
      subtitle: "Your team stops depending on one spreadsheet and one person: I build the application that fits how you actually work.",
    },
    painIds: ["p1", "p3", "p4", "p5", "p6"],
    what: {
      eyebrow: "What I do",
      title: "Custom software for your business",
      intro: "Bespoke software that adapts to your business.",
      items: [
        ["Custom applications", "Bespoke software, a management dashboard or an internal portal built around how your team works."],
        ["Custom web development", "Portals for your customers, forms with their own rules and web apps that you use from the browser."],
        ["Custom automations", "Routines and scheduled tasks that together make up a custom solution, adapted to your business and not the other way round."],
        ["Integrations between platforms", "I connect your website, CRM, ERP and invoicing so data moves on its own."],
        ["Process optimisation", "I document how you work, organise it and automate it."],
        ["AI built into your processes", "AI in each department's work to speed it up: copilots, questions to your data, invoice reading."],
      ],
    },
    how: {
      eyebrow: "How I work",
      title: "Five steps, each with its price and what it includes",
      intro: "I use AI to build faster. The judgement, the review of the work and the responsibility for the result are mine.",
    },
    faq: faqFor("en"),
    formService: "Custom software development for your business",
    schema: {
      name: "Custom software development",
      serviceType: "Custom software development",
      description: "Custom applications, websites, integrations and automations for small businesses and freelancers, with a diagnosis first and fixed prices.",
    },
  },
  {
    offer: "metodo",
    lang: "es",
    path: "/automatizacion-procesos-ia/",
    pairPath: "/ai-process-automation/",
    campaignId: "C05-automatizacion",
    seo: {
      title: "Automatización de procesos con IA para pymes | Pablo Leone",
      description: "Automatización de procesos con IA para pymes: organizo lo que ya funciona y lo automatizo. Diagnóstico por 90 € y garantía de devolución.",
    },
    hero: {
      eyebrow: "Pymes y autónomos",
      h1: "Automatización de procesos con IA para pymes",
      subtitle: "Organizo lo que ya funciona en tu empresa y lo automatizo con IA para que no dependa de ti ni de una sola persona.",
    },
    painIds: ["p1", "p3", "p4", "p5", "p6", "p7", "p12"],
    how: {
      eyebrow: "Cómo trabajo",
      title: "Consultoría de transformación digital: de lo que ya funciona a algo que funciona solo",
      intro: "No te explico cómo llevar tu negocio: eso lo conoces tú. Antes de automatizar procesos con IA hago consultoría de transformación digital sin humo: cojo lo que ya te funciona, lo documento y lo organizo para que no tengas que repetirlo. Mi idea es sencilla: eliminar lo que sobra, automatizar lo que se repite y dejar en manos de la máquina lo mecánico. Uso IA para desarrollar más rápido; el criterio, la revisión y la responsabilidad del resultado son míos.",
    },
    extraWhy: ["No soy coach", "Soy técnico. Cojo lo que ya funciona en tu empresa, lo organizo y lo automatizo para que lo mismo se haga mejor y con menos esfuerzo. Hoy pongo esa experiencia, con la IA como palanca, al servicio de pymes, microempresas y autónomos: soluciones de IA para empresas pequeñas, algo que antes era inalcanzable por coste y por tiempo y ahora está a tu alcance."],
    faq: [...faqFor("es").slice(0, 3), ...methodFaqEs, ...faqFor("es").slice(3)],
    formService: "Automatización de procesos con IA",
    schema: {
      name: "Automatización de procesos con IA",
      serviceType: "Automatización de procesos con inteligencia artificial y consultoría de transformación digital",
      description: "Automatización de procesos repetitivos con IA para pymes y autónomos: se documenta lo que ya funciona, se automatiza y hay garantía de devolución en la primera implementación.",
    },
  },
  {
    offer: "metodo",
    lang: "en",
    path: "/ai-process-automation/",
    pairPath: "/automatizacion-procesos-ia/",
    campaignId: "C05-automatizacion",
    seo: {
      title: "AI process automation for small businesses | Pablo Leone",
      description: "AI process automation for small businesses: I organise what already works and automate it. Diagnosis for €90 and a money-back guarantee.",
    },
    hero: {
      eyebrow: "Small businesses and freelancers",
      h1: "AI process automation for small businesses",
      subtitle: "I organise what already works in your business and automate it with AI, so it doesn't depend on you or on one person.",
    },
    painIds: ["p1", "p3", "p4", "p5", "p6", "p7", "p12"],
    how: {
      eyebrow: "How I work",
      title: "Digital transformation consulting: from what already works to something that runs on its own",
      intro: "I won't tell you how to run your business: you know that. Before any business process automation, I do digital transformation consulting without the buzzwords: I take what already works for you, document it and organise it so you don't have to repeat it. My idea is simple: remove what isn't needed, automate what repeats (workflow automation, AI automation) and hand the mechanical work to the machine. I use AI to build faster; the judgement, the review and the responsibility for the result are mine.",
    },
    extraWhy: ["I'm not a coach", "I'm technical. I take what already works in your business, organise it and automate it so the same work gets done better and with less effort. Today I put that experience, with AI as the lever, at the service of small businesses, micro-companies and freelancers: something that used to be out of reach because of cost and time is now within your reach."],
    faq: [...faqFor("en").slice(0, 3), ...methodFaqEn, ...faqFor("en").slice(3)],
    formService: "Automation Sprint: automate repetitive tasks with AI",
    schema: {
      name: "AI process automation",
      serviceType: "AI process automation and digital transformation consulting",
      description: "Automation of repetitive processes with AI for small businesses and freelancers: what already works is documented and automated, with a money-back guarantee on the first implementation.",
    },
  },
];

export const campaignFor = (path: string) => campaignPages.find((page) => page.path === path);
