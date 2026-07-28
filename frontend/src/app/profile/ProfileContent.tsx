"use client";

import { LogoutButton } from "@/features/logout";

import {useMe} from "@/entities/auth";

export function ProfileContent() {
    const { data: me, isLoading } = useMe();

    if (isLoading || !me) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <p className="text-gray-500 mb-6">{me.email}</p>
            <LogoutButton />
        </div>
    );
}