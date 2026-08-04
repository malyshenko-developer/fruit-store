"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";

import { CheckoutForm } from "@/features/checkout-form";
import { PaymentForm } from "@/features/stripe-payment";
import type { CheckoutFormValues } from "@/features/checkout-form";

import { createPaymentIntent } from "@/entities/checkout";

import { stripePromise } from "@/shared/api/stripeClient";

export default function CheckoutPage() {
    const router = useRouter();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleFormSubmit(values: CheckoutFormValues) {
        setIsSubmitting(true);
        setError(null);

        try {
            const result = await createPaymentIntent({
                email: values.email,
                fullName: values.fullName,
                shippingAddress: values.shippingAddress,
            });
            setClientSecret(result.client_secret);
        } catch {
            setError("Failed to start checkout. Please check your cart and try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    function handlePaymentSuccess() {
        router.push("/checkout/success");
    }

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            {!clientSecret && (
                <>
                    <CheckoutForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </>
            )}

            {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm onSuccess={handlePaymentSuccess} />
                </Elements>
            )}
        </div>
    );
}