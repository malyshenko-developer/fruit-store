"use client";

import { useState } from "react";

import type { CartItem } from "@/entities/cart";
import { useUpdateCartItem, useRemoveCartItem } from "@/entities/cart";

interface Props {
    item: CartItem;
}

export function CartItemRow({ item }: Props) {
    const updateMutation = useUpdateCartItem();
    const removeMutation = useRemoveCartItem();

    function handleQuantityChange(newQuantity: number) {
        if (newQuantity < 1) return;
        updateMutation.mutate({ variantId: item.variant_id, quantity: newQuantity });
    }

    function handleRemove() {
        removeMutation.mutate(item.variant_id);
    }

    return (
        <div className="flex items-center gap-4 border rounded p-4">
            <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">${item.price} each</p>
            </div>

            <div className="flex items-center gap-2">
                <button onClick={() => handleQuantityChange(item.quantity - 1)} className="border rounded px-2">
                    -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.quantity + 1)} className="border rounded px-2">
                    +
                </button>
            </div>

            <p className="font-bold w-20 text-right">${item.subtotal}</p>

            <button onClick={handleRemove} className="text-red-500 text-sm">
                Remove
            </button>
        </div>
    );
}