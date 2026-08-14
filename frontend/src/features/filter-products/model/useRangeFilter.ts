"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function useRangeFilter(minParam: string, maxParam: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const min = searchParams.get(minParam) ?? "";
  const max = searchParams.get(maxParam) ?? "";

  const apply = useCallback(
    (newMin: string, newMax: string) => {
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
    },
    [searchParams, minParam, maxParam, router, pathname],
  );

  return { min, max, apply };
}
