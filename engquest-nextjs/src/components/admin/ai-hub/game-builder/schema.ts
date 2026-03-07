// Validation schema and defaults for the admin AI game builder.
import { z } from "zod";

export const ContentItemSchema = z
  .object({
    text: z.string(),
    type: z.enum(["text", "gap"]),
    answer: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    // Gap entries must carry the expected answer because preview and gameplay both depend on it.
    if (value.type === "gap" && !value.answer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "answer is required when type is 'gap'",
      });
    }
  });

export const GameSchema = z.object({
  title: z.string(),
  content: z.array(ContentItemSchema),
  distractors: z.array(z.string()),
});

export const formatIssues = (issues: z.ZodIssue[]) =>
  issues.map((issue) => issue.message).join(" | ");
