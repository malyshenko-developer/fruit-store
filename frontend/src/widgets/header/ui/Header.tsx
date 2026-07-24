import Link from "next/link";

import {CartCounter} from "@/entities/cart";

export function Header() {
    return (
        <header className="border-b p-4 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl">
                Fruit Store
            </Link>
            <Link href="/cart" className="text-sm">
                Cart
                <CartCounter />
            </Link>
        </header>
    );
}