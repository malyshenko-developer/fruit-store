"use client";

import {ChangeEvent} from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const options = [
    { value: "", label: "Newest" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
];

export function SortSelect() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentSortBy = searchParams.get("sort_by") ?? "";
    const currentOrder = searchParams.get("order") ?? "";
    const currentValue = currentSortBy ? `${currentSortBy}-${currentOrder}` : "";

    function handleChange(e: ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;
        const params = new URLSearchParams(searchParams.toString());

        if (!value) {
            params.delete("sort_by");
            params.delete("order");
        } else {
            const [sortBy, order] = value.split("-");
            params.set("sort_by", sortBy);
            params.set("order", order);
        }

        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <select value={currentValue} onChange={handleChange} className="border rounded px-2 py-1">
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}