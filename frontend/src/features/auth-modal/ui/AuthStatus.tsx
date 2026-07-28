"use client";

import { useState } from "react";
import Link from "next/link";

import { useMe } from "@/entities/auth";

import { AuthModal } from "./AuthModal";

export function AuthStatus() {
    const [isModalOpen, setModalOpen] = useState(false);
    const { data: me, isLoading, isError } = useMe();

    if (isLoading) {
        return null;
    }

    if (me && !isError) {
        return (
            <Link href="/profile" className="text-sm">
                {me.email}
            </Link>
        );
    }

    return (
        <>
            <button onClick={() => setModalOpen(true)} className="text-sm">
                Log in
            </button>
            {isModalOpen && <AuthModal onClose={() => setModalOpen(false)} />}
        </>
    );
}