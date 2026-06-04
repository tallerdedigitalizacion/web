export const config = {
  tableName: requireEnv("LEADS_TABLE_NAME"),
  senderEmail: requireEnv("SENDER_EMAIL"),
  notifyEmail: process.env.NOTIFY_EMAIL || process.env.SENDER_EMAIL || "",
  emailDriver: (process.env.EMAIL_DRIVER || "ses").toLowerCase(),
  smtpHost: process.env.SMTP_HOST || "smtp.zoho.eu",
  smtpPort: Number(process.env.SMTP_PORT || "465"),
  smtpSecure: process.env.SMTP_SECURE !== "false",
  smtpUser: process.env.SMTP_USER || "",
  smtpPassword: process.env.SMTP_PASSWORD || process.env.SMTP_PASS || "",
  siteUrl: process.env.SITE_URL || "https://tallerdedigitalizacion.com",
  bookingUrl: process.env.BOOKING_URL || "https://calendly.com/tallerdedigitalizacion-info/30min",
  allowedOrigins: (process.env.ALLOWED_ORIGINS || "https://tallerdedigitalizacion.com")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  ipHashSalt: process.env.IP_HASH_SALT || "change-me",
  methodPdfFile: process.env.METHOD_PDF_FILE || "downloads/metodo-auditoria-caos-operativo.pdf",
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || "8"),
  rateLimitWindowSeconds: Number(process.env.RATE_LIMIT_WINDOW_SECONDS || "600"),
  minSubmitSeconds: Number(process.env.MIN_SUBMIT_SECONDS || "3"),
  maxPayloadBytes: Number(process.env.MAX_PAYLOAD_BYTES || "65536"),
};

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
