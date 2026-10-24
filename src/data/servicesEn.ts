import type { ServiceEntry } from "@/data/services";

// Catálogo de la versión en inglés. Refleja el de services.ts pero solo con servicios que se prestan en remoto
// y que tienen página en inglés (soporte presencial, ciberseguridad/NIS2, diseño web local, ERP, telecom y casos
// prácticos no tienen versión EN todavía).
export const planGroupEn = "Monthly plans";
export const serviceGroupsEn = [planGroupEn, "IT & security", "Web", "Operations & processes", "AI & lead capture"] as const;
export const projectGroupsEn = serviceGroupsEn.filter((group) => group !== planGroupEn);

export type ServiceEntryEn = Omit<ServiceEntry, "group"> & { group: (typeof serviceGroupsEn)[number] };

export const serviceCatalogEn: ServiceEntryEn[] = [
  { group: planGroupEn, label: "Managed IT", href: "/managed-it-support/", summary: "Equipment maintenance, verified backups, security, accounts and remote support." },
  { group: planGroupEn, label: "Managed website", href: "/managed-website/", summary: "Hosting, updates, backups, security, speed and small changes every month." },
  { group: planGroupEn, label: "Operations & AI", href: "/operations-ai-plan/", summary: "Automations, integrations and AI agents maintained and improved every month." },
  { group: "IT & security", label: "Google Workspace reorganization", href: "/google-workspace-reorganization/", summary: "Users, licenses, groups and permissions organized so each person only accesses what they need." },
  { group: "IT & security", label: "Google Drive restructuring", href: "/corporate-google-drive-restructuring/", summary: "A clear folder and permission structure to find any document in seconds." },
  { group: "IT & security", label: "Password management", href: "/centralized-access-management/", summary: "Move off spreadsheets and chat apps: a password manager and onboarding/offboarding procedures." },
  { group: "Web", label: "Website speed optimization", href: "/website-speed-optimization/", summary: "Speed up your site without rebuilding it, verified with Core Web Vitals." },
  { group: "Web", label: "Free website report", href: "/free-website-report/", summary: "A free self-audit of speed, basic SEO, security and lead capture." },
  { group: "Web", label: "Conversion landing pages", href: "/conversion-landing-pages/", summary: "Pages focused on a single goal to turn campaign traffic into contacts." },
  { group: "Operations & processes", label: "Digitalization assessment", href: "/digitalization-assessment/", summary: "A technical and functional audit of your processes, with a prioritized report and action plan." },
  { group: "Operations & processes", label: "AI process automation", href: "/ai-process-automation/", summary: "Automate repetitive processes with AI: invoice entry, supplier reconciliation and data lookups, with a person confirming what matters." },
  { group: "Operations & processes", label: "Systems integration", href: "/systems-integration/", summary: "Connect your CRM, ERP, invoicing and email to eliminate manual tasks." },
  { group: "Operations & processes", label: "Custom internal tools", href: "/custom-internal-tools/", summary: "Dashboards, portals and automations built for how your team works." },
  { group: "AI & lead capture", label: "Lead centralization", href: "/lead-centralization/", summary: "No contact left unanswered: all your prospects in one place, tracked in your CRM." },
  { group: "AI & lead capture", label: "AI agent for customer support", href: "/external-oracle/", summary: "Fast answers to common questions, with a handoff to a person." },
  { group: "AI & lead capture", label: "AI assistant with company knowledge", href: "/internal-oracle/", summary: "Let the team look up procedures without always asking the owner." },
];
