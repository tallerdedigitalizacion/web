import { assessmentAreas } from "../assessment";
import type { DiagnosticLeadInput, MethodLeadInput, WebsiteReportLeadInput } from "../schemas";
import type { scoreAssessment } from "../assessment";
import type { WebsiteReport } from "../websiteAnalysis";

type DiagnosticScore = ReturnType<typeof scoreAssessment>;

export function diagnosticEmail(input: DiagnosticLeadInput, score: DiagnosticScore) {
  const rows = score.areaScores
    .map((value, index) => `<tr><td>${escapeHtml(assessmentAreas[index])}</td><td>${value}/9</td></tr>`)
    .join("");
  const weak = score.weakAreas.map((area) => `<li>${escapeHtml(area.name)}: <strong>${area.score}/9</strong></li>`).join("");

  return {
    subject: `Tu diagnóstico inicial de Caos Operativo - ${input.company || "Taller de Digitalización"}`,
    text: [
      `Hola ${input.name},`,
      "",
      `Score total: ${score.total}/81 (${score.percent}%).`,
      score.interpretation.title,
      score.interpretation.text,
      "",
      "Tres áreas más débiles:",
      score.weakAreas.map((area) => `- ${area.name}: ${area.score}/9`).join("\n"),
      "",
      "Esta autoevaluación no sustituye un diagnóstico completo. Sirve para detectar dónde puede haber caos operativo.",
    ].join("\n"),
    html: `
      <h1>Diagnóstico inicial de Caos Operativo</h1>
      <p>Hola ${escapeHtml(input.name)},</p>
      <p><strong>Score total:</strong> ${score.total}/81 (${score.percent}%).</p>
      <h2>${escapeHtml(score.interpretation.title)}</h2>
      <p>${escapeHtml(score.interpretation.text)}</p>
      <h3>Puntuación por área</h3>
      <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;border-color:#d8ddd9;">
        <thead><tr><th align="left">Área</th><th align="left">Puntuación</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <h3>3 áreas más débiles</h3>
      <ol>${weak}</ol>
      <p><strong>Recomendación general:</strong> revisar primero las áreas con menor puntuación, detectar dependencias críticas, ordenar responsabilidades y priorizar cambios que reduzcan fricción antes de añadir más herramientas o personas.</p>
      <p>Esta autoevaluación no sustituye un diagnóstico completo. Sirve para darte una primera lectura.</p>
    `,
  };
}

export function methodEmail(input: MethodLeadInput, siteUrl: string) {
  return {
    subject: "Método de auditoría de Caos Operativo",
    text: [
      `Hola ${input.name},`,
      "",
      "Adjunto encontrarás el método resumido de auditoría de Caos Operativo.",
      `También puedes revisar la web en ${siteUrl}.`,
    ].join("\n"),
    html: `
      <h1>Método de auditoría de Caos Operativo</h1>
      <p>Hola ${escapeHtml(input.name)},</p>
      <p>Adjunto encontrarás el método resumido de auditoría de Caos Operativo.</p>
      <p>Si quieres revisar tu caso con contexto, puedes reservar una llamada desde la web.</p>
      <p><a href="${siteUrl}">${siteUrl}</a></p>
    `,
  };
}

export function notificationEmail(action: "diagnostic" | "method", input: DiagnosticLeadInput | MethodLeadInput, extra = "") {
  return {
    subject: `Nuevo lead: ${action === "diagnostic" ? "diagnóstico" : "método"} - ${input.email}`,
    text: [
      `Acción: ${action}`,
      `Nombre: ${input.name}`,
      `Email: ${input.email}`,
      `Empresa: ${input.company || "-"}`,
      `Cargo: ${input.role || "-"}`,
      `Marketing: ${input.marketingAccepted ? "sí" : "no"}`,
      extra,
    ].join("\n"),
    html: `
      <h1>Nuevo lead</h1>
      <ul>
        <li><strong>Acción:</strong> ${action}</li>
        <li><strong>Nombre:</strong> ${escapeHtml(input.name)}</li>
        <li><strong>Email:</strong> ${escapeHtml(input.email)}</li>
        <li><strong>Empresa:</strong> ${escapeHtml(input.company || "-")}</li>
        <li><strong>Cargo:</strong> ${escapeHtml(input.role || "-")}</li>
        <li><strong>Marketing:</strong> ${input.marketingAccepted ? "sí" : "no"}</li>
      </ul>
      ${extra ? `<pre>${escapeHtml(extra)}</pre>` : ""}
    `,
  };
}

export function websiteReportEmail(input: WebsiteReportLeadInput, report: WebsiteReport) {
  const findingsList = report.findings.map((finding) => `<li>${escapeHtml(finding)}</li>`).join("");
  const scoreRow = (label: string, value: number | null | undefined) =>
    value === null || value === undefined ? "" : `<tr><td>${label}</td><td>${value}/100</td></tr>`;
  const scoresTable = report.pageSpeed
    ? `<table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;border-color:#d8ddd9;">
        <thead><tr><th align="left">Indicador</th><th align="left">Puntuación</th></tr></thead>
        <tbody>
          ${scoreRow("Rendimiento (móvil)", report.pageSpeed.performance)}
          ${scoreRow("SEO técnico", report.pageSpeed.seo)}
          ${scoreRow("Buenas prácticas", report.pageSpeed.bestPractices)}
        </tbody>
      </table>`
    : "";

  return {
    subject: `Tu informe gratuito de ${input.url}`,
    text: [
      `Hola,`,
      "",
      `Este es el informe automático de ${report.url}.`,
      "",
      "Principales hallazgos:",
      report.findings.map((finding) => `- ${finding}`).join("\n"),
      "",
      "Este informe se basa en indicadores automáticos y es una primera lectura, no un diagnóstico completo.",
    ].join("\n"),
    html: `
      <h1>Informe Gratuito de tu Página Web</h1>
      <p>Este es el análisis automático de <strong>${escapeHtml(report.url)}</strong>.</p>
      ${scoresTable}
      <h3>Principales hallazgos</h3>
      <ol>${findingsList}</ol>
      <p>Este informe se basa en indicadores automáticos y sirve como primera lectura. Si quieres un análisis más a fondo, con recomendaciones priorizadas y un plan de acción, puedes reservar una llamada.</p>
    `,
  };
}

export function websiteReportNotificationEmail(input: WebsiteReportLeadInput, report: WebsiteReport, extra = "") {
  return {
    subject: `Nuevo lead: informe web - ${input.email}`,
    text: [`Acción: website-report`, `URL analizada: ${report.url}`, `Email: ${input.email}`, extra].join("\n"),
    html: `
      <h1>Nuevo lead: informe web</h1>
      <ul>
        <li><strong>URL analizada:</strong> ${escapeHtml(report.url)}</li>
        <li><strong>Email:</strong> ${escapeHtml(input.email)}</li>
      </ul>
      ${extra ? `<pre>${escapeHtml(extra)}</pre>` : ""}
    `,
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
