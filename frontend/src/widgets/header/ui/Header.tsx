import Link from "next/link";

import { AuthStatus } from "@/features/auth-modal";
import { SearchInput } from "@/features/search-products";

import { CartCounter } from "@/entities/cart";

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[60px] py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-xl flex items-center gap-2 tracking-[-0.02em] hover:opacity-75 transition-opacity"
        >
          <div className="relative w-[34px] h-[34px] flex-shrink-0">
            <div
              className="absolute"
              style={{
                inset: "2px 1px 0 1px",
                bottom: "1px",
                borderRadius: "48% 48% 52% 52%",
                background: "#4a90f4",
              }}
            />
            <div
              className="absolute"
              style={{
                top: "-3px",
                left: "15px",
                width: "5px",
                height: "9px",
                borderRadius: "3px",
                background: "#94a3b8",
                transform: "rotate(-20deg)",
              }}
            />
            <div
              className="absolute"
              style={{
                top: "-4px",
                left: "18px",
                width: "12px",
                height: "8px",
                borderRadius: "0 60% 60% 60%",
                background: "#4a90f4",
                transform: "rotate(-15deg)",
              }}
            />
            <div
              className="absolute"
              style={{
                top: "13px",
                left: "5px",
                width: "8px",
                height: "10px",
                borderRadius: "50%",
                background: "#0f1420",
                opacity: 0.35,
              }}
            />
          </div>
          Fruit Store
        </Link>
        <SearchInput />
        <div className="flex items-center gap-2">
          <AuthStatus />
          <Link href="/cart" className="text-sm flex items-center">
            Cart
            <CartCounter />
          </Link>
        </div>
      </div>
    </header>
  );
}
