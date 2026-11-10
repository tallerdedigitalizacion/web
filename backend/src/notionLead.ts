import type { ContactLeadInput, DiagnosticLeadInput, MethodLeadInput, ResourceLeadInput, SelfAssessmentLeadInput, WebAuditGuideLeadInput, WebAuditLeadInput } from "./schemas";
import type { NotionChannel, NotionLead } from "./notion";

export type LeadAction = "diagnostic" | "method" | "web-audit" | "web-audit-guide" | "resource" | "contact" | "self-assessment";

export type LeadInput =
  | DiagnosticLeadInput
  | MethodLeadInput
  | WebAuditLeadInput
  | WebAuditGuideLeadInput
  | ResourceLeadInput
  | ContactLeadInput
  | SelfAssessmentLeadInput;

// Contacto y autoevaluaciones son formularios web; las descargas y la autoauditoría web son lead magnets.
const channels: Record<LeadAction, NotionChannel> = {
  contact: "Formulario web",
  diagnostic: "Formulario web",
  "self-assessment": "Formulario web",
  method: "Lead magnet",
  "web-audit": "Lead magnet",
  "web-audit-guide": "Lead magnet",
  resource: "Lead magnet",
};

// Solo datos que ya figuran en el email de aviso del lead.
function describeNeed(action: LeadAction, input: LeadInput) {
  switch (action) {
    case "contact": {
      const contact = input as ContactLeadInput;
      return `${contact.service}: ${contact.message}`;
    }
    case "diagnostic":
      return "Diagnóstico de digitalización";
    case "method":
      return "Descarga: método de auditoría del caos operativo";
    case "web-audit":
      return `Autoauditoría web (puntuación ${(input as WebAuditLeadInput).score.total}/100)`;
    case "web-audit-guide":
      return "Descarga: guía de auditoría web";
    case "resource":
      return `Recurso: ${(input as ResourceLeadInput).resourceType}`;
    case "self-assessment": {
      const assessment = input as SelfAssessmentLeadInput;
      return `Autoevaluación ${assessment.assessmentId} (puntaje ${assessment.score}/100, riesgo ${assessment.level})`;
    }
  }
}

export function notionLeadFromInput(action: LeadAction, input: LeadInput): NotionLead {
  return {
    action,
    name: input.name,
    email: input.email,
    phone: action === "contact" ? (input as ContactLeadInput).phone : undefined,
    need: describeNeed(action, input),
    channel: channels[action],
    attribution: input.attribution,
  };
}
