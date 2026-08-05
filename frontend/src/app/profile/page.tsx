"use client";

import { useRequireAuth } from "@/entities/auth";

export default function ProfilePage() {
    const { me, isLoading } = useRequireAuth();

    if (isLoading || !me) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">Профиль</h2>
            <p className="text-gray-500">{me.email}</p>
        </div>
    );
}