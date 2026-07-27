import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { handle } from "hono/aws-lambda";
import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { z } from "zod";
import { scoreAssessment } from "./assessment";
import { config } from "./config";
import { diagnosticLeadSchema, methodLeadSchema, resourceLeadSchema, webAuditGuideLeadSchema, webAuditLeadSchema } from "./schemas";
import { diagnosticEmail, methodEmail, notificationEmail, resourceEmail, webAuditEmail, webAuditGuideEmail } from "./email/templates";
import { sendEmail } from "./email/sender";
import { assertAllowedOrigin, assertHoneypot, assertHumanTiming, assertPayloadSize, assertRateLimit, getClientIp, SecurityError } from "./security";
import { hashValue, saveLead } from "./store";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: (origin) => (origin && config.allowedOrigins.includes(origin) ? origin : config.allowedOrigins[0]),
    allowMethods: ["POST", "OPTIONS"],
    allowHeaders: ["content-type"],
    maxAge: 86400,
  }),
);

app.get("/health", (c) => c.json({ ok: true }));
app.post("/lead/diagnostic", async (c) => handleLead(c, "diagnostic"));
app.post("/lead/method", async (c) => handleLead(c, "method"));
app.post("/lead/web-audit", async (c) => handleLead(c, "web-audit"));
app.post("/lead/web-audit-guide", async (c) => handleLead(c, "web-audit-guide"));
app.post("/lead/resource", async (c) => handleLead(c, "resource"));

type LeadAction = "diagnostic" | "method" | "web-audit" | "web-audit-guide" | "resource";

async function handleLead(c: Context, action: LeadAction) {
  try {
    assertAllowedOrigin(c);
    const rawBody = await c.req.text();
    assertPayloadSize(rawBody);
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawBody || "{}") as unknown;
    } catch {
      return c.json({ ok: false, error: "JSON inválido" }, 400);
    }
    const input = parseLead(action, parsedJson);
    const ip = getClientIp(c);

    assertHoneypot(input.website);
    assertHumanTiming(input.startedAt);
    await assertRateLimit(ip, action);

    if (action === "diagnostic") {
      const diagnosticInput = diagnosticLeadSchema.parse(input);
      const score = scoreAssessment(diagnosticInput.answers);
      const saved = await saveLead("diagnostic", {
        ...cleanLead(diagnosticInput),
        ipHash: hashValue(ip),
        score,
        answers: diagnosticInput.answers,
      });

      const leadDelivery = await trySendEmail(diagnosticInput.email, diagnosticEmail(diagnosticInput, score));
      if (config.notifyEmail) {
        const deliveryNote = leadDelivery.ok
          ? "Email al lead: enviado."
          : `Email al lead: no enviado. Motivo: ${leadDelivery.message}`;
        await trySendEmail(
          config.notifyEmail,
          notificationEmail("diagnostic", diagnosticInput, `Score: ${score.total}/81 (${score.percent}%). Lead id: ${saved.id}\n${deliveryNote}`),
        );
      }

      return c.json({
        ok: true,
        leadId: saved.id,
        emailDelivered: leadDelivery.ok,
        message: leadDelivery.ok
          ? "Diagnóstico enviado por email."
          : "Recibimos tu diagnóstico. Ahora mismo el envío automático está limitado por la configuración de email, pero tus datos quedaron registrados.",
      });
    }

    if (action === "method") {
      const methodInput = methodLeadSchema.parse(input);
      const saved = await saveLead("method", {
        ...cleanLead(methodInput),
        ipHash: hashValue(ip),
      });
      const methodPdfPath = resolve(config.methodPdfFile);
      const leadDelivery = await trySendEmail(methodInput.email, methodEmail(methodInput, config.siteUrl), existsSync(methodPdfPath) ? methodPdfPath : undefined);
      if (config.notifyEmail) {
        const deliveryNote = leadDelivery.ok
          ? "Email al lead: enviado."
          : `Email al lead: no enviado. Motivo: ${leadDelivery.message}`;
        await trySendEmail(config.notifyEmail, notificationEmail("method", methodInput, `Lead id: ${saved.id}\n${deliveryNote}`));
      }

      return c.json({
        ok: true,
        leadId: saved.id,
        emailDelivered: leadDelivery.ok,
        message: leadDelivery.ok
          ? "Método enviado por email."
          : "Recibimos tu solicitud. Ahora mismo el envío automático está limitado por la configuración de email, pero tus datos quedaron registrados.",
      });
    }

    if (action === "web-audit") {
      const webAuditInput = webAuditLeadSchema.parse(input);
      const saved = await saveLead("web-audit", {
        ...cleanLead(webAuditInput),
        ipHash: hashValue(ip),
      });
      const leadDelivery = await trySendEmail(webAuditInput.email, webAuditEmail(webAuditInput, config.webAuditBookingUrl));
      if (config.notifyEmail) {
        const deliveryNote = leadDelivery.ok
          ? "Email al lead: enviado."
          : `Email al lead: no enviado. Motivo: ${leadDelivery.message}`;
        await trySendEmail(
          config.notifyEmail,
          notificationEmail("web-audit", webAuditInput, `Score: ${webAuditInput.score.total}/100. Lead id: ${saved.id}\n${deliveryNote}`),
        );
      }

      return c.json({
        ok: true,
        leadId: saved.id,
        emailDelivered: leadDelivery.ok,
        message: leadDelivery.ok
          ? "Autoauditoría recibida. Te enviamos el resultado por email."
          : "Recibimos tu autoauditoría. Ahora mismo el envío automático está limitado por la configuración de email, pero tus datos quedaron registrados.",
      });
    }

    if (action === "web-audit-guide") {
      const webAuditGuideInput = webAuditGuideLeadSchema.parse(input);
      const saved = await saveLead("web-audit-guide", {
        ...cleanLead(webAuditGuideInput),
        ipHash: hashValue(ip),
      });
      const webAuditGuidePdfPath = resolve(
        webAuditGuideInput.language === "en" ? config.webAuditGuidePdfFileEn : config.webAuditGuidePdfFileEs,
      );
      const leadDelivery = await trySendEmail(
        webAuditGuideInput.email,
        webAuditGuideEmail(webAuditGuideInput, config.siteUrl, config.webAuditBookingUrl),
        existsSync(webAuditGuidePdfPath) ? webAuditGuidePdfPath : undefined,
      );
      if (config.notifyEmail) {
        const deliveryNote = leadDelivery.ok
          ? "Email al lead: enviado."
          : `Email al lead: no enviado. Motivo: ${leadDelivery.message}`;
        await trySendEmail(config.notifyEmail, notificationEmail("web-audit-guide", webAuditGuideInput, `Lead id: ${saved.id}\n${deliveryNote}`));
      }

      return c.json({
        ok: true,
        leadId: saved.id,
        emailDelivered: leadDelivery.ok,
        message: leadDelivery.ok
          ? "Documento enviado por email."
          : "Recibimos tu solicitud. Ahora mismo el envío automático está limitado por la configuración de email, pero tus datos quedaron registrados.",
      });
    }

    const resourceInput = resourceLeadSchema.parse(input);
    const saved = await saveLead("resource", {
      ...cleanLead(resourceInput),
      ipHash: hashValue(ip),
    });
    const resourceAttachmentPath =
      resourceInput.resourceType === "drive-template"
        ? resolve(resourceInput.language === "en" ? config.driveTemplateFileEn : config.driveTemplateFileEs)
        : undefined;
    const leadDelivery = await trySendEmail(
      resourceInput.email,
      resourceEmail(resourceInput, config.webAuditBookingUrl),
      resourceAttachmentPath && existsSync(resourceAttachmentPath) ? resourceAttachmentPath : undefined,
    );
    if (config.notifyEmail) {
      const deliveryNote = leadDelivery.ok
        ? "Email al lead: enviado."
        : `Email al lead: no enviado. Motivo: ${leadDelivery.message}`;
      await trySendEmail(
        config.notifyEmail,
        notificationEmail("resource", resourceInput, `Recurso: ${resourceInput.resourceType}. Lead id: ${saved.id}\n${deliveryNote}`),
      );
    }

    return c.json({
      ok: true,
      leadId: saved.id,
      emailDelivered: leadDelivery.ok,
      message: leadDelivery.ok
        ? "Te enviamos el resultado por email."
        : "Recibimos tu solicitud. Ahora mismo el envío automático está limitado por la configuración de email, pero tus datos quedaron registrados.",
    });
  } catch (error) {
    if (error instanceof SecurityError) {
      const status = error.status as ContentfulStatusCode;
      return error.silent ? c.json({ ok: true }, status) : c.json({ ok: false, error: error.message }, status);
    }
    if (error instanceof z.ZodError) {
      return c.json({ ok: false, error: "Datos inválidos", issues: error.issues }, 400);
    }
    console.error(error);
    return c.json({ ok: false, error: "Error interno" }, 500);
  }
}

function parseLead(action: LeadAction, parsedJson: unknown) {
  if (action === "diagnostic") return diagnosticLeadSchema.parse(parsedJson);
  if (action === "method") return methodLeadSchema.parse(parsedJson);
  if (action === "web-audit") return webAuditLeadSchema.parse(parsedJson);
  if (action === "web-audit-guide") return webAuditGuideLeadSchema.parse(parsedJson);
  return resourceLeadSchema.parse(parsedJson);
}

async function trySendEmail(to: string, content: Parameters<typeof sendEmail>[1], attachmentPath?: string) {
  try {
    await sendEmail(to, content, attachmentPath);
    return { ok: true, message: "" };
  } catch (error) {
    const message = emailErrorMessage(error);
    console.error(`Email delivery failed for ${to}: ${message}`);
    return { ok: false, message };
  }
}

function emailErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Error desconocido al enviar email.";
}

function cleanLead<T extends { website?: string; startedAt?: number }>(input: T) {
  const { website: _website, ...rest } = input;
  return rest;
}

export const handler = handle(app);
