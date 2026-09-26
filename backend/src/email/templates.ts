import { assessmentAreas } from "../assessment";
import type { ContactLeadInput, DiagnosticLeadInput, MethodLeadInput } from "../schemas";
import type { scoreAssessment } from "../assessment";

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

export function contactEmail(input: ContactLeadInput, bookingUrl: string) {
  return {
    subject: `Hemos recibido tu consulta: ${input.service}`,
    text: [
      `Hola ${input.name},`,
      "",
      `Gracias por escribir. He recibido tu consulta sobre "${input.service}" y te responderé lo antes posible en horario de lunes a viernes de 10:00 a 16:00.`,
      "",
      "Tu mensaje:",
      input.message,
      "",
      `Si prefieres, puedes reservar directamente una llamada gratuita de 30 minutos: ${bookingUrl}`,
      "",
      "Pablo Leone · Taller de Digitalización",
    ].join("\n"),
    html: `
      <p>Hola ${escapeHtml(input.name)},</p>
      <p>Gracias por escribir. He recibido tu consulta sobre <strong>${escapeHtml(input.service)}</strong> y te responderé lo antes posible en horario de lunes a viernes de 10:00 a 16:00.</p>
      <p><strong>Tu mensaje:</strong></p>
      <blockquote>${escapeHtml(input.message).replace(/\n/g, "<br />")}</blockquote>
      <p>Si prefieres, puedes <a href="${bookingUrl}">reservar directamente una llamada gratuita de 30 minutos</a>.</p>
      <p>Pablo Leone · Taller de Digitalización</p>
    `,
  };
}

const actionLabels = { diagnostic: "diagnóstico", method: "método", contact: "contacto" } as const;

export function notificationEmail(
  action: keyof typeof actionLabels,
  input: DiagnosticLeadInput | MethodLeadInput | ContactLeadInput,
  extra = "",
) {
  const contact = "service" in input ? input : undefined;
  return {
    subject: `Nuevo lead: ${contact ? contact.service : actionLabels[action]} - ${input.email}`,
    text: [
      `Acción: ${action}`,
      `Nombre: ${input.name}`,
      `Email: ${input.email}`,
      `Empresa: ${input.company || "-"}`,
      `Cargo: ${input.role || "-"}`,
      `Marketing: ${input.marketingAccepted ? "sí" : "no"}`,
      ...(contact ? [`Servicio: ${contact.service}`, `Teléfono: ${contact.phone || "-"}`, `Página: ${contact.pageUrl || "-"}`, "", contact.message] : []),
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
        ${
          contact
            ? `<li><strong>Servicio:</strong> ${escapeHtml(contact.service)}</li>
        <li><strong>Teléfono:</strong> ${escapeHtml(contact.phone || "-")}</li>
        <li><strong>Página:</strong> ${escapeHtml(contact.pageUrl || "-")}</li>`
            : ""
        }
      </ul>
      ${contact ? `<p>${escapeHtml(contact.message).replace(/\n/g, "<br />")}</p>` : ""}
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
