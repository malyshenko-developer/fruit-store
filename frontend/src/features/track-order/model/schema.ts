import { z } from "zod";

export const trackOrderSchema = z.object({
    orderNumber: z.string().min(1, "Enter your order number"),
    email: z.email("Enter a valid email address"),
});

export type TrackOrderFormValues = z.infer<typeof trackOrderSchema>;