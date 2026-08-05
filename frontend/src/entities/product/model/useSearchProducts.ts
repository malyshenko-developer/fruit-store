"use client";

import { useQuery } from "@tanstack/react-query";

import { searchProducts } from "../api/getProducts";

export function useSearchProducts(query: string) {
    return useQuery({
        queryKey: ["search", query],
        queryFn: () => searchProducts(query),
        enabled: query.trim().length > 0,
    });
}