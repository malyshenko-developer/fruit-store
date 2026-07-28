"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logout } from "../api/authApi";

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            console.log("logout onSuccess fired, invalidating...");
            await queryClient.invalidateQueries({ queryKey: ["me"] });
            console.log("invalidation completed");
        },
        onError: (err) => {
            console.log("logout onError", err);
        },
    });
}