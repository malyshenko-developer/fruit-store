"use client";

import { useAddToCart } from "@/entities/cart";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface Props {
  variantId: number;
  price?: number;
  inStock?: boolean;
  className?: string;
}

export function AddToCartButton({ variantId, price, inStock = true, className }: Props) {
  const { mutate, isPending, isSuccess } = useAddToCart();

  function handleClick() {
    mutate({ variantId, quantity: 1 });
  }

  if (!inStock) {
    return (
      <Button
        disabled
        className={cn(
          "w-full rounded-full py-[18px] text-[17px] bg-surface-hover text-muted-foreground",
          className,
        )}
      >
        Нет в наличии
      </Button>
    );
  }

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
      className={cn("w-full rounded-full", className)}
    >
      {label}
    </Button>
  );
}
