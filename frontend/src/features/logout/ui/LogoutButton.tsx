"use client";

import { useLogout } from "@/entities/auth";

export function LogoutButton() {
    const { mutate, isPending } = useLogout();

    return (
        <button
            onClick={() => mutate()}
            disabled={isPending}
            className="border rounded px-4 py-2 text-sm disabled:opacity-50"
        >
            {isPending ? "Logging out..." : "Log out"}
        </button>
    );
}