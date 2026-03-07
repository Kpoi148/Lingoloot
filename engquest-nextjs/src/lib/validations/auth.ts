// Shared validation schema for auth-related form and API payloads.
import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Email is invalid.").max(320),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, "Token is required."),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters.")
      .max(72, "Password must be at most 72 characters."),
    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .refine((input) => input.password === input.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
