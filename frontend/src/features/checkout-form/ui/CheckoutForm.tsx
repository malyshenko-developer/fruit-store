"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { checkoutSchema, type CheckoutFormValues } from "../model/schema";

interface Props {
    onSubmit: (values: CheckoutFormValues) => void;
    isSubmitting: boolean;
}

export function CheckoutForm({ onSubmit, isSubmitting }: Props) {
    const form = useForm<CheckoutFormValues>({ resolver: zodResolver(checkoutSchema) });

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div>
                <input
                    {...form.register("email")}
                    type="email"
                    placeholder="Email"
                    className="border rounded px-3 py-2 w-full bg-white text-black placeholder:text-gray-400"
                />
                {form.formState.errors.email && (
                    <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                )}
            </div>

            <div>
                <input
                    {...form.register("fullName")}
                    type="text"
                    placeholder="Full name"
                    className="border rounded px-3 py-2 w-full bg-white text-black placeholder:text-gray-400"
                />
                {form.formState.errors.fullName && (
                    <p className="text-red-500 text-sm">{form.formState.errors.fullName.message}</p>
                )}
            </div>

            <div>
                <input
                    {...form.register("shippingAddress")}
                    type="text"
                    placeholder="Shipping address"
                    className="border rounded px-3 py-2 w-full bg-white text-black placeholder:text-gray-400"
                />
                {form.formState.errors.shippingAddress && (
                    <p className="text-red-500 text-sm">{form.formState.errors.shippingAddress.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="border rounded px-4 py-2 w-full disabled:opacity-50"
            >
                {isSubmitting ? "Processing..." : "Continue to payment"}
            </button>
        </form>
    );
}