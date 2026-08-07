"use client";

import { useCart } from "../model/useCart";

const MAX_DISPLAYED_COUNT = 99;

export function CartCounter() {
  const { data: cart } = useCart();

  const count = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  if (count === 0) {
    return null;
  }

  const displayCount = count > MAX_DISPLAYED_COUNT ? `${MAX_DISPLAYED_COUNT}+` : count;

  return (
    <span className="absolute -top-0.5 right-0 translate-x-[35%] flex items-center justify-center min-w-[16px] h-[16px] px-[3px] text-[10px] font-bold bg-primary text-primary-foreground rounded-full">
      {displayCount}
    </span>
  );
}
