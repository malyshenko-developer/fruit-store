"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMe } from "./useMe";

export function useRequireAuth() {
    const router = useRouter();
    const { data: me, isLoading, isError } = useMe();

    useEffect(() => {
        if (!isLoading && (isError || !me)) {
            router.push("/access-denied");
        }
    }, [isLoading, isError, me, router]);

    return { me, isLoading };
}