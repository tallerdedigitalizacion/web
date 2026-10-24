// Ofertas empaquetadas: precio, plazo y qué incluye, por página. Alimenta las tarjetas de la portada (services.ts),
// el cuadro "Precio, plazo y qué incluye" de cada página (OfferBox) y llms.txt. Precios en € sin IVA.
// `fixed` = precio cerrado; si no, es un precio "desde" y el cerrado se da tras una primera revisión.

export type Offer = {
  price: number;
  fixed?: boolean;
  // Unidad del precio cuando no es un proyecto, por ejemplo "hora".
  unit?: string;
  deadline: string;
  includes: string[];
  // Lo que no entra en el precio, para que no haya sorpresas.
  note?: string;
};

export const offers: Record<string, Offer> = {
  "/informatico-empresas-toledo/": {
    price: 50,
    unit: "hora",
    deadline: "Mismo día en remoto",
    includes: [
      "Conexión remota segura a tu equipo (AnyDesk) con tu permiso",
      "Correo, cuentas, programas, impresoras y red",
      "Visita a tu oficina si hay que tocar hardware",
      "Cobro por tiempo real, sin cuotas",
    ],
    note: "En visitas presenciales se suma el desplazamiento fuera de Toledo capital.",
  },
  "/copias-seguridad-empresas/": {
    price: 290,
    deadline: "3 a 5 días laborables",
    includes: [
      "Copia automática de hasta 5 equipos o de un servidor",
      "Copia de Google Workspace o Microsoft 365 si lo usas",
      "Cifrada y guardada fuera de tu oficina",
      "Prueba real de restauración, con informe",
      "Aviso por correo si una copia falla",
    ],
    note: "El almacenamiento en la nube se paga aparte, según el volumen de datos.",
  },
  "/gestor-contrasenas-empresas/": {
    price: 250,
    deadline: "2 a 3 días laborables",
    includes: [
      "Gestor de contraseñas instalado para hasta 10 personas",
      "Importación de las contraseñas que hoy tienes en Excel o en el móvil",
      "Doble factor activado",
      "Carpetas por equipo y por persona",
      "Guía corta de altas y bajas de empleados",
    ],
    note: "La licencia del gestor se paga aparte, directamente al proveedor.",
  },
  "/ciberseguridad-empresas-toledo/": {
    price: 590,
    deadline: "7 a 10 días laborables",
    includes: [
      "Revisión de equipos, correo, copias, accesos y red",
      "Informe con semáforo de riesgos y prioridades",
      "Qué exigen el RGPD y, si te afecta, la NIS2",
      "Plan de acción a 90 días",
      "Sesión de una hora para explicarte el informe",
    ],
    note: "La revisión no es una certificación ISO 27001 ni un ENS; es el paso previo para saber qué te falta.",
  },
  "/google-workspace-empresas-toledo/": {
    price: 300,
    deadline: "3 a 5 días laborables",
    includes: [
      "Dominio y correo corporativo configurados",
      "Usuarios, grupos y permisos",
      "Drive compartido de la empresa",
      "Doble factor para todos",
      "Migración del correo de hasta 5 buzones",
    ],
    note: "Las licencias de Google Workspace se pagan aparte, directamente a Google.",
  },
  "/reestructuracion-google-drive/": {
    price: 450,
    deadline: "5 a 8 días laborables",
    includes: [
      "Mapa de lo que hay hoy en el Drive",
      "Estructura de carpetas nueva y permisos por grupos",
      "Movimiento de los archivos a su sitio",
      "Guía de una página para que se mantenga ordenado",
      "Una hora de formación para el equipo",
    ],
  },
  "/diseno-web-toledo/": {
    price: 790,
    deadline: "2 a 3 semanas",
    includes: [
      "Web de hasta 5 páginas, adaptada a móvil",
      "Textos orientados a lo que buscan tus clientes en Google",
      "Formulario de contacto y botón de WhatsApp",
      "Analítica y alta en Google Search Console",
      "Dominio y hosting a tu nombre",
    ],
    note: "Tienda online, blog y más de 5 páginas se presupuestan aparte.",
  },
  "/optimizacion-velocidad-web/": {
    price: 250,
    deadline: "3 a 5 días laborables",
    includes: [
      "Diagnóstico previo gratuito: te digo qué frena tu web antes de cobrar",
      "Medición antes y después con PageSpeed y Core Web Vitals",
      "Imágenes, caché y scripts optimizados",
      "Informe con las cifras de mejora",
    ],
    note: "Si el problema es el hosting o la web hay que rehacerla, te lo digo antes de empezar.",
  },
  "/landing-page-campanas/": {
    price: 490,
    deadline: "7 a 10 días laborables",
    includes: [
      "Una página de venta pensada para un único objetivo",
      "Formulario con aviso a tu correo y conexión a tu lista o CRM",
      "Medición de visitas y contactos (analítica y píxeles)",
      "Una ronda de cambios incluida",
    ],
    note: "No incluye la gestión de campañas de anuncios.",
  },
  "/gestion-leads-crm/": {
    price: 690,
    deadline: "7 a 10 días laborables",
    includes: [
      "Formularios de la web, WhatsApp y correo en un solo sitio",
      "CRM configurado con tu embudo de venta",
      "Respuesta automática y aviso cuando entra un contacto",
      "Panel que muestra de dónde llega cada contacto",
      "Una hora de formación para quien lo use",
    ],
    note: "La licencia del CRM, si no usas uno gratuito, se paga aparte.",
  },
  "/agente-ia-atencion-cliente/": {
    price: 890,
    deadline: "2 a 3 semanas",
    includes: [
      "Agente de IA entrenado con tus preguntas frecuentes y documentos",
      "En tu web, en WhatsApp o en ambos",
      "Traspaso a una persona con el historial de la conversación",
      "Límites claros: qué responde y qué no",
      "Revisión de conversaciones durante el primer mes",
    ],
    note: "El coste de la plataforma y del uso de la IA se paga aparte, según el volumen de consultas.",
  },
  "/asistente-ia-empresa/": {
    price: 990,
    deadline: "2 a 3 semanas",
    includes: [
      "Recopilación y orden de los documentos de la empresa",
      "Chat de IA que responde y cita el documento de donde saca la respuesta",
      "Accesos por persona o por equipo",
      "Responde que no lo sabe cuando no hay información",
      "Formación al equipo",
    ],
    note: "El coste de la plataforma y del uso de la IA se paga aparte, según el uso.",
  },
  "/casos/entrada-facturas-automatica/": {
    price: 2500,
    deadline: "3 a 4 semanas",
    includes: [
      "Lectura automática de las facturas que te llegan",
      "Entrada en tu programa de gestión",
      "Una persona valida lo que tiene dudas",
      "Aviso de duplicados y de importes raros",
    ],
  },
  "/casos/conciliacion-proveedores/": {
    price: 490,
    fixed: true,
    deadline: "5 días laborables",
    includes: [
      "Cruce de lo que te facturan los proveedores con lo que tienes dado de alta",
      "Informe de lo que pagas sin tener o de diferencias de importe",
      "Reunión para explicarte los resultados",
    ],
  },
  "/casos/dar-de-baja-software-historico/": {
    price: 900,
    deadline: "2 a 3 semanas",
    includes: [
      "Extracción de los datos del programa antiguo",
      "Guardado en una base de datos tuya",
      "Consulta con IA en lenguaje normal",
      "Tú decides cuándo cancelar la licencia",
    ],
  },
  "/casos/consulta-cobertura-ia/": {
    price: 1200,
    deadline: "2 a 3 semanas",
    includes: [
      "Tus datos de cobertura conectados a la IA",
      "Pregunta por una dirección y te dice si hay cobertura y a qué distancia está la más cercana",
      "Funciona desde el chat que ya usa tu equipo",
    ],
  },
  "/diagnostico-en-tu-empresa/": {
    price: 190,
    fixed: true,
    deadline: "Visita de unas 2 horas",
    includes: [
      "Visita a tu empresa (o videollamada) de unas 2 horas",
      "Repaso de equipos, programas, copias, accesos y facturas",
      "Lista priorizada de qué arreglar primero, con precios orientativos",
      "Resumen por escrito",
      "Se descuenta íntegro si después contratas un proyecto conmigo",
    ],
    note: "Visitas presenciales a menos de 50 km de Fuensalida; fuera de esa zona, por videollamada.",
  },
  "/diagnostico-caos-operativo/": {
    price: 1000,
    fixed: true,
    deadline: "2 a 3 semanas",
    includes: [
      "Mapa de cómo funciona hoy la empresa",
      "Puntuación y prioridades",
      "Tres implementaciones de alto impacto",
      "Hoja de ruta",
    ],
  },
  "/diagnostico-digitalizacion/": {
    price: 690,
    deadline: "1 a 2 semanas",
    includes: [
      "Revisión de tus procesos y de los programas que usas",
      "Informe priorizado: qué cambiar y en qué orden",
      "Plan de acción con costes estimados",
      "Reunión para explicarlo",
    ],
  },
  "/consultor-digitalizacion-toledo/": {
    price: 90,
    unit: "hora",
    deadline: "Sesión en 1 semana",
    includes: [
      "Sesiones de consultoría en remoto o en tu oficina",
      "Qué cambiar, en qué orden y con qué herramientas",
      "Resumen por escrito de cada sesión",
    ],
  },
  "/consultoria-erp-pymes/": {
    price: 490,
    deadline: "5 a 7 días laborables",
    includes: [
      "Revisión de cómo usas hoy tu ERP o software de gestión",
      "Mapa de procesos frente a lo que el programa hace",
      "Informe con recomendación: mantener, ajustar o cambiar",
      "Si hay que cambiar, tres alternativas comparadas",
    ],
  },
  "/integracion-sistemas/": {
    price: 590,
    deadline: "1 a 2 semanas",
    includes: [
      "Conexión de dos sistemas (por ejemplo CRM y facturación)",
      "Pruebas con datos reales",
      "Documentación de cómo funciona",
      "30 días de ajustes incluidos",
    ],
    note: "El precio es por cada conexión entre dos sistemas.",
  },
  "/herramientas-internas-medida/": {
    price: 2500,
    deadline: "3 a 6 semanas",
    includes: [
      "Análisis de cómo trabaja tu equipo",
      "Prototipo para validar antes de desarrollar",
      "Aplicación hecha a medida",
      "Formación y 30 días de soporte",
    ],
  },
  "/caos-operativo-telecomunicaciones/": {
    price: 1000,
    fixed: true,
    deadline: "2 a 3 semanas",
    includes: [
      "Diagnóstico de la operación de un ISP u operador pequeño",
      "Mapa desde la venta hasta la instalación y la baja",
      "Prioridades y hoja de ruta",
    ],
  },
};

// Versión en inglés. Las claves son las rutas inglesas.
export const offersEn: Record<string, Offer> = {
  "/business-password-manager-setup/": {
    price: 300,
    deadline: "2 to 3 business days",
    includes: [
      "Password manager set up for up to 10 people",
      "Import of the passwords you now keep in a spreadsheet or on phones",
      "Two-factor authentication on",
      "Folders per team and per person",
      "A short joiner and leaver guide",
    ],
    note: "The password manager licence is paid separately, directly to the provider.",
  },
  "/google-workspace-reorganization/": {
    price: 350,
    deadline: "3 to 5 business days",
    includes: [
      "Domain and business email configured",
      "Users, groups and permissions",
      "Shared company Drive",
      "Two-factor for everyone",
      "Email migration for up to 5 mailboxes",
    ],
    note: "Google Workspace licences are paid separately, directly to Google.",
  },
  "/corporate-google-drive-restructuring/": {
    price: 500,
    deadline: "5 to 8 business days",
    includes: [
      "A map of what is in the Drive today",
      "New folder structure and group-based permissions",
      "Files moved into place",
      "A one-page guide to keep it tidy",
      "One hour of training for the team",
    ],
  },
  "/website-speed-optimization/": {
    price: 300,
    deadline: "3 to 5 business days",
    includes: [
      "Free diagnosis first: I tell you what slows your site down before charging",
      "Before and after measurements with PageSpeed and Core Web Vitals",
      "Images, caching and scripts optimized",
      "A report with the improvement in numbers",
    ],
    note: "If the cause is the hosting or the site needs rebuilding, I tell you before we start.",
  },
  "/conversion-landing-pages/": {
    price: 600,
    deadline: "7 to 10 business days",
    includes: [
      "One sales page built around a single goal",
      "Form with an email alert, connected to your list or CRM",
      "Tracking of visits and contacts (analytics and pixels)",
      "One round of changes included",
    ],
    note: "Running the ad campaigns is not included.",
  },
  "/crm-implementation/": {
    price: 850,
    deadline: "7 to 10 business days",
    includes: [
      "Website forms, WhatsApp and email in one place",
      "CRM set up with your sales pipeline",
      "Automatic reply and an alert when a contact arrives",
      "A dashboard showing where each contact came from",
      "One hour of training for whoever uses it",
    ],
    note: "The CRM licence, if you do not use a free one, is paid separately.",
  },
  "/ai-chatbot-small-business/": {
    price: 1100,
    deadline: "2 to 3 weeks",
    includes: [
      "An AI agent trained on your FAQs and documents",
      "On your website, on WhatsApp or both",
      "Handoff to a person with the conversation history",
      "Clear limits: what it answers and what it does not",
      "Conversation review during the first month",
    ],
    note: "The platform and AI usage cost is paid separately, based on volume.",
  },
  "/ai-knowledge-base/": {
    price: 1200,
    deadline: "2 to 3 weeks",
    includes: [
      "Your company documents gathered and organized",
      "An AI chat that answers and cites the document it used",
      "Access per person or per team",
      "It says it does not know when the information is not there",
      "Team training",
    ],
    note: "The platform and AI usage cost is paid separately, based on usage.",
  },
  "/digitalization-assessment/": {
    price: 750,
    deadline: "1 to 2 weeks",
    includes: [
      "A review of your processes and the software you use",
      "A prioritized report: what to change and in which order",
      "An action plan with estimated costs",
      "A meeting to walk you through it",
    ],
  },
  "/systems-integration/": {
    price: 700,
    deadline: "1 to 2 weeks",
    includes: [
      "Two systems connected (for example CRM and invoicing)",
      "Testing with real data",
      "Documentation of how it works",
      "30 days of adjustments included",
    ],
    note: "The price is per connection between two systems.",
  },
  "/custom-internal-tools/": {
    price: 3000,
    deadline: "3 to 6 weeks",
    includes: [
      "Analysis of how your team works",
      "A prototype to validate before building",
      "A tool built to your process",
      "Training and 30 days of support",
    ],
  },
  "/ai-process-automation/": {
    price: 3000,
    deadline: "3 to 4 weeks",
    includes: [
      "One process automated end to end (for example automatic invoice entry, with a person validating)",
      "Tested with your real data before it goes live",
      "Documentation and a handover call",
      "30 days of adjustments included",
    ],
    note: "A one-off supplier spend audit is available as a closed-price starter from $590.",
  },
};

const money = (amount: number, lang: "es" | "en") =>
  lang === "en" ? `$${amount.toLocaleString("en-US")}` : `${amount.toLocaleString("de-DE")} €`;

// "Desde 290 € + IVA" · "490 € + IVA (precio cerrado)" · "Desde 50 €/hora + IVA"
export function priceLabel(offer: Offer, lang: "es" | "en" = "es"): string {
  const amount = money(offer.price, lang);
  const unit = offer.unit ? `/${offer.unit}` : "";
  if (lang === "en") {
    const base = `${offer.fixed ? "" : "From "}${amount}${unit}`;
    return offer.fixed ? `${base} (fixed price, excl. taxes)` : `${base} (excl. taxes)`;
  }
  const base = `${offer.fixed ? "" : "Desde "}${amount}${unit} + IVA`;
  return offer.fixed ? `${base} (precio cerrado)` : base;
}

export const offerFor = (href: string, lang: "es" | "en" = "es"): Offer | undefined => (lang === "en" ? offersEn : offers)[href];
