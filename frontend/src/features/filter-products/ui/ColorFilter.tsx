"use client"

import {usePathname, useRouter, useSearchParams} from "next/navigation";

const colors = ["Titanium Black", "Silver", "Black"];

export function ColorFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentColor = searchParams.get("color") ?? "";

    function handleChange(color: string) {
        const params = new URLSearchParams(searchParams.toString());

        if (currentColor === color) {
            params.delete("color");
        } else {
            params.set("color", color);
        }

        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="space-y-1">
            <p className="text-sm font-semibold">Color</p>
            {colors.map((color) => (
                <label key={color} className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={currentColor === color}
                        onChange={() => handleChange(color)}
                    />
                    {color}
                </label>
            ))}
        </div>
    );
}