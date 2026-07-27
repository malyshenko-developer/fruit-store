"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { codeSchema, type CodeFormValues } from "../../model/schemas";

interface Props {
    email: string;
    onSuccess: () => void;
    onError: (message: string) => void;
    verifyCode: (email: string, code: string) => Promise<void>;
    serverError: string | null;
}

export function CodeStep({ email, onSuccess, onError, verifyCode, serverError }: Props) {
    const form = useForm<CodeFormValues>({ resolver: zodResolver(codeSchema) });

    async function handleSubmit(values: CodeFormValues) {
        try {
            await verifyCode(email, values.code);
            onSuccess();
        } catch {
            onError("Invalid or expired code.");
        }
    }

    return (
        <form onSubmit={form.handleSubmit(handleSubmit)}>
            <h2 className="text-lg font-bold mb-4">Enter the code</h2>
            <p className="text-sm text-gray-500 mb-2">Sent to {email}</p>
            <input
                {...form.register("code")}
                type="text"
                placeholder="123456"
                className="border rounded px-3 py-2 w-full mb-1 bg-white text-black placeholder:text-gray-400"
            />
            {form.formState.errors.code && (
                <p className="text-red-500 text-sm mb-2">{form.formState.errors.code.message}</p>
            )}
            {serverError && <p className="text-red-500 text-sm mb-2">{serverError}</p>}
            <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="border rounded px-4 py-2 w-full mt-2 disabled:opacity-50"
            >
                {form.formState.isSubmitting ? "Verifying..." : "Verify"}
            </button>
        </form>
    );
}