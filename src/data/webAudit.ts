export const webAuditWeights = [
  { key: "business", weight: 15 },
  { key: "performance", weight: 20 },
  { key: "seo", weight: 15 },
  { key: "conversion", weight: 15 },
  { key: "security", weight: 15 },
  { key: "infrastructure", weight: 15 },
  { key: "governance", weight: 5 },
] as const;

export const webAuditShared = {
  bookingUrl: "https://cal.com/taller-de-digitalizacion/free-15-min-website-speed-call",
  spanishPath: "/informe-gratuito-web",
  englishPath: "/free-website-report",
};

export type WebAuditLang = "es" | "en";

const es = {
  title: "Auditoría Web Técnica para empresas | Taller de Digitalización",
  description:
    "Detecta si tu web está perdiendo leads por velocidad, SEO técnico, formularios, seguridad o infraestructura. Auditoría web desde 399 USD.",
  nav: [
    ["Problema", "#problema"],
    ["Autoauditoría", "#autoevaluacion"],
    ["Auditoría", "#auditoria"],
    ["Qué incluye", "#descarga"],
    ["FAQ", "#faq"],
  ],
  hero: {
    eyebrow: "Auditoría Web Técnica",
    h1: "¿Tu web está preparada para convertir visitas en leads?",
    subtitle:
      "Audito la parte técnica, comercial y operativa de tu sitio web para detectar dónde estás perdiendo oportunidades: velocidad, SEO técnico, formularios, seguridad, infraestructura y trazabilidad.",
    primaryCta: "Hacer autoauditoría gratuita",
    secondaryCta: "Reservar llamada de 15 minutos",
    note: "Si no veo margen claro de mejora, te lo diré.",
  },
  reveal: {
    eyebrow: "Lo que se dice en una reunión",
    h2: "Lo que dices vs. lo que revela",
    intro: "Haz click en cada tarjeta para ver qué suele esconder cada síntoma y qué conviene revisar.",
    cards: [
      {
        says: "Tenemos visitas, pero pocos contactos.",
        reveals: "La web recibe tráfico, pero el sistema de captación puede estar fallando en móvil, formularios, oferta, confianza o medición.",
        action: "Revisar el recorrido real del usuario, la trazabilidad del lead y los puntos donde se pierde intención.",
      },
      {
        says: "Estamos pagando anuncios, pero no vemos retorno.",
        reveals: "Puede haber fricción técnica entre el anuncio y el lead: velocidad, landing, tracking, formulario o atribución.",
        action: "Cruzar inversión, velocidad móvil, formularios, eventos y destino de leads para detectar fugas antes de tocar campañas.",
      },
      {
        says: "La web va lenta.",
        reveals: "La lentitud suele ser un síntoma de arquitectura, hosting, tema, scripts, imágenes o mantenimiento acumulado.",
        action: "Separar lo que se puede optimizar rápido de lo que exige simplificar, migrar o cambiar infraestructura.",
      },
      {
        says: "El proveedor dice que está todo bien.",
        reveals: "Sin métricas, pruebas y trazabilidad, 'todo bien' puede significar solo que no hay una incidencia visible.",
        action: "Contrastar estado técnico con evidencias: rendimiento, seguridad, backups, formularios, staging y proceso de cambios.",
      },
      {
        says: "No sabemos si los formularios funcionan.",
        reveals: "El negocio no controla el punto exacto donde una visita se convierte en oportunidad comercial.",
        action: "Probar formularios, destino de emails, notificaciones, CRM, spam, eventos y recuperación de leads fallidos.",
      },
      {
        says: "Tenemos WordPress, pero cada cambio da miedo.",
        reveals: "Puede faltar gobierno técnico: backups fiables, staging, control de plugins, permisos, actualizaciones y rollback.",
        action: "Mapear riesgos antes de cambiar nada y definir una forma segura de intervenir sin tocar producción a ciegas.",
      },
    ],
  },
  criterion: {
    eyebrow: "Criterio antes que herramientas",
    h2: "Una web no es una tarjeta de visita. Es un sistema de captación.",
    text:
      "Una web puede verse bien y aun así perder leads por velocidad, móvil, formularios, seguridad, infraestructura, falta de medición o mala arquitectura. La auditoría mira la web como sistema: cómo entra una visita, qué fricciones encuentra, dónde se registra el lead y qué riesgos técnicos pueden cortar el flujo comercial.",
    bullets: [
      "Velocidad real en móvil antes que sensación visual.",
      "Formularios probados antes que suposiciones.",
      "SEO técnico básico antes que promesas de posicionamiento.",
      "Backups, staging y accesos antes que tocar producción.",
      "Trazabilidad comercial antes que informes bonitos.",
    ],
  },
  offer: {
    eyebrow: "Producto",
    h2: "Auditoría Web Técnica",
    price: "Desde 399 USD",
    time: "3 días",
    intro:
      "Es un producto de diagnóstico, no de implementación. Recibes claridad técnica y una hoja de ruta priorizada. Después puedes ejecutar con tu equipo, con mi guía o contratándome para hacerlo.",
    deliverables: [
      "Diagnóstico técnico",
      "Score por áreas",
      "Roadmap priorizado",
      "Riesgos detectados",
      "Recomendaciones de reparación, migración o simplificación",
      "Opcional: presupuesto de implementación",
    ],
  },
  not: {
    eyebrow: "Límites claros",
    h2: "No es una auditoría SEO genérica.",
    intro: "El foco es técnico, comercial y operativo. Primero entender. Después decidir.",
    items: [
      "No es una auditoría SEO genérica.",
      "No es una revisión estética.",
      "No es instalar plugins sin criterio.",
      "No es prometer más ventas.",
      "No es tocar producción sin entender el sistema.",
      "No es llenar un PDF con obviedades.",
    ],
  },
  download: {
    eyebrow: "Documento ejecutivo",
    h2: "Descarga qué incluye una Auditoría Web Técnica",
    text:
      "Una hoja ejecutiva para compartir internamente con socios: qué se revisa, qué no se revisa, qué entregables recibe la empresa, cómo se priorizan problemas y qué modalidades existen después.",
    button: "Descargar documento",
    status: "Te enviaremos el documento por email.",
  },
  faq: {
    eyebrow: "FAQ",
    h2: "Preguntas frecuentes",
    items: [
      ["¿Esto es SEO o marketing?", "No exactamente. La auditoría revisa SEO técnico básico y conversión, pero no vende campañas ni contenido. Mira la web como sistema de captación."],
      ["¿Revisas WordPress?", "Sí. WordPress es uno de los casos habituales: plugins, tema, hosting, actualizaciones, formularios, backups, permisos y riesgo de cambios."],
      ["¿Sirve si mi web está hecha a medida?", "Sí. La lógica es la misma: rendimiento, arquitectura, formularios, seguridad, despliegues, trazabilidad y continuidad."],
      ["¿La auditoría cubre seguridad?", "Cubre seguridad básica y riesgos técnicos visibles: HTTPS, 2FA, permisos, superficie de plugins, backups, accesos y exposición innecesaria."],
      ["¿Revisas servidor, base de datos e infraestructura?", "Sí, hasta el nivel que permitan los accesos y el contexto. Si no hace falta entrar, se revisa desde evidencias externas y documentación."],
      ["¿Incluye implementación?", "No. La auditoría diagnostica y prioriza. La implementación puede hacerla tu equipo, hacerla con mi guía o contratarme para ejecutarla."],
      ["¿Cuánto tarda?", "La entrega estándar tarda 3 días desde que tengo el contexto y los accesos mínimos necesarios."],
      ["¿Necesito dar accesos?", "Para la primera lectura no siempre. Para revisar backups, servidor, analítica, formularios o staging puede hacer falta acceso temporal y limitado."],
      ["¿Y si mi web está bien?", "Te lo diré. Si no veo margen claro de mejora, no tiene sentido inventar problemas."],
      ["¿Qué pasa después de la auditoría?", "Recibes un roadmap priorizado. Puedes ejecutarlo internamente, pedir guía puntual o solicitar un presupuesto de implementación."],
    ],
  },
};

const en: typeof es = {
  title: "Technical Web Audit for businesses | Taller de Digitalización",
  description:
    "Find out whether your website is losing leads because of speed, technical SEO, forms, security or infrastructure. Web audit from 399 USD.",
  nav: [
    ["Problem", "#problem"],
    ["Self-audit", "#self-assessment"],
    ["Audit", "#audit"],
    ["What's included", "#download"],
    ["FAQ", "#faq"],
  ],
  hero: {
    eyebrow: "Technical Web Audit",
    h1: "Is your website ready to turn visits into leads?",
    subtitle:
      "I audit the technical, commercial and operational side of your website to find where opportunities are leaking: speed, technical SEO, forms, security, infrastructure and tracking.",
    primaryCta: "Run the free self-audit",
    secondaryCta: "Book a 15-minute call",
    note: "If I do not see a clear improvement opportunity, I will tell you.",
  },
  reveal: {
    eyebrow: "What teams say",
    h2: "What you say vs. what it reveals",
    intro: "Click each card to see what each symptom usually hides and what should be checked.",
    cards: [
      {
        says: "We get visits, but very few enquiries.",
        reveals: "Traffic is arriving, but the capture system may be failing on mobile, forms, offer clarity, trust or measurement.",
        action: "Review the real user path, lead tracking and the points where intent is lost.",
      },
      {
        says: "We are paying for ads, but cannot see the return.",
        reveals: "There may be technical friction between the ad click and the lead: speed, landing page, tracking, form or attribution.",
        action: "Cross-check spend, mobile speed, forms, events and lead destination before changing campaigns.",
      },
      {
        says: "The website is slow.",
        reveals: "Slowness is often a symptom of architecture, hosting, theme bloat, scripts, images or accumulated maintenance.",
        action: "Separate quick optimizations from issues that require simplification, migration or infrastructure changes.",
      },
      {
        says: "The provider says everything is fine.",
        reveals: "Without metrics, tests and traceability, 'fine' may only mean there is no visible incident right now.",
        action: "Compare the technical state against evidence: performance, security, backups, forms, staging and change process.",
      },
      {
        says: "We do not know if the forms work.",
        reveals: "The business does not control the exact point where a visit becomes a commercial opportunity.",
        action: "Test forms, email destinations, notifications, CRM, spam, events and recovery of failed leads.",
      },
      {
        says: "We use WordPress, but every change feels risky.",
        reveals: "Technical governance may be missing: reliable backups, staging, plugin control, permissions, updates and rollback.",
        action: "Map risks before changing anything and define a safer way to work without touching production blindly.",
      },
    ],
  },
  criterion: {
    eyebrow: "Judgment before tools",
    h2: "A website is not a business card. It is a lead capture system.",
    text:
      "A website can look polished and still lose leads because of speed, mobile experience, forms, security, infrastructure, missing measurement or weak architecture. The audit treats the website as a system: how a visit enters, what friction it meets, where the lead is recorded and which technical risks can interrupt the commercial flow.",
    bullets: [
      "Real mobile speed before visual impressions.",
      "Tested forms before assumptions.",
      "Basic technical SEO before ranking promises.",
      "Backups, staging and access control before production changes.",
      "Commercial traceability before pretty reports.",
    ],
  },
  offer: {
    eyebrow: "Product",
    h2: "Technical Web Audit",
    price: "From 399 USD",
    time: "3 days",
    intro:
      "This is a diagnosis product, not an implementation package. You get technical clarity and a prioritized roadmap. After that, your team can execute it, you can ask me for guidance, or you can hire me to implement it.",
    deliverables: [
      "Technical diagnosis",
      "Score by area",
      "Prioritized roadmap",
      "Detected risks",
      "Repair, migration or simplification recommendations",
      "Optional implementation quote",
    ],
  },
  not: {
    eyebrow: "Clear boundaries",
    h2: "It is not a generic SEO audit.",
    intro: "The focus is technical, commercial and operational. Understand first. Decide after.",
    items: [
      "It is not a generic SEO audit.",
      "It is not a visual design review.",
      "It is not installing plugins without judgment.",
      "It is not promising more sales.",
      "It is not touching production before understanding the system.",
      "It is not filling a PDF with obvious comments.",
    ],
  },
  download: {
    eyebrow: "Executive document",
    h2: "Download what a Technical Web Audit includes",
    text:
      "A one-page executive document you can share internally: what is reviewed, what is not reviewed, what deliverables the company receives, how issues are prioritized and what can happen after the audit.",
    button: "Download document",
    status: "We will send the document by email.",
  },
  faq: {
    eyebrow: "FAQ",
    h2: "Common questions",
    items: [
      ["Is this SEO or marketing?", "Not exactly. The audit reviews basic technical SEO and conversion, but it does not sell campaigns or content. It looks at the website as a lead capture system."],
      ["Do you review WordPress?", "Yes. WordPress is a common case: plugins, theme, hosting, updates, forms, backups, permissions and change risk."],
      ["Does it work if my website is custom-built?", "Yes. The logic is the same: performance, architecture, forms, security, deployments, traceability and continuity."],
      ["Does the audit cover security?", "It covers basic security and visible technical risks: HTTPS, 2FA, permissions, plugin surface, backups, access and unnecessary exposure."],
      ["Do you review server, database and infrastructure?", "Yes, to the level allowed by the access and context. If direct access is not needed, the review uses external evidence and documentation."],
      ["Does it include implementation?", "No. The audit diagnoses and prioritizes. Implementation can be handled by your team, guided by me, or quoted separately."],
      ["How long does it take?", "The standard delivery takes 3 days once I have the context and the minimum access needed."],
      ["Do I need to give access?", "Not always for the first read. To check backups, server, analytics, forms or staging, temporary limited access may be needed."],
      ["What if my website is already fine?", "I will tell you. If I do not see a clear improvement opportunity, there is no point inventing problems."],
      ["What happens after the audit?", "You receive a prioritized roadmap. You can execute it internally, ask for guidance or request an implementation quote."],
    ],
  },
};

export const webAuditContent = { es, en };

export const webAuditAssessment = {
  es: {
    id: "autoevaluacion",
    labels: {
      sectionEyebrow: "Autoevaluación gratuita",
      title: "Autoaudita tu web como sistema de captación",
      intro:
        "Responde las preguntas, pega tus resultados de PageSpeed y recibirás un score básico. El reporte detallado se generará desde el backend y llegará por email.",
      initialStep: "Contexto de la web",
      finalStep: "Datos para recibir tu reporte",
      next: "Siguiente área",
      previous: "Anterior",
      continue: "Continuar",
      submit: "Calcular mi score web",
      reset: "Reiniciar autoauditoría",
      requiredError: "Completa las respuestas de este paso para continuar.",
      processing: "Procesando autoauditoría...",
      resultEyebrow: "Score básico",
      reportComing: "Tu reporte detallado está en camino.",
      resultNote:
        "Esta lectura no sustituye una auditoría técnica completa. Sirve para detectar señales de fuga y ordenar la conversación.",
      bookResult: "Reservar llamada para revisar mi web",
      pagespeedMobile: "Abrir PageSpeed móvil",
      pagespeedDesktop: "Abrir PageSpeed escritorio",
      pagespeedHelp: "Abre PageSpeed Insights, analiza la URL y pega aquí las puntuaciones manualmente.",
      unknownOption: "No lo sé",
      name: "Nombre",
      email: "Email",
      company: "Empresa",
      optional: "Opcional.",
      privacy: "Acepto la política de privacidad.",
      websiteUrl: "URL de la web",
      websiteType: "Tipo de web",
      paidAds: "¿Pagas anuncios?",
      primaryChannel: "Canal principal conocido",
      mobileScore: "PageSpeed móvil",
      desktopScore: "PageSpeed escritorio",
    },
    options: {
      websiteTypes: ["Negocio local", "Tienda física", "Ecommerce", "SaaS/producto digital", "Servicios profesionales", "Otro"],
      paidAds: ["Google Ads", "Meta Ads", "Varias plataformas", "No", "No lo sé"],
      primaryChannels: ["Móvil", "Escritorio", "Mixto", "No lo sé"],
    },
    areas: [
      {
        key: "business",
        name: "Captación y negocio",
        questions: [
          ["¿Sabes de qué canales vienen los leads?", ["No se mide", "No lo sé", "Se mira a veces", "Está medido por canal", "Está medido y se revisa para decidir"]],
          ["¿La web tiene una acción principal clara?", ["No", "No lo sé", "Hay varias acciones confusas", "Hay una acción clara en páginas clave", "Hay una acción clara y coherente en todo el recorrido"]],
          ["¿Revisas la relación entre tráfico, leads y oportunidades reales?", ["No", "No lo sé", "Solo de forma manual", "Se revisa periódicamente", "Se revisa con métricas y decisiones"]],
        ],
      },
      {
        key: "performance",
        name: "Rendimiento y experiencia",
        questions: [
          ["¿Las páginas importantes son fáciles de usar en móvil?", ["No", "No lo sé", "Algunas", "La mayoría", "Todas las páginas críticas están revisadas"]],
          ["¿Controlas scripts, plugins o recursos que ralentizan la web?", ["No", "No lo sé", "Solo cuando hay problemas", "Se revisan periódicamente", "Hay criterio claro antes de añadir cualquier recurso"]],
        ],
      },
      {
        key: "seo",
        name: "SEO técnico básico",
        questions: [
          ["¿Las páginas importantes tienen títulos, descripciones y encabezados correctos?", ["No", "No lo sé", "Solo algunas", "La mayoría", "Está revisado y documentado"]],
          ["¿La web está indexando lo que debe y evitando lo que no debe?", ["No", "No lo sé", "Se revisó una vez", "Se revisa periódicamente", "Está controlado con Search Console y criterio técnico"]],
          ["¿Hay errores técnicos visibles como 404, redirecciones rotas o contenido duplicado?", ["Sí, muchos", "No lo sé", "Algunos", "Pocos y controlados", "Se monitorizan y corrigen"]],
        ],
      },
      {
        key: "conversion",
        name: "Conversión y formularios",
        questions: [
          ["¿Has probado los formularios recientemente?", ["No", "No lo sé", "Hace tiempo", "Sí, de forma manual", "Sí, con pruebas y seguimiento"]],
          ["¿Sabes exactamente dónde llegan los leads?", ["No", "No lo sé", "A una bandeja compartida", "A una persona o CRM definido", "A un flujo trazable con responsable"]],
          ["¿La web confirma, registra o alerta cuando entra una solicitud?", ["No", "No lo sé", "Solo email simple", "Email o CRM con notificación", "Confirmación, registro y seguimiento claro"]],
        ],
      },
      {
        key: "security",
        name: "Seguridad",
        questions: [
          ["¿La web tiene HTTPS correcto en todas las páginas?", ["No", "No lo sé", "Hay dudas o avisos", "Sí", "Sí y se monitoriza"]],
          ["¿Los accesos de administración usan 2FA?", ["No", "No lo sé", "Solo algunos", "Sí en cuentas principales", "Sí en todas las cuentas críticas"]],
          ["¿Los permisos están limitados según rol?", ["No", "No lo sé", "Más o menos", "Sí en cuentas principales", "Sí y se revisan altas/bajas"]],
        ],
      },
      {
        key: "infrastructure",
        name: "Infraestructura y continuidad",
        questions: [
          ["¿Existen backups automáticos y recuperables?", ["No", "No lo sé", "Hay copias, pero no se probaron", "Sí, con frecuencia definida", "Sí, probados y con proceso de recuperación"]],
          ["¿Tienes staging o entorno de pruebas para cambios?", ["No", "No lo sé", "Solo a veces", "Sí para cambios relevantes", "Sí, con flujo claro antes de producción"]],
          ["¿Sabes quién controla dominio, hosting, DNS y base de datos?", ["No", "No lo sé", "Está repartido y poco claro", "Sí, está identificado", "Sí, está documentado y bajo control"]],
        ],
      },
      {
        key: "governance",
        name: "Gobernanza técnica",
        questions: [
          ["¿Hay criterio antes de instalar plugins, scripts o integraciones?", ["No", "No lo sé", "Depende del proveedor", "Sí, se revisa impacto", "Sí, hay proceso y responsable"]],
          ["¿Los cambios quedan registrados o documentados?", ["No", "No lo sé", "Solo cambios grandes", "Sí, en algún sistema", "Sí, con responsable, fecha y motivo"]],
          ["¿Está claro quién decide, aprueba y valida cambios en la web?", ["No", "No lo sé", "Más o menos", "Sí", "Sí, con flujo definido"]],
        ],
      },
    ],
  },
  en: {
    id: "self-assessment",
    labels: {
      sectionEyebrow: "Free self-audit",
      title: "Self-audit your website as a lead capture system",
      intro:
        "Answer the questions, paste your PageSpeed results and get a basic score. The detailed report will be generated by the backend and sent by email.",
      initialStep: "Website context",
      finalStep: "Details to receive your report",
      next: "Next area",
      previous: "Previous",
      continue: "Continue",
      submit: "Calculate my web score",
      reset: "Restart self-audit",
      requiredError: "Complete this step before continuing.",
      processing: "Processing self-audit...",
      resultEyebrow: "Basic score",
      reportComing: "Your detailed report is on its way.",
      resultNote:
        "This reading does not replace a full technical audit. It helps detect leakage signals and structure the conversation.",
      bookResult: "Book a call to review my website",
      pagespeedMobile: "Open mobile PageSpeed",
      pagespeedDesktop: "Open desktop PageSpeed",
      pagespeedHelp: "Open PageSpeed Insights, analyze the URL and paste the scores here manually.",
      unknownOption: "I do not know",
      name: "Name",
      email: "Email",
      company: "Company",
      optional: "Optional.",
      privacy: "I accept the privacy policy.",
      websiteUrl: "Website URL",
      websiteType: "Type of website",
      paidAds: "Do you pay for ads?",
      primaryChannel: "Known main channel",
      mobileScore: "Mobile PageSpeed",
      desktopScore: "Desktop PageSpeed",
    },
    options: {
      websiteTypes: ["Local business", "Physical store", "Ecommerce", "SaaS/digital product", "Professional services", "Other"],
      paidAds: ["Google Ads", "Meta Ads", "Several platforms", "No", "I do not know"],
      primaryChannels: ["Mobile", "Desktop", "Mixed", "I do not know"],
    },
    areas: [
      {
        key: "business",
        name: "Acquisition and business",
        questions: [
          ["Do you know which channels your leads come from?", ["Not measured", "I do not know", "Checked occasionally", "Measured by channel", "Measured and reviewed for decisions"]],
          ["Does the website have one clear primary action?", ["No", "I do not know", "Several confusing actions", "Clear action on key pages", "Clear and consistent action across the journey"]],
          ["Do you review the relationship between traffic, leads and real opportunities?", ["No", "I do not know", "Only manually", "Reviewed periodically", "Reviewed with metrics and decisions"]],
        ],
      },
      {
        key: "performance",
        name: "Performance and experience",
        questions: [
          ["Are the important pages easy to use on mobile?", ["No", "I do not know", "Some of them", "Most of them", "All critical pages are reviewed"]],
          ["Do you control scripts, plugins or resources that slow the site down?", ["No", "I do not know", "Only when there are problems", "Reviewed periodically", "Clear criteria before adding anything"]],
        ],
      },
      {
        key: "seo",
        name: "Basic technical SEO",
        questions: [
          ["Do important pages have correct titles, descriptions and headings?", ["No", "I do not know", "Only some", "Most of them", "Reviewed and documented"]],
          ["Is the site indexing what it should and avoiding what it should not?", ["No", "I do not know", "Reviewed once", "Reviewed periodically", "Controlled with Search Console and technical judgment"]],
          ["Are there visible technical errors such as 404s, broken redirects or duplicate content?", ["Many", "I do not know", "Some", "Few and controlled", "Monitored and corrected"]],
        ],
      },
      {
        key: "conversion",
        name: "Conversion and forms",
        questions: [
          ["Have you tested the forms recently?", ["No", "I do not know", "A long time ago", "Yes, manually", "Yes, with tests and tracking"]],
          ["Do you know exactly where leads arrive?", ["No", "I do not know", "A shared inbox", "A defined person or CRM", "A traceable flow with an owner"]],
          ["Does the website confirm, record or alert when a request arrives?", ["No", "I do not know", "Simple email only", "Email or CRM notification", "Confirmation, record and clear follow-up"]],
        ],
      },
      {
        key: "security",
        name: "Security",
        questions: [
          ["Does the website have correct HTTPS on every page?", ["No", "I do not know", "There are doubts or warnings", "Yes", "Yes, and monitored"]],
          ["Do admin accounts use 2FA?", ["No", "I do not know", "Only some", "Yes on main accounts", "Yes on every critical account"]],
          ["Are permissions limited by role?", ["No", "I do not know", "More or less", "Yes on main accounts", "Yes, and access changes are reviewed"]],
        ],
      },
      {
        key: "infrastructure",
        name: "Infrastructure and continuity",
        questions: [
          ["Do automatic and recoverable backups exist?", ["No", "I do not know", "Backups exist but were not tested", "Yes, with defined frequency", "Yes, tested with a recovery process"]],
          ["Do you have staging or a test environment for changes?", ["No", "I do not know", "Only sometimes", "Yes for relevant changes", "Yes, with a clear pre-production flow"]],
          ["Do you know who controls domain, hosting, DNS and database?", ["No", "I do not know", "Split and unclear", "Yes, identified", "Yes, documented and under control"]],
        ],
      },
      {
        key: "governance",
        name: "Technical governance",
        questions: [
          ["Is there judgment before installing plugins, scripts or integrations?", ["No", "I do not know", "Depends on the provider", "Yes, impact is reviewed", "Yes, with process and owner"]],
          ["Are changes recorded or documented?", ["No", "I do not know", "Only major changes", "Yes, somewhere", "Yes, with owner, date and reason"]],
          ["Is it clear who decides, approves and validates website changes?", ["No", "I do not know", "More or less", "Yes", "Yes, with a defined flow"]],
        ],
      },
    ],
  },
} as const;

export type WebAuditAssessmentCopy = (typeof webAuditAssessment)[WebAuditLang];
