"use client";

import { useState, useEffect } from "react";
import { useRangeFilter } from "../model/useRangeFilter";

interface Props {
    minParam: string;
    maxParam: string;
    label: string;
    unit?: string;
}

export function RangeFilter({ minParam, maxParam, label, unit }: Props) {
    const { min, max, apply } = useRangeFilter(minParam, maxParam);

    const [localMin, setLocalMin] = useState(min);
    const [localMax, setLocalMax] = useState(max);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (localMin !== min || localMax !== max) {
                apply(localMin, localMax);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [localMin, localMax]);

    return (
        <div className="space-y-1">
            <p className="text-sm font-semibold">
                {label} {unit ? `(${unit})` : ""}
            </p>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    value={localMin}
                    onChange={(e) => setLocalMin(e.target.value)}
                    placeholder="Min"
                    className="border rounded px-2 py-1 w-16 text-sm"
                />
                <span>–</span>
                <input
                    type="number"
                    value={localMax}
                    onChange={(e) => setLocalMax(e.target.value)}
                    placeholder="Max"
                    className="border rounded px-2 py-1 w-16 text-sm"
                />
            </div>
        </div>
    );
}