"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";

import { getVariantLabel, useSearchProducts } from "@/entities/product";

import { Input } from "@/shared/ui/input";
import { Skeleton } from "@/shared/ui/skeleton";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";

import { SearchResultSkeleton } from "./SearchResultSkeleton";

export function SearchInput() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 400);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchProducts(debouncedQuery);

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

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(el);

    return () => observer.disconnect();
  }, [handleObserver, showResults]);

  const items = data?.pages.flatMap((page) => page.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  return (
    <div ref={containerRef} className="relative flex-1 max-w-[380px]">
      <Search
        size={20}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder="Поиск iPhone, Mac, Watch..."
        className="pl-10"
      />

      {showResults && (
        <div className="absolute top-full left-0 mt-2 max-w-[420px] w-full max-h-[420px] overflow-y-auto scrollbar-hide bg-surface border border-border rounded-[20px] shadow-lg p-2.5 z-60">
          {isLoading && (
            <div className="flex flex-col gap-0.5">
              <Skeleton className="h-3 w-24 mt-1 mx-2.5 mb-1.5" />
              {Array.from({ length: 4 }).map((_, i) => (
                <SearchResultSkeleton key={i} />
              ))}
            </div>
          )}

          {!isLoading && data && (
            <>
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 px-3 text-center">
                  Ничего не найдено.
                </p>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground mt-1 mx-2.5 mb-1.5">
                    Товары ({total})
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {items.map((item) => {
                      const mainImage = item.images?.[0]?.url;

                      return (
                        <Link
                          key={item.variant_id}
                          href={`/products/${item.product_id}`}
                          className="flex items-center gap-3 py-2 px-[18px] -mx-2.5 hover:bg-white/5 transition-colors"
                          onClick={() => setIsFocused(false)}
                        >
                          <div className="w-12 h-12 shrink-0 rounded-[10px] overflow-hidden bg-background relative">
                            {mainImage && (
                              <Image
                                src={mainImage}
                                alt={item.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {getVariantLabel(item, item.category_slug)}
                            </p>
                            <p className="text-[13px] text-muted-foreground">{item.price}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  {hasNextPage && (
                    <div ref={loadMoreRef}>{isFetchingNextPage && <SearchResultSkeleton />}</div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
