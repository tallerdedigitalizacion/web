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
  bookingUrl: process.env.BOOKING_URL || "https://cal.com/taller-de-digitalizacion/free-15-min-website-speed-call",
  webAuditBookingUrl: process.env.WEB_AUDIT_BOOKING_URL || "https://cal.com/taller-de-digitalizacion/free-15-min-website-speed-call",
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
  webAuditGuidePdfFileEs: process.env.WEB_AUDIT_GUIDE_PDF_FILE_ES || "downloads/auditoria-web-tecnica-reporte-ejecutivo-es.pdf",
  webAuditGuidePdfFileEn: process.env.WEB_AUDIT_GUIDE_PDF_FILE_EN || "downloads/technical-web-audit-executive-report-en.pdf",
};

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
