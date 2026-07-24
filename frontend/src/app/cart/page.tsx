"use client"

import {CartItemRow} from "@/features/manage-cart-items";

import {useCart} from "@/entities/cart";

export default function CartPage() {
    const {data: cart, isLoading, isError} = useCart()

    if (isLoading) {
        return <div className="p-8">Loading cart...</div>;
    }

    if (isError || !cart) {
        return <div className="p-8">Failed to load cart.</div>;
    }

    if (cart.items.length === 0) {
        return <div className="p-8">Your cart is empty.</div>;
    }

    return (
        <div className="p-8 max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">Cart</h1>

            <div className="space-y-4">
                {cart.items.map((item) => (
                    <CartItemRow key={item.variant_id} item={item} />
                ))}
            </div>

            <div className="mt-6 pt-4 border-t flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${cart.total}</span>
            </div>
        </div>
    );
}