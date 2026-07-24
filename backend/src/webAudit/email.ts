import type { AreaScore, WebAuditAnswers, WebAuditLanguage } from "./scoring";

export type WebAuditEmailInput = {
  name: string;
  email: string;
  company: string | null;
  websiteUrl: string;
  language: WebAuditLanguage;
  answers: WebAuditAnswers;
  score: number;
  scoreLabel: string;
  scoreInterpretation: string;
  areas: AreaScore[];
  priorities: string[];
  calendlyUrl: string;
};

export function buildWebAuditEmail(input: WebAuditEmailInput) {
  return input.language === "en" ? buildEnglishEmail(input) : buildSpanishEmail(input);
}

function buildSpanishEmail(input: WebAuditEmailInput) {
  const subject = `Resultado de tu Auditoría Web: ${input.scoreLabel} — ${input.score}/100`;
  const area = areaMap(input.areas);
  const priorities = priorityLines(input.priorities);
  const text = [
    `Hola ${input.name},`,
    "",
    "Gracias por completar la autoauditoría de tu web.",
    "",
    `Analizamos las respuestas sobre ${input.websiteUrl} y el resultado inicial es:`,
    "",
    `${input.score}/100`,
    input.scoreLabel,
    "",
    "Este resultado no sustituye una auditoría técnica completa, pero sí sirve para detectar si tu web tiene señales de pérdida de leads, fricción técnica o riesgo operativo.",
    "",
    "Resumen rápido:",
    "",
    `Empresa o proyecto: ${input.company || "-"}`,
    `Tipo de web: ${input.answers.businessType}`,
    `Tráfico de pago: ${input.answers.paidAds}`,
    `Dispositivo principal: ${input.answers.mainDevice}`,
    `PageSpeed móvil: ${formatNumber(input.answers.pagespeedMobile)}`,
    `PageSpeed escritorio: ${formatNumber(input.answers.pagespeedDesktop)}`,
    "",
    "Puntuación por áreas:",
    "",
    `Captación y negocio: ${area.acquisition}/100`,
    `Rendimiento y experiencia: ${area.performance}/100`,
    `SEO técnico básico: ${area.seo}/100`,
    `Conversión y formularios: ${area.forms}/100`,
    `Seguridad: ${area.security}/100`,
    `Infraestructura y continuidad: ${area.infrastructure}/100`,
    `Gobernanza técnica: ${area.governance}/100`,
    "",
    "Lectura del resultado:",
    "",
    input.scoreInterpretation,
    "",
    "Principales señales detectadas:",
    "",
    priorities,
    "",
    "La web no debe analizarse solo como una página visible. Si captura leads, también hay que mirar velocidad, móvil, formularios, seguridad, backups, servidor, base de datos, proceso de cambios y trazabilidad.",
    "",
    "Por eso, el siguiente paso razonable no es “hacer una web nueva” automáticamente. El siguiente paso es saber qué está fallando, qué impacto tiene y en qué orden conviene corregirlo.",
    "",
    "Adjunto encontrarás una hoja ejecutiva con el alcance de una Auditoría Web Técnica: qué revisa, qué no revisa, qué entregables incluye y qué opciones existen después del diagnóstico.",
    "",
    "Si quieres revisar el resultado conmigo, puedes reservar una llamada de 15 minutos aquí:",
    "",
    input.calendlyUrl,
    "",
    "En esa llamada vemos si tiene sentido hacer una auditoría completa. Si no hay margen claro de mejora, te lo diré.",
    "",
    "Un saludo,",
    "Pablo Leone",
    "Taller de Digitalización",
  ].join("\n");

  return { subject, text, html: buildVisualEmail(input) };
}

function buildEnglishEmail(input: WebAuditEmailInput) {
  const subject = `Your Web Audit result: ${input.scoreLabel} — ${input.score}/100`;
  const area = areaMap(input.areas);
  const priorities = priorityLines(input.priorities);
  const text = [
    `Hi ${input.name},`,
    "",
    "Thank you for completing the self-assessment for your website.",
    "",
    `We analyzed the answers for ${input.websiteUrl} and the initial result is:`,
    "",
    `${input.score}/100`,
    input.scoreLabel,
    "",
    "This result does not replace a full technical audit, but it helps detect whether your website shows signs of lead loss, technical friction or operational risk.",
    "",
    "Quick summary:",
    "",
    `Company or project: ${input.company || "-"}`,
    `Website type: ${input.answers.businessType}`,
    `Paid traffic: ${input.answers.paidAds}`,
    `Main device: ${input.answers.mainDevice}`,
    `Mobile PageSpeed: ${formatNumber(input.answers.pagespeedMobile)}`,
    `Desktop PageSpeed: ${formatNumber(input.answers.pagespeedDesktop)}`,
    "",
    "Score by area:",
    "",
    `Acquisition and business: ${area.acquisition}/100`,
    `Performance and experience: ${area.performance}/100`,
    `Basic technical SEO: ${area.seo}/100`,
    `Conversion and forms: ${area.forms}/100`,
    `Security: ${area.security}/100`,
    `Infrastructure and continuity: ${area.infrastructure}/100`,
    `Technical governance: ${area.governance}/100`,
    "",
    "Result interpretation:",
    "",
    input.scoreInterpretation,
    "",
    "Main signals detected:",
    "",
    priorities,
    "",
    "A website should not be analyzed only as a visible page. If it captures leads, speed, mobile experience, forms, security, backups, server, database, change process and tracking also matter.",
    "",
    "That is why the reasonable next step is not automatically “build a new website”. The next step is to understand what is failing, what impact it has and in what order it should be fixed.",
    "",
    "Attached you will find an executive overview of the Technical Web Audit: what it reviews, what it does not review, what deliverables are included and what options exist after the diagnosis.",
    "",
    "If you want to review the result with me, you can book a 15-minute call here:",
    "",
    input.calendlyUrl,
    "",
    "On that call, we can see whether a full audit makes sense. If there is no clear room for improvement, I will tell you.",
    "",
    "Best,",
    "Pablo Leone",
    "Taller de Digitalización",
  ].join("\n");

  return { subject, text, html: buildVisualEmail(input) };
}

function areaMap(areas: AreaScore[]) {
  return Object.fromEntries(areas.map((area) => [area.key, area.score])) as Record<AreaScore["key"], number>;
}

function priorityLines(priorities: string[]) {
  return [0, 1, 2]
    .map((index) => `${index + 1}. ${priorities[index] || "-"}`)
    .join("\n");
}

function formatNumber(value: number | null) {
  return value === null ? "-" : String(value);
}

function buildVisualEmail(input: WebAuditEmailInput) {
  const isEnglish = input.language === "en";
  const labels = emailLabels(input.language);
  const domain = domainFromUrl(input.websiteUrl);
  const theme = scoreTheme(input.score);
  const signals = [0, 1, 2].map((index) => splitSignal(input.priorities[index] || labels.fallbackSignal));
  const serviceUrl = isEnglish ? "https://tallerdedigitalizacion.com/free-website-report/" : "https://tallerdedigitalizacion.com/informe-gratuito-web/";

  return `<!DOCTYPE html>
<html lang="${isEnglish ? "en" : "es"}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(labels.title)} - ${escapeHtml(domain)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #ECEAE6; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased; padding: 40px 16px 60px; }
  .shell { max-width: 600px; margin: 0 auto; background: #fff; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.10); }
  p { font-size: 14px; line-height: 1.65; color: #1A1A1A; margin-bottom: 16px; }
  a { color: #4338CA; }
  @media only screen and (max-width: 520px) {
    body { padding: 18px 8px 32px; }
    .score-header, .body { padding-left: 22px !important; padding-right: 22px !important; }
    .area-cell { display: block !important; width: 100% !important; padding-right: 0 !important; }
  }
</style>
</head>
<body>
<div class="shell">
  <div class="score-header" style="background:${theme.background};border-top:3px solid ${theme.color};padding:26px 32px 22px;">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.8px;color:${theme.color};margin-bottom:6px;">${escapeHtml(labels.scoreEyebrow(theme.key))}</div>
    <div style="display:flex;align-items:baseline;gap:4px;margin-bottom:8px;">
      <span style="font-size:62px;font-weight:700;color:${theme.color};line-height:1;letter-spacing:-3px;font-variant-numeric:tabular-nums;">${input.score}</span>
      <span style="font-size:21px;font-weight:400;color:${theme.mutedColor};line-height:1;">/100</span>
    </div>
    <div style="font-size:12px;color:#777;">${escapeHtml(domain)}</div>
  </div>

  <div class="body" style="padding:28px 32px 32px;">
    <p>${escapeHtml(labels.greeting(firstName(input.name)))}</p>
    <p>${escapeHtml(labels.opening(domain, input.scoreLabel))}</p>

    <div style="margin:0 0 20px;">
      ${signals
        .map(
          (signal) => `<div style="display:flex;gap:12px;padding:11px 14px;background:#F8F8F7;border-left:2px solid ${theme.color};margin-bottom:6px;">
        <span style="color:${theme.color};font-size:13px;flex-shrink:0;line-height:1.65;">→</span>
        <span style="font-size:13.5px;line-height:1.6;color:#1A1A1A;"><strong>${escapeHtml(signal.title)}.</strong>${signal.body ? ` ${escapeHtml(signal.body)}` : ""}</span>
      </div>`,
        )
        .join("")}
    </div>

    <div style="padding:18px 0 16px;border-top:1px solid #EBEBEA;border-bottom:1px solid #EBEBEA;margin:20px 0;">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#999;margin-bottom:13px;">${escapeHtml(labels.scoreByArea)}</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${areaRows(input.areas, input.language)}
      </table>
    </div>

    <p>${escapeHtml(labels.attachment)}</p>

    <div style="border-top:1px solid #EBEBEA;margin:22px 0 20px;"></div>

    <p>${escapeHtml(labels.bookIntro)} <a href="${escapeAttribute(input.calendlyUrl)}">${escapeHtml(labels.bookLink)}</a></p>
    <p>${escapeHtml(labels.callPromise)}</p>
    <p>${escapeHtml(labels.serviceIntro)} <a href="${serviceUrl}">${escapeHtml(labels.serviceLink)}</a></p>

    <div style="border-top:1px solid #EBEBEA;margin:22px 0 18px;"></div>

    <div style="font-size:13px;color:#555;line-height:1.8;">
      —<br>
      Pablo Leone<br>
      Web Infrastructure &amp; WordPress Care<br>
      <a href="${serviceUrl}" style="color:#4338CA;text-decoration:none;">${escapeHtml(serviceUrl.replace("https://", ""))}</a><br>
      info@tallerdedigitalizacion.com
    </div>
  </div>
</div>
</body>
</html>`;
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

function domainFromUrl(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}

function splitSignal(value: string) {
  const cleaned = value.replace(/^\d+\.\s*/, "").trim();
  const match = cleaned.match(/^([^.!?]+)[.!?]\s*(.*)$/);
  if (!match) return { title: cleaned, body: "" };
  return { title: match[1].trim(), body: match[2].trim() };
}

function scoreTheme(score: number) {
  if (score >= 70) {
    return { key: "good", color: "#27AE60", mutedColor: "#8DCBA7", background: "#EEF9F2" };
  }
  if (score >= 40) {
    return { key: "warning", color: "#D4700A", mutedColor: "#E2A766", background: "#FFF7ED" };
  }
  return { key: "risk", color: "#C0392B", mutedColor: "#D98080", background: "#FEF2F2" };
}

function areaRows(areas: AreaScore[], language: WebAuditLanguage) {
  const names = areaLabels(language);
  const cells = areas.map((area) => areaCell(names[area.key], area.score));
  const rows: string[] = [];
  for (let index = 0; index < cells.length; index += 2) {
    rows.push(`<tr>${cells[index]}${cells[index + 1] || '<td class="area-cell" width="50%" style="padding:4px 0 4px 14px;"></td>'}</tr>`);
  }
  return rows.join("");
}

function areaCell(name: string, score: number) {
  const theme = areaTheme(score);
  return `<td class="area-cell" width="50%" style="padding:4px 14px 4px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="font-size:11px;color:#777;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:8px;">${escapeHtml(name)}</td>
        <td width="38" style="width:38px;">
          <div style="width:38px;height:3px;background:#E8E8E8;border-radius:2px;overflow:hidden;">
            <div style="height:3px;border-radius:2px;background:${theme.color};width:${score}%;"></div>
          </div>
        </td>
        <td width="30" style="font-size:11px;font-weight:700;width:30px;text-align:right;font-variant-numeric:tabular-nums;color:${theme.color};">${score}</td>
      </tr>
    </table>
  </td>`;
}

function areaTheme(score: number) {
  if (score >= 70) return { color: "#27AE60" };
  if (score >= 35) return { color: "#E67E22" };
  return { color: "#C0392B" };
}

function areaLabels(language: WebAuditLanguage): Record<AreaScore["key"], string> {
  if (language === "en") {
    return {
      acquisition: "Acquisition",
      performance: "Performance",
      seo: "SEO",
      forms: "Conversion",
      security: "Security",
      infrastructure: "Infrastructure",
      governance: "Governance",
    };
  }

  return {
    acquisition: "Captación",
    performance: "Rendimiento",
    seo: "SEO",
    forms: "Conversión",
    security: "Seguridad",
    infrastructure: "Infraestructura",
    governance: "Gobernanza",
  };
}

function emailLabels(language: WebAuditLanguage) {
  if (language === "en") {
    return {
      title: "Self-Assessment Result",
      scoreByArea: "Score by area",
      fallbackSignal: "The self-assessment does not show one isolated critical signal, but it is worth reviewing the full system.",
      scoreEyebrow: (key: string) => (key === "good" ? "Solid Foundation" : key === "warning" ? "Needs Attention" : "Website at Risk"),
      greeting: (name: string) => `Hi ${name},`,
      opening: (domain: string, label: string) =>
        `We analyzed ${domain} and the initial result is ${label}. This does not replace a full technical audit, but it shows where lead loss, technical friction or operational risk may be happening first.`,
      attachment:
        "Attached you will find the executive overview of the Technical Web Audit: what it reviews, what deliverables are included and what options exist after the diagnosis.",
      bookIntro: "If you'd like to go over the result, you can",
      bookLink: "book a free 15-minute call here →",
      callPromise: "We'll look at what's actually worth fixing and in what order. If there's no clear room for improvement, I'll tell you straight.",
      serviceIntro: "Or learn more about the",
      serviceLink: "Web Audit service →",
    };
  }

  return {
    title: "Resultado de Autoauditoría",
    scoreByArea: "Puntuación por área",
    fallbackSignal: "La autoevaluación no muestra una señal crítica aislada, pero conviene revisar el sistema completo.",
    scoreEyebrow: (key: string) => (key === "good" ? "Base sólida" : key === "warning" ? "Necesita atención" : "Web en riesgo"),
    greeting: (name: string) => `Hola ${name},`,
    opening: (domain: string, label: string) =>
      `Analizamos ${domain} y el resultado inicial es ${label}. Esto no sustituye una auditoría técnica completa, pero muestra dónde puede estar apareciendo pérdida de leads, fricción técnica o riesgo operativo.`,
    attachment:
      "Adjunto encontrarás la hoja ejecutiva de la Auditoría Web Técnica: qué revisa, qué entregables incluye y qué opciones existen después del diagnóstico.",
    bookIntro: "Si quieres revisar el resultado conmigo, puedes",
    bookLink: "reservar una llamada gratuita de 15 minutos aquí →",
    callPromise: "Miraremos qué merece la pena corregir y en qué orden. Si no hay margen claro de mejora, te lo diré directamente.",
    serviceIntro: "O puedes ver más sobre la",
    serviceLink: "Auditoría Web Técnica →",
  };
}
