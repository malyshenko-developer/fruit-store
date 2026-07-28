"use client";

import {useRouter} from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logout } from "../api/authApi";

export function useLogout() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["me"] });
            router.push("/");
        },
        onError: (err) => {
            console.log("logout onError", err);
        },
    });
}