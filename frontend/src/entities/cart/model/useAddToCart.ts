"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addToCart } from "../api/cartApi";

export function useAddToCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ variantId, quantity }: { variantId: number; quantity: number }) =>
            addToCart(variantId, quantity),
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });
}