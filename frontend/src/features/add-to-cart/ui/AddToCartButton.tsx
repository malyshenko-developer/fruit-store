"use client";

import { useAddToCart } from "@/entities/cart";

interface Props {
    variantId: number;
}

export function AddToCartButton({ variantId }: Props) {
    const { mutate, isPending, isSuccess } = useAddToCart();

    const handleClick = () => {
        mutate({ variantId, quantity: 1 });
    }

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className="border rounded px-4 py-2 text-sm disabled:opacity-50"
        >
            {isPending ? "Adding..." : isSuccess ? "Added!" : "Add to Cart"}
        </button>
    );
}