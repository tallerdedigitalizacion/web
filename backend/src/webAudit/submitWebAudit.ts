import { randomUUID, createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SendRawEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { z } from "zod";
import { buildWebAuditEmail } from "./email";
import { scoreWebAudit, type WebAuditAnswers, type WebAuditLanguage } from "./scoring";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const ses = new SESClient({});

const answerSchema = z.object({
  businessType: z.string().trim().max(120),
  paidAds: z.string().trim().max(120),
  mainDevice: z.string().trim().max(120),
  leadSourceKnown: z.string().trim().max(120),
  pagespeedMobile: z.number().int().min(0).max(100).nullable(),
  pagespeedDesktop: z.number().int().min(0).max(100).nullable(),
  searchConsoleConfigured: z.string().trim().max(120),
  httpsCorrect: z.string().trim().max(120),
  formsRecentlyTested: z.string().trim().max(120),
  formDestinationKnown: z.string().trim().max(120),
  admin2fa: z.string().trim().max(120),
  adminDefaultUrl: z.string().trim().max(120),
  adminCaptchaOrProtection: z.string().trim().max(120),
  cloudflareOrWaf: z.string().trim().max(120),
  hostingProvider: z.string().trim().max(120),
  databaseLocation: z.string().trim().max(120),
  backupsExist: z.string().trim().max(120),
  backupsRestoreTested: z.string().trim().max(120),
  stagingExists: z.string().trim().max(120),
  cacheOrCdnConfigured: z.string().trim().max(120),
  codeVersioned: z.string().trim().max(120),
  technicalOwner: z.string().trim().max(120),
});

const payloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  company: z.string().trim().max(160).nullable(),
  websiteUrl: z.string().trim().url().max(500),
  language: z.enum(["es", "en"]),
  answers: answerSchema,
  antiSpam: z.object({
    honeypot: z.string().max(500).default(""),
    formStartedAt: z.string().max(80),
    turnstileToken: z.string().max(2048).nullable(),
    recaptchaToken: z.string().max(2048).nullable(),
  }),
});

const maxPayloadBytes = Number(process.env.MAX_PAYLOAD_BYTES || "65536");
const minSubmitSeconds = Number(process.env.MIN_SUBMIT_SECONDS || "3");

export async function handler(event: APIGatewayProxyEventV2) {
  const origin = event.headers.origin || event.headers.Origin || "";
  const allowedOrigin = process.env.ALLOWED_ORIGIN || "https://tallerdedigitalizacion.com";
  const corsHeaders = buildCorsHeaders(origin, allowedOrigin);

  if (event.requestContext.http.method === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.requestContext.http.method !== "POST") {
    return json({ ok: false, message: "method_not_allowed" }, 405, corsHeaders);
  }

  if (origin && origin !== allowedOrigin) {
    return json({ ok: false, message: "origin_not_allowed" }, 403, corsHeaders);
  }

  const expectedClientToken = process.env.AUDIT_CLIENT_TOKEN || "";
  const receivedClientToken = event.headers["x-audit-client"] || event.headers["X-Audit-Client"] || "";
  if (expectedClientToken && receivedClientToken !== expectedClientToken) {
    return json({ ok: false, message: "validation_error" }, 400, corsHeaders);
  }

  const rawBody = event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString("utf8") : event.body || "";
  if (Buffer.byteLength(rawBody, "utf8") > maxPayloadBytes) {
    return json({ ok: false, message: "validation_error" }, 413, corsHeaders);
  }

  let parsed: z.infer<typeof payloadSchema>;
  try {
    parsed = payloadSchema.parse(JSON.parse(rawBody || "{}"));
  } catch {
    return json({ ok: false, message: "validation_error" }, 400, corsHeaders);
  }

  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const submittedAt = Date.now();
  const suspiciousSubmission = await isSuspicious(parsed, submittedAt, event);
  let websiteUrl = "";
  try {
    websiteUrl = normalizeWebsiteUrl(parsed.websiteUrl);
  } catch {
    return json({ ok: false, message: "validation_error" }, 400, corsHeaders);
  }
  const scoreResult = scoreWebAudit(parsed.answers as WebAuditAnswers, parsed.language as WebAuditLanguage);
  const ipHash = hashIp(clientIp(event));
  const userAgent = event.headers["user-agent"] || "";

  if (suspiciousSubmission) {
    await saveAudit({
      id,
      createdAt,
      ...leadRecord(parsed, websiteUrl, scoreResult, ipHash, userAgent),
      suspiciousSubmission: true,
      emailSent: false,
    });
    return json({ ok: false, message: "spam_detected" }, 200, corsHeaders);
  }

  const email = buildWebAuditEmail({
    name: parsed.name,
    email: parsed.email,
    company: parsed.company,
    websiteUrl,
    language: parsed.language,
    answers: parsed.answers as WebAuditAnswers,
    calendlyUrl: process.env.CALENDLY_URL || "https://cal.com/taller-de-digitalizacion/free-15-min-website-speed-call",
    ...scoreResult,
  });

  let emailMessageId = "";
  try {
    const attachment = await getExecutiveReport(parsed.language);
    emailMessageId = await sendRawEmail({
      from: requiredEnv("SES_FROM_EMAIL"),
      to: parsed.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
      attachment,
    });
  } catch (error) {
    await saveAudit({
      id,
      createdAt,
      ...leadRecord(parsed, websiteUrl, scoreResult, ipHash, userAgent),
      suspiciousSubmission: false,
      emailSent: false,
      emailError: error instanceof Error ? error.message : "unknown",
    });
    return json({ ok: false, message: "email_failed" }, 502, corsHeaders);
  }

  await saveAudit({
    id,
    createdAt,
    ...leadRecord(parsed, websiteUrl, scoreResult, ipHash, userAgent),
    suspiciousSubmission: false,
    emailSent: true,
    emailMessageId,
  });

  return json(
    {
      ok: true,
      message: "sent",
      score: scoreResult.score,
      scoreLabel: scoreResult.scoreLabel,
      areas: scoreResult.areas,
      penalties: scoreResult.penalties,
      priorities: scoreResult.priorities,
    },
    200,
    corsHeaders,
  );
}

async function isSuspicious(payload: z.infer<typeof payloadSchema>, submittedAt: number, event: APIGatewayProxyEventV2) {
  if (payload.antiSpam.honeypot.trim()) return true;
  const startedAt = Number(payload.antiSpam.formStartedAt);
  if (!Number.isFinite(startedAt) || (submittedAt - startedAt) / 1000 < minSubmitSeconds) return true;
  if (!(await verifyCaptchaIfConfigured(payload, event))) return true;
  return false;
}

async function verifyCaptchaIfConfigured(payload: z.infer<typeof payloadSchema>, event: APIGatewayProxyEventV2) {
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || "";
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY || "";
  if (turnstileSecret) {
    if (!payload.antiSpam.turnstileToken) return false;
    return verifyToken("https://challenges.cloudflare.com/turnstile/v0/siteverify", turnstileSecret, payload.antiSpam.turnstileToken, clientIp(event));
  }
  if (recaptchaSecret) {
    if (!payload.antiSpam.recaptchaToken) return false;
    return verifyToken("https://www.google.com/recaptcha/api/siteverify", recaptchaSecret, payload.antiSpam.recaptchaToken, clientIp(event));
  }
  return true;
}

async function verifyToken(url: string, secret: string, response: string, remoteip: string) {
  const body = new URLSearchParams({ secret, response, remoteip });
  const result = await fetch(url, { method: "POST", body });
  const data = (await result.json().catch(() => ({}))) as { success?: boolean };
  return data.success === true;
}

function leadRecord(
  payload: z.infer<typeof payloadSchema>,
  websiteUrl: string,
  scoreResult: ReturnType<typeof scoreWebAudit>,
  ipHash: string,
  userAgent: string,
) {
  return {
    name: payload.name,
    email: payload.email.toLowerCase(),
    company: payload.company || null,
    websiteUrl,
    language: payload.language,
    score: scoreResult.score,
    scoreLabel: scoreResult.scoreLabel,
    scoreInterpretation: scoreResult.scoreInterpretation,
    areas: scoreResult.areas,
    priorities: scoreResult.priorities,
    penalties: scoreResult.penalties,
    answers: payload.answers,
    userAgent,
    ipHash,
  };
}

async function saveAudit(item: Record<string, unknown>) {
  await ddb.send(
    new PutCommand({
      TableName: requiredEnv("TABLE_NAME"),
      Item: item,
    }),
  );
}

async function getExecutiveReport(language: WebAuditLanguage) {
  const filename =
    language === "en" ? "technical-web-audit-executive-report-en.pdf" : "auditoria-web-tecnica-reporte-ejecutivo-es.pdf";
  const defaultPath = `downloads/${filename}`;
  const envPath = language === "en" ? process.env.EXECUTIVE_REPORT_FILE_EN : process.env.EXECUTIVE_REPORT_FILE_ES;
  const filePath = resolve(envPath || defaultPath);
  if (!existsSync(filePath)) throw new Error(`Executive report PDF not found: ${filePath}`);
  return { filename, contentType: "application/pdf", data: readFileSync(filePath) };
}

async function sendRawEmail(input: {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  attachment: { filename: string; contentType: string; data: Buffer };
}) {
  const raw = buildRawEmail(input);
  const result = await ses.send(new SendRawEmailCommand({ RawMessage: { Data: Buffer.from(raw) } }));
  return result.MessageId || "";
}

function buildRawEmail(input: {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  attachment: { filename: string; contentType: string; data: Buffer };
}) {
  const mixedBoundary = `mixed_${Date.now()}`;
  const altBoundary = `alt_${Date.now()}`;
  const headers = [
    `From: ${formatFromHeader(input.from)}`,
    `To: ${input.to}`,
    `Subject: ${encodeMime(input.subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${mixedBoundary}"`,
  ];
  const parts = [
    `--${mixedBoundary}`,
    `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
    "",
    `--${altBoundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    input.text,
    "",
    `--${altBoundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    input.html,
    "",
    `--${altBoundary}--`,
    `--${mixedBoundary}`,
    `Content-Type: ${input.attachment.contentType}; name="${input.attachment.filename}"`,
    "Content-Transfer-Encoding: base64",
    `Content-Disposition: attachment; filename="${input.attachment.filename}"`,
    "",
    input.attachment.data.toString("base64").replace(/(.{76})/g, "$1\r\n"),
    `--${mixedBoundary}--`,
  ];
  return `${headers.join("\r\n")}\r\n\r\n${parts.join("\r\n")}`;
}

function buildCorsHeaders(origin: string, allowedOrigin: string) {
  return {
    "access-control-allow-origin": origin === allowedOrigin ? allowedOrigin : allowedOrigin,
    "access-control-allow-methods": "POST,OPTIONS",
    "access-control-allow-headers": "Content-Type,X-Audit-Client",
    "vary": "Origin",
  };
}

function json(body: unknown, statusCode: number, headers: Record<string, string>) {
  return {
    statusCode,
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

function normalizeWebsiteUrl(value: string) {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid URL protocol.");
  url.hash = "";
  return url.toString();
}

function clientIp(event: APIGatewayProxyEventV2) {
  const forwarded = event.headers["x-forwarded-for"] || "";
  return forwarded.split(",")[0]?.trim() || event.requestContext.http.sourceIp || "unknown";
}

function hashIp(ip: string) {
  const salt = process.env.IP_HASH_SALT || "change-me";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function encodeMime(value: string) {
  return `=?UTF-8?B?${Buffer.from(value).toString("base64")}?=`;
}

function formatFromHeader(value: string) {
  if (value.includes("<")) return value;
  return `${encodeMime("Taller de Digitalización")} <${value}>`;
}
