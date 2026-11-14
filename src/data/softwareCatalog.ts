// Bloque «Qué desarrollo» (EN: «What I build») de las landings de software a medida (C04): /desarrollo-software-a-medida/ y
// /custom-software-development/. Sustituye a la antigua sección «Qué hago» (decisión de Pablo, 2026-11-14).
// Textos: «Microcopy v2» de la tarea 1 del tablero de Notion. Cada ítem es un desplegable (<details>) con 2-3 líneas y un ejemplo
// que dice qué problema resuelve (no un cliente ni un caso mostrable). Sin precios en el bloque.
//
// Medición: al ABRIR un ítem se envía `tipo_software_click` { tipo, idioma, landing } (evento secundario: no es evento clave).
// Los valores de `tipo` son los mismos en español y en inglés para poder sumarlos.

import type { Lang } from "@/data/campaigns";

export type SoftwareType =
  | "crm"
  | "gestion-erp"
  | "portales"
  | "web-apps"
  | "integraciones"
  | "paneles"
  | "automatizacion-ia"
  | "apps-moviles"
  | "modernizacion"
  | "bbdd-backoffice";

export interface SoftwareItem {
  tipo: SoftwareType;
  title: string;
  text: string;
  example: string;
  // Solo el ítem de automatización con IA enlaza a la landing de C05 (en el idioma de la página).
  link?: { href: string; label: string };
}

export interface SoftwareCatalog {
  eyebrow: string;
  title: string;
  intro: string;
  // Rótulo de cada desplegable, arriba a la derecha, junto a la flecha: dice qué pasa al pulsar.
  toggleLabel: string;
  exampleLabel: string;
  closing: string;
  items: SoftwareItem[];
}

export const softwareCatalog: Record<Lang, SoftwareCatalog> = {
  es: {
    eyebrow: "Qué desarrollo",
    title: "Qué desarrollo",
    intro: "18 años programando. Esto es lo que puedo construir para tu empresa. Pulsa «Qué es y ver ejemplo» en cada uno para ver para qué sirve.",
    toggleLabel: "Qué es y ver ejemplo",
    exampleLabel: "Ejemplo",
    closing: "¿No ves lo tuyo? Cuéntamelo en una llamada gratuita de 30 min.",
    items: [
      {
        tipo: "crm",
        title: "CRM a medida",
        text: "Un sistema para registrar clientes, oportunidades y seguimientos con los campos, estados y avisos de tu forma de vender, no los de una plantilla.",
        example: "saber qué presupuestos llevan una semana sin respuesta y recibir el aviso para llamar.",
      },
      {
        tipo: "gestion-erp",
        title: "Gestión interna y ERP ligero",
        text: "Una aplicación que reúne pedidos, inventario, proyectos o facturación en un solo sitio, con los procesos de tu empresa.",
        example: "ver el stock real al hacer un pedido, sin cruzar tres hojas de cálculo.",
      },
      {
        tipo: "portales",
        title: "Portales y áreas privadas",
        text: "Un acceso con usuario y contraseña donde tus clientes o proveedores consultan lo suyo.",
        example: "un cliente descarga sus facturas y ve el estado de su pedido sin escribirte.",
      },
      {
        tipo: "web-apps",
        title: "Webs y aplicaciones web a medida",
        text: "Desde una web con lógica propia hasta una tienda online o una herramienta que usa tu equipo desde el navegador.",
        example: "un configurador que calcula el presupuesto del cliente según lo que elige.",
      },
      {
        tipo: "integraciones",
        title: "Integraciones entre programas",
        text: "Conexiones para que tus programas intercambien datos solos, en vez de copiarlos a mano.",
        example: "cuando se emite una factura, se guarda en el CRM y se avisa por correo.",
      },
      {
        tipo: "paneles",
        title: "Paneles de control e informes",
        text: "Una pantalla con las cifras de tu negocio actualizadas, sacadas de tus propios datos.",
        example: "ventas del mes, cobros pendientes y horas por proyecto sin montar un Excel cada lunes.",
      },
      {
        tipo: "automatizacion-ia",
        title: "Automatización de procesos con IA",
        text: "Tareas repetitivas que hace un sistema que lee, clasifica o redacta, con una persona supervisando.",
        example: "las facturas que llegan por correo entran solas en tu contabilidad.",
        link: { href: "/automatizacion-procesos-ia/", label: "Ver automatización de procesos con IA" },
      },
      {
        tipo: "apps-moviles",
        title: "Aplicaciones móviles multiplataforma",
        text: "Una app para que tu equipo o tus clientes usen tu sistema desde el móvil.",
        example: "un técnico registra una visita con fotos desde la calle y llega a la oficina al momento.",
      },
      {
        tipo: "modernizacion",
        title: "Modernización de software antiguo",
        text: "Actualizar o sustituir un programa antiguo que aún funciona pero ya no se puede mantener.",
        example: "pasar una aplicación de escritorio vieja a la web, llevando sus datos a un sistema actual.",
      },
      {
        tipo: "bbdd-backoffice",
        title: "Bases de datos y backoffice",
        text: "La estructura donde se guarda la información y el panel de administración para gestionarla.",
        example: "un panel donde tu equipo da de alta productos, usuarios y tarifas sin tocar código.",
      },
    ],
  },
  en: {
    eyebrow: "What I build",
    title: "What I build",
    intro: "18 years building software. Here is what I can build for your business. Tap «What it is and an example» on each one to see what it is for.",
    toggleLabel: "What it is and an example",
    exampleLabel: "Example",
    closing: "Don't see yours? Tell me about it on a free 30-minute call.",
    items: [
      {
        tipo: "crm",
        title: "Custom CRM",
        text: "A system to track customers, deals and follow-ups with the fields, stages and alerts of how you actually sell, not a template's.",
        example: "see which quotes have had no reply for a week and get a reminder to call.",
      },
      {
        tipo: "gestion-erp",
        title: "Internal management tools and light ERP",
        text: "One application that brings orders, stock, projects or invoicing together around your company's processes.",
        example: "see real stock when taking an order, without cross-checking three spreadsheets.",
      },
      {
        tipo: "portales",
        title: "Client and supplier portals",
        text: "A login where your clients or suppliers see what is theirs.",
        example: "a client downloads their invoices and checks their order status without emailing you.",
      },
      {
        tipo: "web-apps",
        title: "Custom websites and web applications",
        text: "From a site with its own logic to an online store or a tool your team uses in the browser.",
        example: "a configurator that works out the client's quote from what they choose.",
      },
      {
        tipo: "integraciones",
        title: "Integrations between your tools",
        text: "Connections so your programs exchange data on their own instead of someone retyping it.",
        example: "when an invoice is issued, it is saved in the CRM and an email goes out.",
      },
      {
        tipo: "paneles",
        title: "Dashboards and reports",
        text: "One screen with your business numbers kept up to date from your own data.",
        example: "monthly sales, pending payments and hours per project, without building a spreadsheet every Monday.",
      },
      {
        tipo: "automatizacion-ia",
        title: "AI process automation",
        text: "Repetitive tasks handled by a system that reads, sorts or drafts, with a person supervising.",
        example: "invoices that arrive by email go into your accounting by themselves.",
        link: { href: "/ai-process-automation/", label: "See AI process automation" },
      },
      {
        tipo: "apps-moviles",
        title: "Cross-platform mobile apps",
        text: "An app so your team or your customers can use your system from a phone.",
        example: "a technician logs a visit with photos from the field and the office sees it straight away.",
      },
      {
        tipo: "modernizacion",
        title: "Legacy software modernisation",
        text: "Updating or replacing an old program that still works but can no longer be maintained.",
        example: "moving an old desktop application to the web, carrying its data into a current system.",
      },
      {
        tipo: "bbdd-backoffice",
        title: "Databases and back office",
        text: "The structure where information is stored and the admin panel to manage it.",
        example: "a panel where your team adds products, users and rates without touching code.",
      },
    ],
  },
};
