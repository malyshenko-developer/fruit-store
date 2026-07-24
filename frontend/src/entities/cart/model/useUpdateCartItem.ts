"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCartItemQuantity } from "../api/cartApi";
import {CartSummary} from "./types";

interface UpdateParams {
    variantId: number;
    quantity: number;
}

export function useUpdateCartItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ variantId, quantity }: UpdateParams) =>
            updateCartItemQuantity(variantId, quantity),
        onMutate: async ({ variantId, quantity }: UpdateParams) => {
            await queryClient.cancelQueries({ queryKey: ["cart"] });

            const previousCart = queryClient.getQueryData<CartSummary>(["cart"]);

            if (previousCart) {
                const updatedItems = previousCart.items.map((item) =>
                    item.variant_id === variantId
                        ? { ...item, quantity, subtotal: item.price * quantity }
                        : item
                );
                const updatedTotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);

                queryClient.setQueryData<CartSummary>(["cart"], {
                    items: updatedItems,
                    total: updatedTotal,
                });
            }

            return { previousCart };
        },

        onError: (_err, _variables, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(["cart"], context.previousCart);
            }
        },

        onSettled: () => {
            return queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });
}