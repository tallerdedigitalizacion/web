import { existsSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { SendRawEmailCommand, SESClient } from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";
import { config } from "../config";

type EmailContent = {
  subject: string;
  text: string;
  html: string;
};

const ses = new SESClient({});
const smtpTransporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: config.smtpSecure,
  auth: config.smtpUser && config.smtpPassword ? { user: config.smtpUser, pass: config.smtpPassword } : undefined,
});

export async function sendEmail(to: string, content: EmailContent, attachmentPath?: string) {
  if (config.emailDriver === "smtp") {
    await sendWithSmtp(to, content, attachmentPath);
    return;
  }

  await sendWithSes(to, content, attachmentPath);
}

async function sendWithSmtp(to: string, content: EmailContent, attachmentPath?: string) {
  if (!config.smtpUser || !config.smtpPassword) {
    throw new Error("SMTP no configurado: faltan SMTP_USER o SMTP_PASSWORD.");
  }

  const attachments = [];
  if (attachmentPath) {
    const filePath = resolve(attachmentPath);
    if (existsSync(filePath)) {
      attachments.push({
        filename: basename(filePath),
        path: filePath,
        contentType: "application/pdf",
      });
    }
  }

  await smtpTransporter.sendMail({
    from: config.senderEmail,
    to,
    subject: content.subject,
    text: content.text,
    html: content.html,
    attachments,
  });
}

async function sendWithSes(to: string, content: EmailContent, attachmentPath?: string) {
  const raw = buildRawEmail({
    from: config.senderEmail,
    to,
    ...content,
    attachmentPath,
  });

  await ses.send(
    new SendRawEmailCommand({
      RawMessage: { Data: Buffer.from(raw) },
    }),
  );
}

function buildRawEmail({
  from,
  to,
  subject,
  text,
  html,
  attachmentPath,
}: EmailContent & { from: string; to: string; attachmentPath?: string }) {
  const mixedBoundary = `mixed_${Date.now()}`;
  const altBoundary = `alt_${Date.now()}`;
  const headers = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${encodeMime(subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${mixedBoundary}"`,
  ];

  const parts = [
    `--${mixedBoundary}`,
    `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
    "",
    `--${altBoundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 7bit",
    "",
    text,
    "",
    `--${altBoundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: 7bit",
    "",
    html,
    "",
    `--${altBoundary}--`,
  ];

  if (attachmentPath) {
    const filePath = resolve(attachmentPath);
    if (existsSync(filePath)) {
      const filename = basename(filePath);
      parts.push(
        `--${mixedBoundary}`,
        `Content-Type: application/pdf; name="${filename}"`,
        "Content-Transfer-Encoding: base64",
        `Content-Disposition: attachment; filename="${filename}"`,
        "",
        readFileSync(filePath).toString("base64").replace(/(.{76})/g, "$1\r\n"),
      );
    }
  }

  parts.push(`--${mixedBoundary}--`);
  return `${headers.join("\r\n")}\r\n\r\n${parts.join("\r\n")}`;
}

function encodeMime(value: string) {
  return `=?UTF-8?B?${Buffer.from(value).toString("base64")}?=`;
}
