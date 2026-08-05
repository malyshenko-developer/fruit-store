"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

import { useSearchProducts } from "@/entities/product";

import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";

export function SearchInput() {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const debouncedQuery = useDebouncedValue(query, 400);
    const containerRef = useRef<HTMLDivElement>(null);

    const { data, isLoading } = useSearchProducts(debouncedQuery);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsFocused(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const showResults = isFocused && debouncedQuery.trim().length > 0;

    return (
        <div ref={containerRef} className="relative">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="Search products..."
                className="border rounded px-3 py-2 text-sm w-64 bg-white text-black placeholder:text-gray-400"
            />

            {showResults && (
                <div className="absolute top-full left-0 mt-1 w-96 bg-white border rounded shadow-lg p-4 z-50">
                    {isLoading && <p className="text-sm text-gray-500">Searching...</p>}

                    {!isLoading && data && (
                        <>
                            <p className="text-sm font-semibold mb-2">Товары ({data.total})</p>
                            {data.items.length === 0 ? (
                                <p className="text-sm text-gray-500">Ничего не найдено.</p>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    {data.items.map((item) => (
                                        <Link
                                            key={item.variant_id}
                                            href={`/products/${item.product_id}`}
                                            className="text-sm hover:underline"
                                            onClick={() => setIsFocused(false)}
                                        >
                                            <p className="truncate">{item.name}</p>
                                            <p className="font-bold">${item.price}</p>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}