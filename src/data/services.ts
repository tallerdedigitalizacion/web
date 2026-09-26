// Catálogo único de servicios: alimenta el desplegable del formulario, el footer y llms.txt.
export type ServiceEntry = {
  label: string;
  href: string;
  summary: string;
  group: "Informática" | "Web" | "Procesos e IA";
};

export const serviceCatalog: ServiceEntry[] = [
  { group: "Informática", label: "Soporte informático", href: "/informatico-empresas-toledo/", summary: "Incidencias de ordenadores, correo, red e impresoras, en remoto o presencial." },
  { group: "Informática", label: "Mantenimiento informático", href: "/mantenimiento-informatico-toledo/", summary: "Revisiones periódicas, copias comprobadas y soporte con cuota mensual cerrada." },
  { group: "Informática", label: "Ciberseguridad y NIS2", href: "/ciberseguridad-empresas-toledo/", summary: "Auditoría, copias, protección de equipos, RGPD y adaptación a NIS2." },
  { group: "Informática", label: "Google Workspace y correo", href: "/google-workspace-empresas-toledo/", summary: "Correo con dominio propio, Drive compartido, permisos y migraciones." },
  { group: "Informática", label: "Reestructuración de Google Drive", href: "/reestructuracion-google-drive/", summary: "Una estructura de carpetas y permisos clara para encontrar cualquier documento en segundos." },
  { group: "Informática", label: "Gestión de contraseñas", href: "/gestor-contrasenas-empresas/", summary: "Salir del Excel y del WhatsApp: gestor de contraseñas y doble factor." },
  { group: "Web", label: "Diseño web que genera clientes", href: "/diseno-web-toledo/", summary: "Webs rápidas, pensadas para captar contactos y fáciles de mantener." },
  { group: "Web", label: "Rescate y mantenimiento de WordPress", href: "/mantenimiento-wordpress/", summary: "WordPress lento, hackeado o sin actualizar: revisión, limpieza y mantenimiento." },
  { group: "Web", label: "Optimización de velocidad web", href: "/optimizacion-velocidad-web/", summary: "Acelerar la web sin rehacerla, verificado con Core Web Vitals." },
  { group: "Web", label: "Informe gratuito de tu web", href: "/informe-gratuito-web/", summary: "Autoauditoría gratuita de velocidad, SEO básico, seguridad y captación de contactos." },
  { group: "Web", label: "Funnel web para un producto", href: "/funnel-web/", summary: "Página de venta, captación y seguimiento automático para un producto o servicio." },
  { group: "Procesos e IA", label: "Diagnóstico de caos operativo", href: "/diagnostico-caos-operativo/", summary: "Auditoría de procesos para PyMEs que dependen demasiado del dueño." },
  { group: "Procesos e IA", label: "Diagnóstico de digitalización", href: "/diagnostico-digitalizacion/", summary: "Auditoría técnica y funcional de procesos con informe priorizado y plan de acción." },
  { group: "Procesos e IA", label: "Consultoría de digitalización", href: "/consultor-digitalizacion-toledo/", summary: "Qué cambiar, en qué orden y con qué herramientas." },
  { group: "Procesos e IA", label: "ERP y software de gestión", href: "/consultoria-erp-pymes/", summary: "Entender, ordenar o elegir el ERP sin volver a equivocarse." },
  { group: "Procesos e IA", label: "Integración de sistemas", href: "/integracion-sistemas/", summary: "Conectar CRM, ERP, facturación y correo para eliminar tareas manuales." },
  { group: "Procesos e IA", label: "Herramientas internas a medida", href: "/herramientas-internas-medida/", summary: "Paneles, portales y automatizaciones hechos para cómo trabaja tu equipo." },
  { group: "Procesos e IA", label: "Captación y seguimiento de leads", href: "/gestion-leads-crm/", summary: "Que ningún contacto se quede sin respuesta: CRM y automatizaciones." },
  { group: "Procesos e IA", label: "Agente de IA para atención al cliente", href: "/agente-ia-atencion-cliente/", summary: "Respuestas rápidas a dudas frecuentes, con traspaso a una persona." },
  { group: "Procesos e IA", label: "Asistente de IA con el conocimiento de la empresa", href: "/asistente-ia-empresa/", summary: "Que el equipo consulte procedimientos sin preguntar siempre al dueño." },
];

export const serviceLabels = [...serviceCatalog.map((service) => service.label), "Otro"];

export const serviceLabelFor = (href: string) => serviceCatalog.find((service) => service.href === href)?.label;
