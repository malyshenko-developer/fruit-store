"use client";

import {ReactNode} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/features/logout";

const tabs = [
    { href: "/profile", label: "Профиль" },
    { href: "/profile/orders", label: "Мои заказы" },
    { href: "/profile/favorites", label: "Избранное" },
];

export default function ProfileLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Личный кабинет</h1>

            <div className="flex gap-8">
                <aside className="w-48 shrink-0 flex flex-col gap-2">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`px-3 py-2 rounded text-sm ${
                                pathname === tab.href ? "bg-gray-100 font-semibold" : ""
                            }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                    <LogoutButton />
                </aside>

                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
}