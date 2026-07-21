"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function useRangeFilter(minParam: string, maxParam: string) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const min = searchParams.get(minParam) ?? "";
    const max = searchParams.get(maxParam) ?? "";

    function apply(newMin: string, newMax: string) {
        const params = new URLSearchParams(searchParams.toString());

        if (newMin) {
            params.set(minParam, newMin);
        } else {
            params.delete(minParam);
        }

        if (newMax) {
            params.set(maxParam, newMax);
        } else {
            params.delete(maxParam);
        }

        router.push(`${pathname}?${params.toString()}`);
    }

    return { min, max, apply };
}