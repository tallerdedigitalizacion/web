import { assessmentAreas } from "../assessment";
import type { DiagnosticLeadInput, MethodLeadInput, WebAuditGuideLeadInput, WebAuditLeadInput } from "../schemas";
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

export function webAuditEmail(input: WebAuditLeadInput, bookingUrl: string) {
  const areaRows = input.score.areaScores
    .map((area) => `<tr><td>${escapeHtml(area.name)}</td><td>${Math.round((area.raw / area.maxRaw) * 100)}%</td><td>${area.weight}</td></tr>`)
    .join("");

  return {
    subject: `Tu autoauditoría web - ${input.company || "Taller de Digitalización"}`,
    text: [
      `Hola ${input.name},`,
      "",
      `Score básico: ${input.score.total}/100.`,
      `Resultado: ${input.score.range}.`,
      `Web analizada: ${input.siteUrl}`,
      "",
      "Tu reporte detallado está en camino. Esta autoauditoría no sustituye la Auditoría Web Técnica completa, pero ayuda a detectar señales de fuga.",
      "",
      `Puedes reservar una llamada aquí: ${bookingUrl}`,
    ].join("\n"),
    html: `
      <h1>Autoauditoría web</h1>
      <p>Hola ${escapeHtml(input.name)},</p>
      <p><strong>Score básico:</strong> ${input.score.total}/100.</p>
      <p><strong>Resultado:</strong> ${escapeHtml(input.score.range)}.</p>
      <p><strong>Web analizada:</strong> <a href="${escapeHtml(input.siteUrl)}">${escapeHtml(input.siteUrl)}</a></p>
      <h2>Puntuación por área</h2>
      <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;border-color:#d8ddd9;">
        <thead><tr><th align="left">Área</th><th align="left">Score</th><th align="left">Peso</th></tr></thead>
        <tbody>${areaRows}</tbody>
      </table>
      <p>Tu reporte detallado está en camino. Esta autoauditoría no sustituye la Auditoría Web Técnica completa, pero ayuda a detectar señales de fuga.</p>
      <p><a href="${bookingUrl}">Reservar llamada de 15 minutos</a></p>
    `,
  };
}

export function webAuditGuideEmail(input: WebAuditGuideLeadInput, siteUrl: string, bookingUrl: string) {
  const isEnglish = input.language === "en";
  const serviceUrl = `${siteUrl.replace(/\/$/, "")}${isEnglish ? "/free-website-report/" : "/informe-gratuito-web/"}`;
  const copy = webAuditGuideCopy(input.name, serviceUrl, bookingUrl, isEnglish);

  if (input.language === "en") {
    return {
      subject: "What a Technical Web Audit includes",
      text: [
        `Hi ${input.name},`,
        "",
        "In this email you will find an attached executive overview of what the Technical Web Audit includes, either for you to review or to share with your team.",
        "",
        "The audit helps you understand where the website may be losing leads, creating technical friction or exposing operational risk before deciding whether to redesign, rebuild or fix specific issues.",
        "",
        copy.points.map((point) => `- ${point.title}: ${point.text}`).join("\n"),
        "",
        `You can learn more here: ${serviceUrl}`,
        `If you want to talk about your particular case, you can book a call here: ${bookingUrl}`,
        "",
        "Best,",
        "Pablo Leone",
        "Web Infrastructure & WordPress Care",
        "info@tallerdedigitalizacion.com",
      ].join("\n"),
      html: buildWebAuditGuideHtml(copy),
    };
  }

  return {
    subject: "Qué incluye una Auditoría Web Técnica",
    text: [
      `Hola ${input.name},`,
      "",
      "En este email encontrarás adjunto un documento con el informe ejecutivo de lo que incluye la Auditoría Web Técnica, para ti o para compartir con tu equipo.",
      "",
      "La auditoría sirve para entender dónde puede estar perdiendo oportunidades tu web, qué fricción técnica existe y qué riesgos conviene revisar antes de decidir si rediseñar, reconstruir o corregir puntos concretos.",
      "",
      copy.points.map((point) => `- ${point.title}: ${point.text}`).join("\n"),
      "",
      `Para ampliar información puedes acceder a la web aquí: ${serviceUrl}`,
      `Si estás interesado y quieres hablar de tu caso particular, puedes reservar una llamada aquí: ${bookingUrl}`,
      "",
      "Un saludo,",
      "Pablo Leone",
      "Web Infrastructure & WordPress Care",
      "info@tallerdedigitalizacion.com",
    ].join("\n"),
    html: buildWebAuditGuideHtml(copy),
  };
}

function webAuditGuideCopy(name: string, serviceUrl: string, bookingUrl: string, isEnglish: boolean) {
  if (isEnglish) {
    return {
      lang: "en",
      title: "What a Technical Web Audit includes",
      preheader: "Executive overview attached",
      greeting: `Hi ${firstName(name)},`,
      intro:
        "In this email you will find an attached executive overview of what the Technical Web Audit includes, either for you to review or to share with your team.",
      lead:
        "The audit helps you understand where the website may be losing leads, creating technical friction or exposing operational risk before deciding whether to redesign, rebuild or fix specific issues.",
      points: [
        {
          title: "What it reviews",
          text: "Performance, mobile experience, technical SEO, forms, security, infrastructure, backups, tracking, staging and the change process behind the website.",
        },
        {
          title: "What it does not review",
          text: "Generic SEO, isolated visual design or vague sales promises. The focus is on the technical and operational system that supports lead generation.",
        },
        {
          title: "What you receive",
          text: "A technical diagnosis, score by area, prioritized roadmap, risks, recommendations and a clear order of action.",
        },
        {
          title: "What happens next",
          text: "Your team can execute the roadmap, you can ask for tactical guidance, or we can define a contracted implementation for the critical points.",
        },
      ],
      webIntro: "To learn more, you can visit the website by",
      webLink: "clicking here",
      callIntro: "If you are interested and want to talk about your particular case, you can book a call by",
      callLink: "clicking here",
      serviceUrl,
      bookingUrl,
    };
  }

  return {
    lang: "es",
    title: "Qué incluye una Auditoría Web Técnica",
    preheader: "Informe ejecutivo adjunto",
    greeting: `Hola ${firstName(name)},`,
    intro:
      "En este email encontrarás adjunto un documento con el informe ejecutivo de lo que incluye la Auditoría Web Técnica, para ti o para compartir con tu equipo.",
    lead:
      "La auditoría sirve para entender dónde puede estar perdiendo oportunidades tu web, qué fricción técnica existe y qué riesgos conviene revisar antes de decidir si rediseñar, reconstruir o corregir puntos concretos.",
    points: [
      {
        title: "Qué revisa",
        text: "Rendimiento, experiencia móvil, SEO técnico, formularios, seguridad, infraestructura, backups, trazabilidad, staging y el proceso de cambios de la web.",
      },
      {
        title: "Qué no revisa",
        text: "SEO genérico, estética aislada ni promesas de ventas. El foco está en el sistema técnico y operativo que sostiene la generación de leads.",
      },
      {
        title: "Qué recibes",
        text: "Un diagnóstico técnico, puntuación por áreas, roadmap priorizado, riesgos, recomendaciones y un orden claro de acción.",
      },
      {
        title: "Qué pasa después",
        text: "Tu equipo puede ejecutar el roadmap, puedes pedir guía puntual o podemos definir una implementación contratada para los puntos críticos.",
      },
    ],
    webIntro: "Para ampliar información puedes acceder a la web haciendo",
    webLink: "click aquí",
    callIntro: "Si estás interesado y quieres hablar de tu caso particular, puedes reservar una llamada haciendo",
    callLink: "click aquí",
    serviceUrl,
    bookingUrl,
  };
}

function buildWebAuditGuideHtml(copy: ReturnType<typeof webAuditGuideCopy>) {
  return `<!DOCTYPE html>
<html lang="${copy.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(copy.title)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #ECEAE6; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased; padding: 40px 16px 60px; }
  .shell { max-width: 600px; margin: 0 auto; background: #fff; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.10); }
  p { font-size: 14px; line-height: 1.65; color: #1A1A1A; margin-bottom: 16px; }
  a { color: #4338CA; }
  @media only screen and (max-width: 520px) {
    body { padding: 18px 8px 32px; }
    .header, .body { padding-left: 22px !important; padding-right: 22px !important; }
  }
</style>
</head>
<body>
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(copy.preheader)}</div>
<div class="shell">
  <div class="header" style="padding:28px 32px 20px;border-top:3px solid #1A1A1A;border-bottom:1px solid #EBEBEA;">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.8px;color:#777;margin-bottom:8px;">${escapeHtml(copy.preheader)}</div>
    <h1 style="font-size:26px;line-height:1.18;color:#1A1A1A;font-weight:700;margin:0;">${escapeHtml(copy.title)}</h1>
  </div>

  <div class="body" style="padding:28px 32px 32px;">
    <p>${escapeHtml(copy.greeting)}</p>
    <p>${escapeHtml(copy.intro)}</p>
    <p>${escapeHtml(copy.lead)}</p>

    <div style="margin:2px 0 22px;">
      ${copy.points
        .map(
          (point) => `<div style="padding:14px 15px;background:#F8F8F7;border-left:2px solid #4338CA;margin-bottom:8px;">
        <div style="font-size:13.5px;line-height:1.6;color:#1A1A1A;"><strong>${escapeHtml(point.title)}.</strong> ${escapeHtml(point.text)}</div>
      </div>`,
        )
        .join("")}
    </div>

    <div style="border-top:1px solid #EBEBEA;margin:22px 0 20px;"></div>

    <p>${escapeHtml(copy.webIntro)} <a href="${escapeAttribute(copy.serviceUrl)}">${escapeHtml(copy.webLink)}</a>.</p>
    <p>${escapeHtml(copy.callIntro)} <a href="${escapeAttribute(copy.bookingUrl)}">${escapeHtml(copy.callLink)}</a>.</p>

    <div style="border-top:1px solid #EBEBEA;margin:22px 0 18px;"></div>

    <div style="font-size:13px;color:#555;line-height:1.8;">
      —<br>
      Pablo Leone<br>
      Web Infrastructure &amp; WordPress Care<br>
      <a href="${escapeAttribute(copy.serviceUrl)}" style="color:#4338CA;text-decoration:none;">${escapeHtml(copy.serviceUrl.replace("https://", ""))}</a><br>
      info@tallerdedigitalizacion.com
    </div>
  </div>
</div>
</body>
</html>`;
}

export function notificationEmail(action: "diagnostic" | "method" | "web-audit" | "web-audit-guide", input: DiagnosticLeadInput | MethodLeadInput | WebAuditLeadInput | WebAuditGuideLeadInput, extra = "") {
  return {
    subject: `Nuevo lead: ${action} - ${input.email}`,
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value);
}

function firstName(value: string) {
  return value.trim().split(/\s+/)[0] || value;
}
