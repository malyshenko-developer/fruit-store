"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { emailSchema, type EmailFormValues } from "../../model/schemas";

interface Props {
    onSuccess: (email: string) => void;
    onError: (message: string) => void;
    requestCode: (email: string) => Promise<void>;
    serverError: string | null;
}

export function EmailStep({ onSuccess, onError, requestCode, serverError }: Props) {
    const form = useForm<EmailFormValues>({ resolver: zodResolver(emailSchema) });

    async function handleSubmit(values: EmailFormValues) {
        try {
            await requestCode(values.email);
            onSuccess(values.email);
        } catch {
            onError("Failed to send code. Please try again.");
        }
    }

    return (
        <>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
            <h2 className="text-lg font-bold mb-4">Log in</h2>
            <input
                {...form.register("email")}
                type="email"
                placeholder="your@email.com"
                className="border rounded px-3 py-2 w-full mb-1 bg-white text-black placeholder:text-gray-400"
            />
            {form.formState.errors.email && (
                <p className="text-red-500 text-sm mb-2">{form.formState.errors.email.message}</p>
            )}
            {serverError && <p className="text-red-500 text-sm mb-2">{serverError}</p>}
            <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="border rounded px-4 py-2 w-full mt-2 disabled:opacity-50"
            >
                {form.formState.isSubmitting ? "Sending..." : "Send code"}
            </button>
        </form>

        <div className="mt-4 pt-4 border-t">
            <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/auth/yandex/login`}
                className="block text-center border rounded px-4 py-2 text-sm"
            >
            Continue with Yandex
        </a>
        </div>
</>
    );
}