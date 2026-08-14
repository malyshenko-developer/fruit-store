"use client";

import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/shared/ui/collapsible";
import { Slider } from "@/shared/ui/slider";
import { cn } from "@/shared/lib/utils";

import { useRangeFilter } from "../model/useRangeFilter";

interface Props {
  minParam: string;
  maxParam: string;
  label: string;
  absoluteMin: number;
  absoluteMax: number;
}

export function RangeFilter({ minParam, maxParam, label, absoluteMin, absoluteMax }: Props) {
  const { min, max, apply } = useRangeFilter(minParam, maxParam);
  const [open, setOpen] = useState(true);

  const [localMin, setLocalMin] = useState(min || String(absoluteMin));
  const [localMax, setLocalMax] = useState(max || String(absoluteMax));

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (localMin !== min || localMax !== max) {
        apply(localMin, localMax);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [localMin, localMax, min, max, apply]);

  const sliderValue: [number, number] = [
    Number(localMin) || absoluteMin,
    Number(localMax) || absoluteMax,
  ];

  function handleSliderChange(value: number | readonly number[]) {
    if (Array.isArray(value)) {
      setLocalMin(String(value[0]));
      setLocalMax(String(value[1]));
    }
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
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex-1 min-w-0 flex items-center gap-1.5 bg-surface-hover rounded-xl px-3 py-2.5">
            <span className="text-sm text-muted-foreground shrink-0">от</span>
            <input
              type="text"
              inputMode="numeric"
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value.replace(/\D/g, ""))}
              onBlur={() => apply(localMin, localMax)}
              className="flex-1 min-w-0 w-full bg-transparent border-none outline-none text-foreground text-[15px]"
            />
          </div>
          <span className="text-muted-foreground text-[15px]">–</span>
          <div className="flex-1 min-w-0 flex items-center gap-1.5 bg-surface-hover rounded-xl px-3 py-2.5">
            <span className="text-sm text-muted-foreground shrink-0">до</span>
            <input
              type="text"
              inputMode="numeric"
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value.replace(/\D/g, ""))}
              onBlur={() => apply(localMin, localMax)}
              className="flex-1 min-w-0 w-full bg-transparent border-none outline-none text-foreground text-[15px]"
            />
          </div>
        </div>

        <div className="mb-1 px-2.5 py-2">
          <Slider
            min={absoluteMin}
            max={absoluteMax}
            value={sliderValue}
            onValueChange={handleSliderChange}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
