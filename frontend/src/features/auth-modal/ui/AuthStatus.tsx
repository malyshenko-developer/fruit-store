"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, User } from "lucide-react";

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
      <Link
        href="/profile"
        className="size-10 rounded-full flex items-center justify-center bg-accent border border-accent"
      >
        <User size={26} strokeWidth={2} />
      </Link>
    );
  }

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="size-10 rounded-full flex items-center justify-center border border-border"
      >
        <LogIn size={22} />
      </button>
      {isModalOpen && <AuthModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
