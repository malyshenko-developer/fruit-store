import { apiFetch } from "@/shared/api/client";

import type { Me } from "../model/types";

export async function requestCode(email: string): Promise<void> {
    await apiFetch<void>("/auth/email/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
}

export async function verifyCode(email: string, code: string): Promise<void> {
    await apiFetch<void>("/auth/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
    });
}

export async function getMe(): Promise<Me> {
    return apiFetch<Me>("/auth/me");
}