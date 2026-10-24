import type { ServiceEntry } from "@/data/services";
import { offerFor, priceLabel } from "@/data/offers";

// Catálogo de la versión en inglés. Se centra en automatización, integraciones, IA, CRM y herramientas a medida, que es lo
// que se vende en remoto a Estados Unidos. Los planes mensuales de soporte y web (managed-it-support, managed-website,
// operations-ai-plan) siguen publicados, pero ya no salen en la portada ni en el catálogo inglés. Precios en USD sin impuestos.
export const serviceGroupsEn = ["Automation & AI", "Operations & processes", "Web", "IT & security"] as const;
export const projectGroupsEn = serviceGroupsEn;

export type ServiceEntryEn = Omit<ServiceEntry, "group"> & { group: (typeof serviceGroupsEn)[number] };

type ServiceSeed = Omit<ServiceEntryEn, "price" | "deadline">;

const seeds: ServiceSeed[] = [
  { group: "Automation & AI", label: "Automation Sprint: automate repetitive tasks with AI", href: "/ai-process-automation/", summary: "Invoice entry, supplier checks and data lookups handled by AI, with a person confirming what matters." },
  { group: "Automation & AI", label: "CRM implementation for small business", href: "/crm-implementation/", summary: "Website forms, WhatsApp and email in one CRM, and no prospect left unanswered." },
  { group: "Automation & AI", label: "AI chatbot for small business", href: "/ai-chatbot-small-business/", summary: "Fast answers to common questions on your website or WhatsApp, with a handoff to a person." },
  { group: "Automation & AI", label: "AI knowledge base for your company documents", href: "/ai-knowledge-base/", summary: "A chat that answers with your company documents, so the team stops asking the owner." },
  { group: "Operations & processes", label: "Operations audit with an action plan", href: "/digitalization-assessment/", summary: "A review of your processes and tools, with a prioritized report of what to change and in which order." },
  { group: "Operations & processes", label: "Zapier, Make and n8n integrations", href: "/systems-integration/", summary: "CRM, ERP, invoicing and email exchange data on their own, with no copy and paste." },
  { group: "Operations & processes", label: "Custom internal tools: replace your spreadsheets", href: "/custom-internal-tools/", summary: "Dashboards, portals and automations built for how your team works." },
  { group: "Web", label: "Website speed optimization", href: "/website-speed-optimization/", summary: "My website is slow: I speed it up without rebuilding it and show you the before and after. Free website report included." },
  { group: "Web", label: "Landing page design for ad campaigns", href: "/conversion-landing-pages/", summary: "A page focused on a single goal, with tracking, to turn campaign traffic into contacts." },
  { group: "IT & security", label: "Google Workspace setup & migration", href: "/google-workspace-reorganization/", summary: "Business email, users, groups and permissions set up so each person only accesses what they need." },
  { group: "IT & security", label: "Organize your Google Drive", href: "/corporate-google-drive-restructuring/", summary: "A clear folder and permission structure to find any document in seconds." },
  { group: "IT & security", label: "Business password manager setup", href: "/business-password-manager-setup/", summary: "Move off spreadsheets and chat apps: a password manager, two-factor and onboarding/offboarding procedures." },
];

export const serviceCatalogEn: ServiceEntryEn[] = seeds.map((seed) => {
  const offer = offerFor(seed.href, "en");
  return offer ? { ...seed, price: priceLabel(offer, "en"), deadline: offer.deadline } : seed;
});
