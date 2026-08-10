"use client";

import { useAddToCart } from "@/entities/cart";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface Props {
  variantId: number;
  price?: number;
  className?: string;
}

export function AddToCartButton({ variantId, price, className }: Props) {
  const { mutate, isPending, isSuccess } = useAddToCart();

  const handleClick = () => {
    mutate({ variantId, quantity: 1 });
  };

  const label = isPending
    ? "Добавляем..."
    : isSuccess
      ? "Добавлено!"
      : price
        ? `Добавить в корзину — $${price.toLocaleString("en-US")}`
        : "Добавить в корзину";

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      className={cn("w-full rounded-full font-semibold", className)}
    >
      {label}
    </Button>
  );
}
