"use client";

import {useState, type SubmitEventHandler} from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface Props {
    onSuccess: () => void;
}

export function PaymentForm({ onSuccess }: Props) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setError(null);

        const { error: confirmError } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (confirmError) {
            setError(confirmError.message ?? "Payment failed. Please try again.");
            setIsProcessing(false);
            return;
        }

        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="border rounded px-4 py-2 w-full disabled:opacity-50"
            >
                {isProcessing ? "Processing..." : "Pay now"}
            </button>
        </form>
    );
}