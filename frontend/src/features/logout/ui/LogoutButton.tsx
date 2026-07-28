"use client";

import { useQueryClient } from "@tanstack/react-query";

import { logout } from "@/entities/auth";

export function LogoutButton() {
    const queryClient = useQueryClient();

    async function handleLogout() {
        await logout();
        await queryClient.invalidateQueries({ queryKey: ["me"] });
    }

    return (
        <button onClick={handleLogout} className="border rounded px-4 py-2 text-sm">
            Log out
        </button>
    );
}