import type { ServiceEntry } from "@/data/services";
import { offerFor, priceLabel } from "@/data/offers";
import { siteConfig } from "@/config/site";

// Catálogo de la versión en inglés. Refleja el de services.ts pero solo con servicios que se prestan en remoto
// y que tienen página en inglés (soporte presencial, ciberseguridad/NIS2, diseño web local, ERP, telecom y casos
// prácticos no tienen versión EN todavía).
export const planGroupEn = "Monthly plans";
export const serviceGroupsEn = [planGroupEn, "IT & security", "Web", "Operations & processes", "AI & lead capture"] as const;
export const projectGroupsEn = serviceGroupsEn.filter((group) => group !== planGroupEn);

const planPriceFromEn = siteConfig.planPriceFrom;

export type ServiceEntryEn = Omit<ServiceEntry, "group"> & { group: (typeof serviceGroupsEn)[number] };

type ServiceSeed = Omit<ServiceEntryEn, "price" | "deadline">;

const seeds: ServiceSeed[] = [
  { group: planGroupEn, label: "Managed IT", href: "/managed-it-support/", summary: "Equipment maintenance, verified backups, security, accounts and remote support." },
  { group: planGroupEn, label: "Managed website", href: "/managed-website/", summary: "Hosting, updates, backups, security, speed and small changes every month." },
  { group: planGroupEn, label: "Operations & AI", href: "/operations-ai-plan/", summary: "Automations, integrations and AI agents maintained and improved every month." },
  { group: "IT & security", label: "Google Workspace setup and cleanup", href: "/google-workspace-reorganization/", summary: "Business email, users, groups and permissions set up so each person only accesses what they need." },
  { group: "IT & security", label: "Organize your Google Drive", href: "/corporate-google-drive-restructuring/", summary: "A clear folder and permission structure to find any document in seconds." },
  { group: "IT & security", label: "Password manager for your team", href: "/centralized-access-management/", summary: "Move off spreadsheets and chat apps: a password manager, two-factor and onboarding/offboarding procedures." },
  { group: "Web", label: "Speed up a slow website", href: "/website-speed-optimization/", summary: "My website is slow: I speed it up without rebuilding it and show you the before and after. Free website report included." },
  { group: "Web", label: "Landing page to sell your product", href: "/conversion-landing-pages/", summary: "A page focused on a single goal, with tracking, to turn campaign traffic into contacts." },
  { group: "Operations & processes", label: "Process audit with an action plan", href: "/digitalization-assessment/", summary: "A review of your processes and tools, with a prioritized report of what to change and in which order." },
  { group: "Operations & processes", label: "Automate repetitive tasks with AI", href: "/ai-process-automation/", summary: "Invoice entry, supplier checks and data lookups handled by AI, with a person confirming what matters." },
  { group: "Operations & processes", label: "Connect your software tools", href: "/systems-integration/", summary: "CRM, ERP, invoicing and email exchange data on their own, with no copy and paste." },
  { group: "Operations & processes", label: "Custom app for your team", href: "/custom-internal-tools/", summary: "Dashboards, portals and automations built for how your team works." },
  { group: "AI & lead capture", label: "Lead capture and follow-up system", href: "/lead-centralization/", summary: "All your prospects from web, WhatsApp and email in one place, and none left unanswered." },
  { group: "AI & lead capture", label: "AI agent for customer support", href: "/external-oracle/", summary: "Fast answers to common questions on your website or WhatsApp, with a handoff to a person." },
  { group: "AI & lead capture", label: "Internal AI oracle", href: "/internal-oracle/", summary: "A chat that answers with your company documents, so the team stops asking the owner." },
];

const planPriceEn = `From €${planPriceFromEn}/month + VAT`;

export const serviceCatalogEn: ServiceEntryEn[] = seeds.map((seed) => {
  if (seed.group === planGroupEn) return { ...seed, price: planPriceEn };
  const offer = offerFor(seed.href, "en");
  return offer ? { ...seed, price: priceLabel(offer, "en"), deadline: offer.deadline } : seed;
});
