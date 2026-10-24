import { siteConfig } from "@/config/site";
import { offerFor, priceLabel } from "@/data/offers";

// Catálogo único de servicios: alimenta la portada, el desplegable del formulario, el footer y llms.txt.
// "Planes mensuales" son los servicios recurrentes; el resto de grupos son paquetes con precio y plazo (offers.ts).
// Cada paquete se nombra como lo buscaría quien lo compra, no como lo llamo yo por dentro.
export const planGroup = "Planes mensuales";
export const serviceGroups = [planGroup, "Informática y seguridad", "Web", "Clientes y leads con IA", "Automatizar tareas", "Ordenar y conectar la empresa"] as const;
export const projectGroups = serviceGroups.filter((group) => group !== planGroup);
export type ServiceGroup = (typeof serviceGroups)[number];

export type ServiceEntry = {
  label: string;
  href: string;
  summary: string;
  group: ServiceGroup;
  // Precio y plazo de la oferta (offers.ts); solo si la página tiene oferta.
  price?: string;
  deadline?: string;
};

type ServiceSeed = Omit<ServiceEntry, "price" | "deadline">;

const planPrice = `Desde ${siteConfig.planPriceFrom} €/mes + IVA`;

const seeds: ServiceSeed[] = [
  { group: planGroup, label: "Mantenimiento informático para empresas", href: "/mantenimiento-informatico-toledo/", summary: `Mantenimiento de equipos, copias comprobadas, seguridad, cuentas y soporte en remoto.` },
  { group: planGroup, label: "Mantenimiento web y WordPress", href: "/mantenimiento-wordpress/", summary: `Hosting, actualizaciones, copias, seguridad, velocidad y pequeños cambios cada mes.` },
  { group: planGroup, label: "Plan de automatización e IA", href: "/plan-operaciones-ia/", summary: `Automatizaciones, integraciones y agentes de IA mantenidos y mejorados cada mes.` },
  { group: "Informática y seguridad", label: "Soporte informático para empresas", href: "/informatico-empresas-toledo/", summary: "Ordenadores, correo, red e impresoras que fallan: lo arreglo en remoto o voy a tu oficina." },
  { group: "Informática y seguridad", label: "Copias de seguridad para empresas", href: "/copias-seguridad-empresas/", summary: "Tus datos copiados fuera de la oficina y con una restauración probada de verdad." },
  { group: "Informática y seguridad", label: "Gestor de contraseñas para empresas", href: "/gestor-contrasenas-empresas/", summary: "Salir del Excel y del WhatsApp: contraseñas compartidas con seguridad y doble factor." },
  { group: "Informática y seguridad", label: "Auditoría de ciberseguridad para pymes", href: "/ciberseguridad-empresas-toledo/", summary: "Informe de qué le falta a tu empresa en seguridad y qué exigen el RGPD y la NIS2." },
  { group: "Informática y seguridad", label: "Google Workspace y correo con tu dominio", href: "/google-workspace-empresas-toledo/", summary: "Correo profesional, Drive compartido y permisos por persona, configurados y migrados." },
  { group: "Informática y seguridad", label: "Ordenar tu Google Drive", href: "/reestructuracion-google-drive/", summary: "Una estructura de carpetas y permisos clara para encontrar cualquier documento en segundos." },
  { group: "Web", label: "Creación de páginas web", href: "/diseno-web-toledo/", summary: "Tu web de empresa publicada, rápida, adaptada a móvil y preparada para recibir contactos." },
  { group: "Web", label: "Optimización de velocidad web", href: "/optimizacion-velocidad-web/", summary: "Mi web va lenta: la acelero sin rehacerla y te doy las cifras de antes y después. Análisis gratuito." },
  { group: "Web", label: "Landing page para campañas", href: "/landing-page-campanas/", summary: "Una página de venta con formulario y seguimiento automático para un producto o servicio." },
  { group: "Clientes y leads con IA", label: "Implantación de CRM para pymes", href: "/gestion-leads-crm/", summary: "Todos los contactos de web, WhatsApp y correo en un solo sitio, y ninguno sin respuesta." },
  { group: "Clientes y leads con IA", label: "Chatbot con IA para WhatsApp y web", href: "/agente-ia-atencion-cliente/", summary: "Responde las dudas frecuentes de tus clientes en tu web o WhatsApp y pasa a una persona lo difícil." },
  { group: "Clientes y leads con IA", label: "Asistente de IA con los documentos de tu empresa", href: "/asistente-ia-empresa/", summary: "Un chat que responde con los documentos de tu empresa, para que el equipo no pregunte siempre al dueño." },
  // Automatizar tareas: ejemplos reales con el detalle en /casos/.
  { group: "Automatizar tareas", label: "Automatizar facturas de proveedores", href: "/casos/entrada-facturas-automatica/", summary: "Las facturas entran solas en tu programa y una persona las valida. De una semana de revisión a una mañana." },
  { group: "Automatizar tareas", label: "Auditoría de gastos de proveedores", href: "/casos/conciliacion-proveedores/", summary: "Cruzo lo que te facturan con lo que tienes dado de alta para encontrar lo que pagas sin tener." },
  { group: "Automatizar tareas", label: "Migrar datos de un programa antiguo y cancelar la licencia", href: "/casos/dar-de-baja-software-historico/", summary: "Rescato los datos del programa que solo pagas por el histórico y los consultas con IA, sin licencia." },
  { group: "Automatizar tareas", label: "Consulta de cobertura con IA", href: "/casos/consulta-cobertura-ia/", summary: "Pregunta a la IA si una dirección tiene cobertura y a qué distancia está la más cercana." },
  { group: "Ordenar y conectar la empresa", label: "Diagnóstico en tu empresa", href: "/diagnostico-en-tu-empresa/", summary: "Visita de unas 2 horas: veo cómo trabajáis y te dejo una lista priorizada de qué arreglar primero. Se descuenta si contratas un proyecto." },
  { group: "Ordenar y conectar la empresa", label: "Diagnóstico de caos operativo", href: "/diagnostico-caos-operativo/", summary: "Auditoría de procesos para PyMEs que dependen demasiado del dueño." },
  { group: "Ordenar y conectar la empresa", label: "Caos operativo en telecomunicaciones", href: "/caos-operativo-telecomunicaciones/", summary: "Para operadores, ISPs e instaladores de hasta 50 personas: diseñar la operación como una cadena." },
  { group: "Ordenar y conectar la empresa", label: "Consultoría de procesos para pymes", href: "/diagnostico-digitalizacion/", summary: "Revisión de tus procesos y programas con un informe priorizado de qué cambiar y en qué orden." },
  { group: "Ordenar y conectar la empresa", label: "Asesoramiento de digitalización", href: "/consultor-digitalizacion-toledo/", summary: "Sesiones para decidir qué cambiar, en qué orden y con qué herramientas." },
  { group: "Ordenar y conectar la empresa", label: "Consultor ERP independiente: elegir o cambiar de ERP", href: "/consultoria-erp-pymes/", summary: "Entiende el ERP que ya tienes o elige uno sin volver a equivocarte." },
  { group: "Ordenar y conectar la empresa", label: "Conectar tus programas (n8n, Make, Zapier, Holded, A3)", href: "/integracion-sistemas/", summary: "CRM, ERP, facturación y correo intercambian datos solos, sin copiar y pegar." },
  { group: "Ordenar y conectar la empresa", label: "Software a medida para empresas", href: "/herramientas-internas-medida/", summary: "Paneles, portales y automatizaciones hechos para cómo trabaja tu equipo." },
];

export const serviceCatalog: ServiceEntry[] = seeds.map((seed) => {
  if (seed.group === planGroup) return { ...seed, price: planPrice };
  const offer = offerFor(seed.href);
  return offer ? { ...seed, price: priceLabel(offer), deadline: offer.deadline } : seed;
});

export const serviceLabelFor = (href: string) => serviceCatalog.find((service) => service.href === href)?.label;
