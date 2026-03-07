// Shared validation schema for learner profile and user payloads.
import { z } from "zod";

export const userProfileSchema = z.object({
    displayName: z
        .string()
        .min(2, "Tên hiển thị phải có ít nhất 2 ký tự.")
        .max(30, "Tên hiển thị không được quá 30 ký tự.")
        .optional(),
    bio: z.string().max(160, "Tiểu sử không được quá 160 ký tự.").optional(),
    avatarUrl: z.string().url("URL ảnh không hợp lệ.").optional().or(z.literal("")),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;
