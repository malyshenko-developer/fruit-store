"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { searchProducts } from "../api/getProducts";

export function useSearchProducts(query: string) {
  return useInfiniteQuery({
    queryKey: ["search", query],
    queryFn: ({ pageParam }) => searchProducts(query, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.total_pages) {
        return undefined;
      }
      return lastPage.page + 1;
    },
    enabled: query.trim().length > 0,
  });
}
