"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/shared/ui/collapsible";
import { Checkbox } from "@/shared/ui/checkbox";
import { cn } from "@/shared/lib/utils";

import { useAttributeFilter } from "../model/useAttributeFilter";
import { useExpandableList } from "../model/useExpandableList";

interface Props {
  paramName: string;
  label: string;
  options: string[];
  colors: Record<string, string>;
}

export function ColorFilter({ paramName, label, options, colors }: Props) {
  const { selected, toggle } = useAttributeFilter(paramName);
  const { visibleItems, hasMore, remainingCount, expanded, toggleExpand } =
    useExpandableList(options);
  const [open, setOpen] = useState(true);

  if (options.length === 0) {
    return null;
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center justify-between gap-2.5 w-full mb-3.5 cursor-pointer">
        <p className="text-base font-bold tracking-[-0.01em]">{label}</p>
        <span className="relative size-5 text-muted-foreground">
          <Plus
            className={cn(
              "absolute inset-0 transition-opacity duration-200",
              open ? "opacity-0" : "opacity-100",
            )}
          />
          <Minus
            className={cn(
              "absolute inset-0 transition-opacity duration-200",
              open ? "opacity-100" : "opacity-0",
            )}
          />
        </span>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="flex flex-col gap-2.5 pb-1">
          {visibleItems.map((option) => {
            const isSelected = selected.includes(option);

            return (
              <label key={option} className="flex items-center gap-2.5 cursor-pointer">
                <Checkbox checked={isSelected} onCheckedChange={() => toggle(option)} />
                <span
                  className="size-[18px] rounded-full shrink-0"
                  style={{
                    backgroundColor: colors[option] ?? "#9ca3af",
                    boxShadow: "inset 0 0 0 1px var(--border)",
                  }}
                />
                <span className="text-[15px] text-foreground">{option}</span>
              </label>
            );
          })}
          {hasMore && (
            <button
              type="button"
              onClick={toggleExpand}
              className="self-start mt-0.5 bg-transparent border-none p-0 text-sm font-semibold text-primary cursor-pointer"
            >
              {expanded ? "Свернуть" : `Показать ещё ${remainingCount}`}
            </button>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
