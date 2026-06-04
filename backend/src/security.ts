import type { Context } from "hono";
import { config } from "./config";
import { incrementRate } from "./store";

export function getClientIp(c: Context) {
  const forwarded = c.req.header("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return c.req.header("x-real-ip") || "unknown";
}

export function assertAllowedOrigin(c: Context) {
  const origin = c.req.header("origin");
  if (!origin) return;
  if (!config.allowedOrigins.includes(origin)) {
    throw new SecurityError("Origin not allowed", 403);
  }
}

export function assertPayloadSize(rawBody: string) {
  if (Buffer.byteLength(rawBody, "utf8") > config.maxPayloadBytes) {
    throw new SecurityError("Payload too large", 413);
  }
}

export function assertHoneypot(value?: string) {
  if (value && value.trim().length > 0) {
    throw new SecurityError("Accepted", 202, true);
  }
}

export function assertHumanTiming(startedAt?: number) {
  if (!startedAt) return;
  const elapsedSeconds = (Date.now() - startedAt) / 1000;
  if (elapsedSeconds < config.minSubmitSeconds) {
    throw new SecurityError("Accepted", 202, true);
  }
}

export async function assertRateLimit(ip: string, action: string) {
  const count = await incrementRate(ip, action);
  if (count > config.rateLimitMax) {
    throw new SecurityError("Too many requests", 429);
  }
}

export class SecurityError extends Error {
  constructor(
    message: string,
    public status = 400,
    public silent = false,
  ) {
    super(message);
  }
}
