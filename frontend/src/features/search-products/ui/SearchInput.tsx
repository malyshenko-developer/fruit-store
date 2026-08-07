"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

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
        <div ref={containerRef} className="relative flex-1 max-w-[380px]">
          <Search
            size={20}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="Поиск iPhone, Mac, Watch..."
                className="w-full bg-surface border border-border text-foreground py-2.5 pr-3.5 pl-10 rounded-full text-sm outline-none"
            />

            {showResults && (
                <div className="absolute top-full left-0 mt-2 max-w-[420px] w-full bg-surface border border-border rounded-[20px] shadow-lg p-2.5 z-60 overflow-y-auto">
                    {isLoading && <p className="text-sm text-muted-foreground text-center py-4 px-3">Ищем...</p>}

                    {!isLoading && data && (
                        <>
                            {data.items.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 px-3 text-center">Ничего не найдено.</p>
                            ) : (
                              <>
                                <p className="text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground mt-1 mx-2.5 mb-1.5">
                                  Товары ({data.total})
                                </p>
                                <div className="flex flex-col gap-0.5">
                                  {data.items.map((item) => {
                                    const mainImage = item.images?.[0]?.url;

                                    return (
                                      <Link
                                        key={item.variant_id}
                                        href={`/products/${item.product_id}`}
                                        className="flex items-center gap-3 p-2 rounded-[14px] hover:bg-white/5 transition-colors"
                                        onClick={() => setIsFocused(false)}
                                      >
                                        <div className="w-12 h-12 shrink-0 rounded-[10px] overflow-hidden bg-background">
                                          {mainImage && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={mainImage} alt={item.name} className="w-full h-full object-cover" />
                                          )}
                                        </div>

                                        <div className="flex-1">
                                          <p className="text-sm font-semibold truncate">{item.name}</p>
                                          <p className="text-[13px] text-muted-foreground">{item.price}</p>
                                        </div>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}