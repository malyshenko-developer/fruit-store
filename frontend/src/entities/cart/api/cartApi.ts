import {CartSummary} from "../model/types";
import {apiFetch} from "@/shared/api/client";

export async function getCart(): Promise<CartSummary> {
    return apiFetch<CartSummary>("/cart")
}

export async function addToCart(variantId: number, quantity: number): Promise<void> {
    await apiFetch<void>("/cart/items", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({variant_id: variantId, quantity}),
    })
}

export async function updateCartItemQuantity(variantId: number, quantity: number): Promise<void> {
    await apiFetch<void>("/cart/items", {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({quantity}),
    })
}

export async function removeFromCart(variantId: number): Promise<void> {
    await apiFetch<void>(`/cart/items/${variantId}`, {
        method: "DELETE",
    });
}