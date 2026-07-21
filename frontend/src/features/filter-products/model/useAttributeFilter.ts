"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function useAttributeFilter(paramName: string) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const selected = searchParams.getAll(paramName);

    function toggle(value: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(paramName);

        const next = selected.includes(value)
            ? selected.filter((v) => v !== value)
            : [...selected, value];

        for (const v of next) {
            params.append(paramName, v);
        }

        router.push(`${pathname}?${params.toString()}`);
    }

    return { selected, toggle };
}