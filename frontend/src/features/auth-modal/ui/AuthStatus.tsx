"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, User } from "lucide-react";

import { useMe } from "@/entities/auth";

import { Button } from "@/shared/ui/button";

import { AuthModal } from "./AuthModal";

export function AuthStatus() {
  const [isModalOpen, setModalOpen] = useState(false);
  const { data: me, isLoading, isError } = useMe();

  if (isLoading) {
    return null;
  }

  if (me && !isError) {
    return (
      <Button variant="default" size="icon" render={<Link href="/profile" />}>
        <User className="size-[22px]" strokeWidth={2} />
      </Button>
    );
  }

  return (
    <>
      <Button variant="outline" size="icon" onClick={() => setModalOpen(true)}>
        <LogIn className="size-[20px]" />
      </Button>
      {isModalOpen && <AuthModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
