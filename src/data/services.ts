import { siteConfig } from "@/config/site";

// Catálogo único de servicios: alimenta la portada, el desplegable del formulario, el footer y llms.txt.
// "Planes mensuales" son los servicios recurrentes; el resto de grupos son proyectos con precio cerrado.
export const planGroup = "Planes mensuales";
export const serviceGroups = [planGroup, "Informática y seguridad", "Web", "Operaciones y procesos", "IA y captación"] as const;
export const projectGroups = serviceGroups.filter((group) => group !== planGroup);
export type ServiceGroup = (typeof serviceGroups)[number];

export type ServiceEntry = {
  label: string;
  href: string;
  summary: string;
  group: ServiceGroup;
};

export const serviceCatalog: ServiceEntry[] = [
  { group: planGroup, label: "Informática gestionada", href: "/mantenimiento-informatico-toledo/", summary: `Mantenimiento de equipos, copias comprobadas, seguridad, cuentas y soporte en remoto.` },
  { group: planGroup, label: "Web gestionada", href: "/mantenimiento-wordpress/", summary: `Hosting, actualizaciones, copias, seguridad, velocidad y pequeños cambios cada mes.` },
  { group: planGroup, label: "Operaciones e IA", href: "/plan-operaciones-ia/", summary: `Automatizaciones, integraciones y agentes de IA mantenidos y mejorados cada mes.` },
  { group: "Informática y seguridad", label: "Soporte informático", href: "/informatico-empresas-toledo/", summary: "Incidencias puntuales de ordenadores, correo, red e impresoras, en remoto o presencial." },
  { group: "Informática y seguridad", label: "Ciberseguridad y NIS2", href: "/ciberseguridad-empresas-toledo/", summary: "Auditoría, copias, protección de equipos, RGPD y adaptación a NIS2." },
  { group: "Informática y seguridad", label: "Google Workspace y correo", href: "/google-workspace-empresas-toledo/", summary: "Correo con dominio propio, Drive compartido, permisos y migraciones." },
  { group: "Informática y seguridad", label: "Reestructuración de Google Drive", href: "/reestructuracion-google-drive/", summary: "Una estructura de carpetas y permisos clara para encontrar cualquier documento en segundos." },
  { group: "Informática y seguridad", label: "Gestión de contraseñas", href: "/gestor-contrasenas-empresas/", summary: "Salir del Excel y del WhatsApp: gestor de contraseñas y doble factor." },
  { group: "Web", label: "Diseño web que genera clientes", href: "/diseno-web-toledo/", summary: "Webs rápidas, pensadas para captar contactos y fáciles de mantener." },
  { group: "Web", label: "Optimización de velocidad web", href: "/optimizacion-velocidad-web/", summary: "Acelerar la web sin rehacerla, verificado con Core Web Vitals." },
  { group: "Web", label: "Informe gratuito de tu web", href: "/informe-gratuito-web/", summary: "Autoauditoría gratuita de velocidad, SEO básico, seguridad y captación de contactos." },
  { group: "Web", label: "Funnel web para un producto", href: "/funnel-web/", summary: "Página de venta, captación y seguimiento automático para un producto o servicio." },
  { group: "Operaciones y procesos", label: "Diagnóstico de caos operativo", href: "/diagnostico-caos-operativo/", summary: "Auditoría de procesos para PyMEs que dependen demasiado del dueño." },
  { group: "Operaciones y procesos", label: "Caos operativo en telecomunicaciones", href: "/caos-operativo-telecomunicaciones/", summary: "Para operadores, ISPs e instaladores de hasta 50 personas: diseñar la operación como una cadena." },
  { group: "Operaciones y procesos", label: "Diagnóstico de digitalización", href: "/diagnostico-digitalizacion/", summary: "Auditoría técnica y funcional de procesos con informe priorizado y plan de acción." },
  { group: "Operaciones y procesos", label: "Consultoría de digitalización", href: "/consultor-digitalizacion-toledo/", summary: "Qué cambiar, en qué orden y con qué herramientas." },
  { group: "Operaciones y procesos", label: "ERP y software de gestión", href: "/consultoria-erp-pymes/", summary: "Entender, ordenar o elegir el ERP sin volver a equivocarse." },
  { group: "Operaciones y procesos", label: "Integración de sistemas", href: "/integracion-sistemas/", summary: "Conectar CRM, ERP, facturación y correo para eliminar tareas manuales." },
  { group: "Operaciones y procesos", label: "Herramientas internas a medida", href: "/herramientas-internas-medida/", summary: "Paneles, portales y automatizaciones hechos para cómo trabaja tu equipo." },
  { group: "IA y captación", label: "Captación y seguimiento de leads", href: "/gestion-leads-crm/", summary: "Que ningún contacto se quede sin respuesta: CRM y automatizaciones." },
  { group: "IA y captación", label: "Agente de IA para atención al cliente", href: "/agente-ia-atencion-cliente/", summary: "Respuestas rápidas a dudas frecuentes, con traspaso a una persona." },
  { group: "IA y captación", label: "Asistente de IA con el conocimiento de la empresa", href: "/asistente-ia-empresa/", summary: "Que el equipo consulte procedimientos sin preguntar siempre al dueño." },
];

export const serviceLabelFor = (href: string) => serviceCatalog.find((service) => service.href === href)?.label;
