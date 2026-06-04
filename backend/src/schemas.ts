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

export type DiagnosticLeadInput = z.infer<typeof diagnosticLeadSchema>;
export type MethodLeadInput = z.infer<typeof methodLeadSchema>;
