"use client";

import { useQuery } from "@tanstack/react-query";

import { getCart } from "../api/cartApi";

export function useCart() {
    return useQuery({
        queryKey: ["cart"],
        queryFn: getCart,
    });
}