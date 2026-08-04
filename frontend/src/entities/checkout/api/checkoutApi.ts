import { apiFetch } from "@/shared/api/client";

import type { CreatePaymentIntentInput, CreatePaymentIntentResponse } from "../model/types";

export async function createPaymentIntent(input: CreatePaymentIntentInput): Promise<CreatePaymentIntentResponse> {
    return apiFetch<CreatePaymentIntentResponse>("/checkout/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: input.email,
            full_name: input.fullName,
            shipping_address: input.shippingAddress,
        }),
    });
}