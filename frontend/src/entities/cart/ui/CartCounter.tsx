"use client";

import {useCart} from "../model/useCart";

export function CartCounter() {
    const { data: cart } = useCart()

    const count = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

    if (count === 0) {
        return null
    }

    return (
        <span className={"ml-1 text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5"}>
            {count}
        </span>
    )
}