import { config } from "./config";

export interface WebsiteReportChecks {
  httpsOk: boolean;
  mobileFriendly: boolean;
  hasTitle: boolean;
  hasMetaDescription: boolean;
  hasContactForm: boolean;
  hasLeadCapture: boolean;
  hasAnalytics: boolean;
}

export interface PageSpeedScores {
  performance: number | null;
  seo: number | null;
  bestPractices: number | null;
}

export interface WebsiteReport {
  url: string;
  fetched: boolean;
  checks: WebsiteReportChecks;
  pageSpeed: PageSpeedScores | null;
  findings: string[];
}

const FETCH_TIMEOUT_MS = 8000;
const PAGESPEED_TIMEOUT_MS = 15000;

async function fetchWithTimeout(url: string, timeoutMs: number, init?: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function checkHtml(html: string, url: string): WebsiteReportChecks {
  return {
    httpsOk: url.toLowerCase().startsWith("https://"),
    mobileFriendly: /<meta[^>]+name=["']viewport["']/i.test(html),
    hasTitle: /<title>\s*[^<\s][^<]{2,}<\/title>/i.test(html),
    hasMetaDescription: /<meta[^>]+name=["']description["'][^>]+content=["'][^"']{20,}["']/i.test(html),
    hasContactForm: /<form[\s>]/i.test(html),
    hasLeadCapture: /wa\.me\/|api\.whatsapp\.com|tawk\.to|intercom|crisp\.chat|tidio|drift\.com|hubspot/i.test(html),
    hasAnalytics: /googletagmanager\.com|gtag\(|google-analytics\.com|plausible\.io|clarity\.ms/i.test(html),
  };
}

async function fetchPageSpeed(url: string): Promise<PageSpeedScores | null> {
  try {
    const params = new URLSearchParams({
      url,
      strategy: "mobile",
    });
    params.append("category", "performance");
    params.append("category", "seo");
    params.append("category", "best-practices");
    if (config.pagespeedApiKey) params.set("key", config.pagespeedApiKey);

    const response = await fetchWithTimeout(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`,
      PAGESPEED_TIMEOUT_MS,
    );
    if (!response.ok) return null;
    const data = (await response.json()) as {
      lighthouseResult?: { categories?: Record<string, { score?: number }> };
    };
    const categories = data.lighthouseResult?.categories;
    if (!categories) return null;

    const toScore = (value?: number) => (typeof value === "number" ? Math.round(value * 100) : null);
    return {
      performance: toScore(categories.performance?.score),
      seo: toScore(categories.seo?.score),
      bestPractices: toScore(categories["best-practices"]?.score),
    };
  } catch (error) {
    console.error(`PageSpeed lookup failed for ${url}: ${error instanceof Error ? error.message : "unknown error"}`);
    return null;
  }
}

function buildFindings(checks: WebsiteReportChecks, pageSpeed: PageSpeedScores | null, fetched: boolean): string[] {
  const findings: string[] = [];

  if (!fetched) {
    findings.push("No hemos podido acceder a la web para analizarla automáticamente. Revisa que la URL sea correcta y esté accesible públicamente.");
    return findings;
  }

  if (!checks.httpsOk) findings.push("La web no usa HTTPS: afecta a la confianza de los visitantes y al posicionamiento en Google.");
  if (pageSpeed?.performance !== null && pageSpeed?.performance !== undefined && pageSpeed.performance < 50) {
    findings.push(`Velocidad de carga baja en móvil (${pageSpeed.performance}/100): puedes estar perdiendo visitas antes de que la página termine de cargar.`);
  }
  if (!checks.mobileFriendly) findings.push("No se detecta una configuración específica para móviles: gran parte del tráfico puede tener una mala experiencia.");
  if (!checks.hasTitle || !checks.hasMetaDescription) findings.push("Faltan elementos básicos de SEO (título o descripción): dificulta que Google entienda de qué trata la página.");
  if (!checks.hasContactForm) findings.push("No se detecta un formulario de contacto: puedes estar perdiendo oportunidades de captar leads.");
  if (!checks.hasLeadCapture) findings.push("No se detecta un canal de contacto directo (WhatsApp o chat): dificulta la conversión de visitas en clientes.");
  if (!checks.hasAnalytics) findings.push("No se detecta analítica instalada: sin datos, es difícil saber qué está funcionando y qué no.");
  if (pageSpeed?.seo !== null && pageSpeed?.seo !== undefined && pageSpeed.seo < 80) {
    findings.push(`Puntuación SEO técnico mejorable (${pageSpeed.seo}/100).`);
  }

  if (findings.length === 0) {
    findings.push("No detectamos problemas graves en los indicadores automáticos revisados. Aun así, siempre hay margen de mejora en conversión y automatización.");
  }

  return findings.slice(0, 6);
}

export async function analyzeWebsite(url: string): Promise<WebsiteReport> {
  let html = "";
  let fetched = false;

  try {
    const response = await fetchWithTimeout(url, FETCH_TIMEOUT_MS, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; TallerDeDigitalizacionBot/1.0)" },
      redirect: "follow",
    });
    if (response.ok) {
      html = await response.text();
      fetched = true;
    }
  } catch (error) {
    console.error(`Website fetch failed for ${url}: ${error instanceof Error ? error.message : "unknown error"}`);
  }

  const checks = fetched
    ? checkHtml(html, url)
    : {
        httpsOk: url.toLowerCase().startsWith("https://"),
        mobileFriendly: false,
        hasTitle: false,
        hasMetaDescription: false,
        hasContactForm: false,
        hasLeadCapture: false,
        hasAnalytics: false,
      };

  const pageSpeed = await fetchPageSpeed(url);
  const findings = buildFindings(checks, pageSpeed, fetched);

  return { url, fetched, checks, pageSpeed, findings };
}
