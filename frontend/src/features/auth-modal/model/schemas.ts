import { z } from "zod";

export const emailSchema = z.object({
    email: z.string().email("Enter a valid email address"),
});

export const codeSchema = z.object({
    code: z.string().length(6, "Code must be 6 digits").regex(/^\d+$/, "Code must contain only digits"),
});

export type EmailFormValues = z.infer<typeof emailSchema>;
export type CodeFormValues = z.infer<typeof codeSchema>;