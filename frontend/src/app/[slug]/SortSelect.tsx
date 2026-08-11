"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

const options = [
  { value: "newest", label: "Сначала новые" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSortBy = searchParams.get("sort_by") ?? "";
  const currentOrder = searchParams.get("order") ?? "";
  const currentValue = currentSortBy ? `${currentSortBy}-${currentOrder}` : "newest";

  function handleChange(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "newest") {
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
    <Select value={currentValue} onValueChange={handleChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue>
          {() => options.find((opt) => opt.value === currentValue)?.label ?? "Сначала новые"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
