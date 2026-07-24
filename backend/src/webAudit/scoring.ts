export type WebAuditLanguage = "es" | "en";

export type WebAuditAnswers = {
  businessType: string;
  paidAds: string;
  mainDevice: string;
  leadSourceKnown: string;
  pagespeedMobile: number | null;
  pagespeedDesktop: number | null;
  searchConsoleConfigured: string;
  httpsCorrect: string;
  formsRecentlyTested: string;
  formDestinationKnown: string;
  admin2fa: string;
  adminDefaultUrl: string;
  adminCaptchaOrProtection: string;
  cloudflareOrWaf: string;
  hostingProvider: string;
  databaseLocation: string;
  backupsExist: string;
  backupsRestoreTested: string;
  stagingExists: string;
  cacheOrCdnConfigured: string;
  codeVersioned: string;
  technicalOwner: string;
};

export type AreaScore = {
  key: keyof typeof areaWeights;
  label: string;
  score: number;
  weighted: number;
};

export const areaWeights = {
  acquisition: 15,
  performance: 20,
  seo: 15,
  forms: 15,
  security: 15,
  infrastructure: 15,
  governance: 5,
} as const;

const labels = {
  es: {
    acquisition: "Captación y negocio",
    performance: "Rendimiento y experiencia",
    seo: "SEO técnico básico",
    forms: "Conversión y formularios",
    security: "Seguridad",
    infrastructure: "Infraestructura y continuidad",
    governance: "Gobernanza técnica",
  },
  en: {
    acquisition: "Acquisition and business",
    performance: "Performance and experience",
    seo: "Basic technical SEO",
    forms: "Conversion and forms",
    security: "Security",
    infrastructure: "Infrastructure and continuity",
    governance: "Technical governance",
  },
} as const;

export function scoreWebAudit(answers: WebAuditAnswers, language: WebAuditLanguage) {
  const areaInputs: Record<keyof typeof areaWeights, number[]> = {
    acquisition: [scoreKnown(answers.leadSourceKnown), scorePaidAdsContext(answers.paidAds), scoreKnown(answers.businessType)],
    performance: [scorePageSpeed(answers.pagespeedMobile), scorePageSpeed(answers.pagespeedDesktop), scoreBooleanish(answers.cacheOrCdnConfigured)],
    seo: [scoreBooleanish(answers.searchConsoleConfigured), scoreBooleanish(answers.httpsCorrect), scoreKnown(answers.businessType)],
    forms: [scoreBooleanish(answers.formsRecentlyTested), scoreBooleanish(answers.formDestinationKnown), scoreKnown(answers.leadSourceKnown)],
    security: [
      scoreBooleanish(answers.httpsCorrect),
      scoreBooleanish(answers.admin2fa),
      scoreBooleanish(answers.adminCaptchaOrProtection),
      scoreBooleanish(answers.cloudflareOrWaf),
    ],
    infrastructure: [
      scoreKnown(answers.hostingProvider),
      scoreKnown(answers.databaseLocation),
      scoreBooleanish(answers.backupsExist),
      scoreBooleanish(answers.backupsRestoreTested),
      scoreBooleanish(answers.stagingExists),
    ],
    governance: [scoreBooleanish(answers.codeVersioned), scoreKnown(answers.technicalOwner), scoreBooleanish(answers.adminDefaultUrl)],
  };

  const areas = (Object.keys(areaWeights) as Array<keyof typeof areaWeights>).map((key) => {
    const values = areaInputs[key];
    const score = Math.round((values.reduce((sum, value) => sum + value, 0) / (values.length * 4)) * 100);
    const weighted = (score / 100) * areaWeights[key];
    return { key, label: labels[language][key], score, weighted };
  });

  const penalties = getPenalties(answers);
  const baseScore = areas.reduce((sum, area) => sum + area.weighted, 0);
  const totalPenalty = penalties.reduce((sum, penalty) => sum + penalty.value, 0);
  const score = Math.max(0, Math.min(100, Math.round(baseScore + totalPenalty)));
  const scoreLabel = getScoreLabel(score, language);
  return {
    score,
    scoreLabel,
    scoreInterpretation: getInterpretation(score, language),
    areas,
    penalties,
    priorities: getPriorities(answers, language),
  };
}

function scoreKnown(value: string) {
  if (isUnknown(value)) return 1;
  if (isNegative(value)) return 0;
  if (isPartial(value)) return 2;
  return value ? 4 : 1;
}

function scoreBooleanish(value: string) {
  if (isUnknown(value)) return 1;
  if (isNegative(value)) return 0;
  if (isPartial(value)) return 2;
  return value ? 4 : 1;
}

function scorePaidAdsContext(value: string) {
  if (isUnknown(value)) return 1;
  return value ? 4 : 1;
}

function scorePageSpeed(value: number | null) {
  if (value === null) return 1;
  if (value < 50) return 0;
  if (value < 70) return 2;
  if (value < 90) return 3;
  return 4;
}

function getPenalties(answers: WebAuditAnswers) {
  const penalties: Array<{ key: string; value: number }> = [];
  if (paysForAds(answers.paidAds) && answers.pagespeedMobile !== null && answers.pagespeedMobile < 50) penalties.push({ key: "ads_mobile_speed", value: -8 });
  if (paysForAds(answers.paidAds) && !isPositive(answers.leadSourceKnown)) penalties.push({ key: "ads_lead_source_unknown", value: -6 });
  if (!isPositive(answers.formsRecentlyTested)) penalties.push({ key: "forms_not_tested", value: -8 });
  if (!isPositive(answers.backupsExist)) penalties.push({ key: "backups_missing_unknown", value: -6 });
  if (!isPositive(answers.admin2fa)) penalties.push({ key: "admin_2fa_missing", value: -5 });
  if (!isPositive(answers.formDestinationKnown)) penalties.push({ key: "lead_destination_unknown", value: -5 });
  if (isNegative(answers.httpsCorrect)) penalties.push({ key: "https_missing", value: -10 });
  return penalties;
}

export function getScoreLabel(score: number, language: WebAuditLanguage) {
  if (score <= 39) return language === "es" ? "Web en riesgo" : "Website at risk";
  if (score <= 59) return language === "es" ? "Web frágil" : "Fragile website";
  if (score <= 74) return language === "es" ? "Base aceptable, con fugas" : "Acceptable foundation, with leaks";
  if (score <= 89) return language === "es" ? "Buena base técnica" : "Solid technical foundation";
  return language === "es" ? "Web bien preparada para captación" : "Website well prepared for lead generation";
}

function getInterpretation(score: number, language: WebAuditLanguage) {
  const es = [
    "Tu web muestra señales fuertes de riesgo técnico y comercial. Si estás invirtiendo en tráfico, anuncios o captación, es probable que parte de ese esfuerzo se esté perdiendo antes de convertirse en oportunidad real.\n\nEl foco debería estar en revisar primero los puntos críticos: formularios, velocidad móvil, seguridad, backups y trazabilidad de leads. En este rango no conviene empezar por diseño o contenido sin validar antes la base técnica.",
    "Tu web tiene una base funcional, pero aparecen señales de fragilidad. Puede estar captando algunos leads, pero probablemente hay fricción técnica, problemas de medición o riesgos que no están suficientemente controlados.\n\nEl foco debería estar en separar lo urgente de lo cosmético: comprobar formularios, revisar rendimiento móvil, validar seguridad básica y entender si la infraestructura actual soporta el objetivo comercial de la web.",
    "Tu web parece tener una base aceptable, pero todavía hay fugas probables. En este rango, el problema no suele ser que todo esté mal, sino que ciertos puntos técnicos pueden estar reduciendo conversión, velocidad o confianza.\n\nEl foco debería estar en priorizar mejoras concretas: rendimiento, formularios, SEO técnico, seguimiento de leads y proceso de cambios. Puede haber retorno claro sin rehacer toda la web.",
    "Tu web muestra una base técnica razonablemente buena. Aun así, hay margen para revisar puntos específicos que pueden afectar captación, mantenimiento o escalabilidad.\n\nEn este rango, la auditoría completa tiene sentido si estás invirtiendo en anuncios, SEO o crecimiento y quieres reducir incertidumbre técnica antes de seguir aumentando tráfico.",
    "Tu web muestra una base sólida para captación. No aparecen señales graves en esta autoevaluación inicial.\n\nAun así, este resultado depende de las respuestas introducidas y de una revisión limitada. Una auditoría completa solo tendría sentido si quieres validar detalles técnicos, preparar crecimiento, revisar seguridad o tomar decisiones antes de una inversión mayor.",
  ];
  const en = [
    "Your website shows strong signs of technical and commercial risk. If you are investing in traffic, ads or lead generation, part of that effort is probably being lost before it becomes a real opportunity.\n\nThe focus should be on reviewing the critical points first: forms, mobile speed, security, backups and lead traceability. In this range, it is not wise to start with design or content before validating the technical foundation.",
    "Your website has a functional base, but there are signs of fragility. It may be capturing some leads, but there is probably technical friction, measurement issues or risks that are not sufficiently controlled.\n\nThe focus should be on separating what is urgent from what is cosmetic: testing forms, reviewing mobile performance, validating basic security and understanding whether the current infrastructure supports the commercial goal of the website.",
    "Your website appears to have an acceptable foundation, but there are still likely leaks. In this range, the problem is usually not that everything is wrong, but that specific technical points may be reducing conversion, speed or trust.\n\nThe focus should be on prioritizing concrete improvements: performance, forms, technical SEO, lead tracking and the change process. There may be clear return without rebuilding the whole website.",
    "Your website shows a reasonably solid technical foundation. Even so, there is room to review specific points that may affect lead generation, maintenance or scalability.\n\nIn this range, the full audit makes sense if you are investing in ads, SEO or growth and want to reduce technical uncertainty before increasing traffic.",
    "Your website shows a solid foundation for lead generation. This initial self-assessment does not show serious warning signs.\n\nEven so, this result depends on the answers provided and on a limited review. A full audit only makes sense if you want to validate technical details, prepare for growth, review security or make decisions before a larger investment.",
  ];
  const list = language === "es" ? es : en;
  if (score <= 39) return list[0];
  if (score <= 59) return list[1];
  if (score <= 74) return list[2];
  if (score <= 89) return list[3];
  return list[4];
}

function getPriorities(answers: WebAuditAnswers, language: WebAuditLanguage) {
  const rules: Array<[boolean, string, string]> = [
    [
      paysForAds(answers.paidAds) && answers.pagespeedMobile !== null && answers.pagespeedMobile < 50,
      "Estás llevando tráfico pagado a una experiencia móvil lenta. Esto puede aumentar el coste por lead y reducir la conversión.",
      "You are sending paid traffic to a slow mobile experience. This can increase cost per lead and reduce conversion.",
    ],
    [
      paysForAds(answers.paidAds) && !isPositive(answers.leadSourceKnown),
      "No hay trazabilidad clara del origen de los leads. Sin esta medición, es difícil saber qué canal funciona y cuál está consumiendo presupuesto.",
      "Lead source tracking is unclear. Without this measurement, it is difficult to know which channel works and which one is consuming budget.",
    ],
    [
      !isPositive(answers.formsRecentlyTested),
      "No hay evidencia reciente de que los formularios funcionen correctamente. En una web de captación, esto es un riesgo directo de pérdida de oportunidades.",
      "There is no recent evidence that the forms work correctly. On a lead generation website, this is a direct risk of lost opportunities.",
    ],
    [
      !isPositive(answers.formDestinationKnown),
      "No está claro dónde llegan los leads. Si nadie controla ese flujo, pueden perderse contactos sin que la empresa lo vea.",
      "It is not clear where leads arrive. If nobody controls that flow, contacts may be lost without the company noticing.",
    ],
    [
      !isPositive(answers.backupsExist),
      "La continuidad técnica no está clara. Si la web falla o se compromete, puede no existir una recuperación rápida y segura.",
      "Technical continuity is unclear. If the website fails or is compromised, there may not be a fast and safe recovery path.",
    ],
    [
      isNegative(answers.backupsRestoreTested),
      "Existen backups, pero no hay evidencia de restauración probada. Un backup no probado es una promesa, no una garantía.",
      "Backups may exist, but there is no evidence of a tested restore. An untested backup is a promise, not a guarantee.",
    ],
    [
      isNegative(answers.admin2fa),
      "El acceso de administración parece débil. Si la web captura leads, la seguridad del panel no es un detalle secundario.",
      "Admin access appears weak. If the website captures leads, admin security is not a secondary detail.",
    ],
    [
      isNegative(answers.adminCaptchaOrProtection),
      "El login administrativo no parece tener protección suficiente contra bots o intentos automatizados.",
      "The admin login does not appear to have enough protection against bots or automated attempts.",
    ],
    [
      !isPositive(answers.searchConsoleConfigured),
      "La visibilidad técnica en Google parece limitada. Sin Search Console, es más difícil detectar problemas de indexación, errores o pérdida de presencia orgánica.",
      "Technical visibility in Google appears limited. Without Search Console, it is harder to detect indexing issues, errors or loss of organic presence.",
    ],
    [
      isUnknown(answers.hostingProvider) || isUnknown(answers.databaseLocation),
      "No está claro dónde vive la web ni cómo está montada. Esa falta de mapa técnico complica mantenimiento, recuperación y decisiones futuras.",
      "It is not clear where the website lives or how it is built. That lack of technical map complicates maintenance, recovery and future decisions.",
    ],
    [
      isNegative(answers.stagingExists),
      "No parece existir un entorno de pruebas antes de tocar producción. Esto aumenta el riesgo de romper la web durante cambios normales.",
      "There does not appear to be a staging environment before touching production. This increases the risk of breaking the website during normal changes.",
    ],
    [
      !isPositive(answers.cacheOrCdnConfigured),
      "No parece haber una estrategia clara de caché o CDN. Esto puede afectar velocidad, estabilidad y experiencia móvil.",
      "There does not appear to be a clear cache or CDN strategy. This can affect speed, stability and mobile experience.",
    ],
  ];

  const priorities = rules.filter(([condition]) => condition).map(([, es, en]) => (language === "es" ? es : en));
  if (priorities.length === 0) {
    priorities.push(
      language === "es"
        ? "La autoevaluación no muestra una señal crítica aislada, pero conviene revisar el sistema completo para validar rendimiento, captación, seguridad y continuidad."
        : "The self-assessment does not show one isolated critical signal, but it is worth reviewing the full system to validate performance, lead generation, security and continuity.",
    );
  }
  return [...new Set(priorities)].slice(0, 3);
}

function isPositive(value: string) {
  const normalized = normalize(value);
  return ["yes", "si", "sí", "true", "configured", "tested", "known", "clear", "multiple-platforms", "google-ads", "meta-ads"].includes(normalized);
}

function isNegative(value: string) {
  const normalized = normalize(value);
  return ["no", "false", "none", "not-tested", "missing", "incorrect"].includes(normalized);
}

function isUnknown(value: string) {
  const normalized = normalize(value);
  return !normalized || normalized === "unknown" || normalized === "no_lo_se" || normalized === "i_do_not_know" || normalized.includes("do-not-know");
}

function isPartial(value: string) {
  const normalized = normalize(value);
  return normalized.includes("partial") || normalized.includes("sometimes") || normalized.includes("manual") || normalized.includes("some");
}

function paysForAds(value: string) {
  const normalized = normalize(value);
  return ["google-ads", "meta-ads", "multiple-platforms", "several-platforms", "varias-plataformas"].includes(normalized);
}

function normalize(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
