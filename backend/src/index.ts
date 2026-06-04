import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { handle } from "hono/aws-lambda";
import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { z } from "zod";
import { scoreAssessment } from "./assessment";
import { config } from "./config";
import { diagnosticLeadSchema, methodLeadSchema } from "./schemas";
import { diagnosticEmail, methodEmail, notificationEmail } from "./email/templates";
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

async function handleLead(c: Context, action: "diagnostic" | "method") {
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
    const input = action === "diagnostic" ? diagnosticLeadSchema.parse(parsedJson) : methodLeadSchema.parse(parsedJson);
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
