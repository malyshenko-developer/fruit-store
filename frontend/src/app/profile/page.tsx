"use client";

import { LogoutButton } from "@/features/logout";

import { useMe } from "@/entities/auth";

export default function ProfilePage() {
    const { data: me, isLoading, isError } = useMe();

    if (isLoading) {
        return <div className="p-8">Loading...</div>;
    }

    if (isError || !me) {
        return <div className="p-8">You need to log in to view this page.</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <p className="text-gray-500 mb-6">{me.email}</p>
            <LogoutButton />
        </div>
    );
}