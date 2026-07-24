import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .max(160)
  .optional()
  .transform((value) => value || undefined);

const baseLeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  company: optionalText,
  role: optionalText,
  privacyAccepted: z.literal(true),
  marketingAccepted: z.boolean().optional().default(false),
  website: z.string().trim().max(200).optional().default(""),
  startedAt: z.number().int().positive().optional(),
  pageUrl: z.string().url().max(500).optional(),
  userAgent: z.string().max(500).optional(),
});

export const diagnosticLeadSchema = baseLeadSchema.extend({
  answers: z
    .array(
      z.object({
        areaIndex: z.number().int().min(0).max(8),
        questionIndex: z.number().int().min(0).max(2),
        value: z.number().int().min(0).max(3),
      }),
    )
    .length(27),
});

export const methodLeadSchema = baseLeadSchema;

const scoreSchema = z.object({
  total: z.number().int().min(0).max(100),
  range: z.string().trim().max(120),
  areaScores: z
    .array(
      z.object({
        key: z.string().trim().max(60),
        name: z.string().trim().max(120),
        raw: z.number().min(0),
        maxRaw: z.number().min(1),
        weight: z.number().min(0).max(100),
        normalized: z.number().min(0).max(100),
      }),
    )
    .min(1)
    .max(12),
  penalties: z
    .array(
      z.object({
        key: z.string().trim().max(80),
        value: z.number().int().min(-100).max(0),
      }),
    )
    .max(12),
});

export const webAuditLeadSchema = baseLeadSchema.extend({
  siteUrl: z.string().trim().url().max(500),
  websiteType: z.string().trim().min(1).max(120),
  paidAds: z.string().trim().min(1).max(120),
  primaryChannel: z.string().trim().min(1).max(120),
  pageSpeedMobile: z.number().int().min(0).max(100).optional(),
  pageSpeedDesktop: z.number().int().min(0).max(100).optional(),
  score: scoreSchema,
  answers: z
    .array(
      z.object({
        areaKey: z.string().trim().max(60),
        areaName: z.string().trim().max(120),
        question: z.string().trim().max(240),
        questionIndex: z.number().int().min(0).max(10),
        value: z.number().int().min(0).max(4),
      }),
    )
    .min(1)
    .max(60),
});

export const webAuditGuideLeadSchema = baseLeadSchema.extend({
  language: z.enum(["es", "en"]).optional().default("es"),
});

export type DiagnosticLeadInput = z.infer<typeof diagnosticLeadSchema>;
export type MethodLeadInput = z.infer<typeof methodLeadSchema>;
export type WebAuditLeadInput = z.infer<typeof webAuditLeadSchema>;
export type WebAuditGuideLeadInput = z.infer<typeof webAuditGuideLeadSchema>;
