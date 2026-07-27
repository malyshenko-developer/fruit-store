import Link from "next/link";

import {AuthStatus} from "@/features/auth-modal";

import {CartCounter} from "@/entities/cart";

export function Header() {
    return (
        <header className="border-b p-4 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl">
                Fruit Store
            </Link>
            <div className="flex items-center gap-4">
                <AuthStatus />
                <Link href="/cart" className="text-sm flex items-center">
                    Cart
                    <CartCounter />
                </Link>
            </div>
        </header>
    );
}