import type { ContactLeadInput, DiagnosticLeadInput, MethodLeadInput, ProcessQuizLeadInput, ResourceLeadInput, SelfAssessmentLeadInput, WebAuditGuideLeadInput, WebAuditLeadInput } from "./schemas";
import type { NotionBodyBlock, NotionChannel, NotionLead } from "./notion";
import { quizQuestions, quizResult, type QuizAnswers } from "../../src/data/processQuiz";

export type LeadAction = "diagnostic" | "method" | "web-audit" | "web-audit-guide" | "resource" | "contact" | "self-assessment" | "process-quiz";

export type LeadInput =
  | DiagnosticLeadInput
  | MethodLeadInput
  | WebAuditLeadInput
  | WebAuditGuideLeadInput
  | ResourceLeadInput
  | ContactLeadInput
  | SelfAssessmentLeadInput
  | ProcessQuizLeadInput;

// Contacto y autoevaluaciones son formularios web; las descargas y la autoauditoría web son lead magnets.
const channels: Record<LeadAction, NotionChannel> = {
  contact: "Formulario web",
  diagnostic: "Formulario web",
  "self-assessment": "Formulario web",
  "process-quiz": "Lead magnet",
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
    case "process-quiz": {
      const quiz = input as ProcessQuizLeadInput;
      const result = quizResult(quiz.answers as QuizAnswers, "es");
      return `Minicurso C05 tras el cuestionario «¿Dónde estás tú?» (${quiz.language.toUpperCase()}): punto de partida ${result.code} · mini-curso: ${quiz.courseSubscription ? "sí" : "no"}`;
    }
    case "self-assessment": {
      const assessment = input as SelfAssessmentLeadInput;
      return `Autoevaluación ${assessment.assessmentId} (puntaje ${assessment.score}/100, riesgo ${assessment.level})`;
    }
  }
}

// Cuerpo de la página del cuestionario C05: idioma, campaña, punto de partida, respuestas (siempre en español, para que Pablo
// llame con contexto) y suscripción al mini-curso. Sin cambiar el esquema de la base.
export function processQuizBody(input: ProcessQuizLeadInput): NotionBodyBlock[] {
  const answers = input.answers as QuizAnswers;
  const result = quizResult(answers, "es");
  const labelOf = (question: (typeof quizQuestions)[number], value: string) => question.options.find((option) => option.value === value)?.label.es ?? value;
  const rows: NotionBodyBlock[] = [
    { type: "heading_3", text: "Cuestionario «¿Dónde estás tú?» · Campaña C05" },
    { type: "paragraph", text: `Idioma: ${input.language === "en" ? "inglés (EN)" : "español (ES)"}` },
    { type: "paragraph", text: `Punto de partida: ${result.code} · ${result.title}` },
    { type: "paragraph", text: `Suscrito al mini-curso: ${input.courseSubscription ? "SÍ (formulario del minicurso)" : "no"}` },
    { type: "heading_3", text: "Respuestas" },
  ];
  for (const question of quizQuestions) {
    const values = question.key === "situaciones" ? result.situations : [answers[question.key]];
    const text = values.length > 0 ? values.map((value) => `${labelOf(question, value)} (${value})`).join("; ") : "Ninguna (ninguna)";
    rows.push({ type: "bulleted_list_item", text: `${question.title.es} → ${text}` });
  }
  return rows;
}

export function notionLeadFromInput(action: LeadAction, input: LeadInput): NotionLead {
  return {
    body: action === "process-quiz" ? processQuizBody(input as ProcessQuizLeadInput) : undefined,
    action,
    name: input.name,
    email: input.email,
    phone: action === "contact" ? (input as ContactLeadInput).phone : undefined,
    need: describeNeed(action, input),
    channel: channels[action],
    attribution: input.attribution,
  };
}
