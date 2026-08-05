"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { trackOrderSchema, type TrackOrderFormValues } from "../model/schema";

interface Props {
    onSubmit: (values: TrackOrderFormValues) => void;
    isSubmitting: boolean;
}

export function TrackOrderForm({ onSubmit, isSubmitting }: Props) {
    const form = useForm<TrackOrderFormValues>({ resolver: zodResolver(trackOrderSchema) });

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div>
                <input
                    {...form.register("orderNumber")}
                    type="text"
                    placeholder="Номер заказа (например, FS-123456)"
                    className="border rounded px-3 py-2 w-full bg-white text-black placeholder:text-gray-400"
                />
                {form.formState.errors.orderNumber && (
                    <p className="text-red-500 text-sm">{form.formState.errors.orderNumber.message}</p>
                )}
            </div>

            <div>
                <input
                    {...form.register("email")}
                    type="email"
                    placeholder="Email, указанный при заказе"
                    className="border rounded px-3 py-2 w-full bg-white text-black placeholder:text-gray-400"
                />
                {form.formState.errors.email && (
                    <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="border rounded px-4 py-2 w-full disabled:opacity-50"
            >
                {isSubmitting ? "Ищем..." : "Найти заказ"}
            </button>
        </form>
    );
}