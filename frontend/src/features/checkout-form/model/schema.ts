import { z } from "zod";

export const checkoutSchema = z.object({
    email: z.email("Enter a valid email address"),
    fullName: z.string().min(2, "Enter your full name"),
    shippingAddress: z.string().min(5, "Enter a valid shipping address"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;