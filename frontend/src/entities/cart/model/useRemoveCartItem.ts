"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeFromCart } from "../api/cartApi";
import type { CartSummary } from "./types";

export function useRemoveCartItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variantId: number) => removeFromCart(variantId),

        onMutate: async (variantId: number) => {
            await queryClient.cancelQueries({ queryKey: ["cart"] });

            const previousCart = queryClient.getQueryData<CartSummary>(["cart"]);

            if (previousCart) {
                const updatedItems = previousCart.items.filter((item) => item.variant_id !== variantId);
                const updatedTotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);

                queryClient.setQueryData<CartSummary>(["cart"], {
                    items: updatedItems,
                    total: updatedTotal,
                });
            }

            return { previousCart };
        },

        onError: (_err, _variantId, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(["cart"], context.previousCart);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });
}