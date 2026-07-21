"use client";

import { useAttributeFilter } from "../model/useAttributeFilter";

interface Props {
    paramName: string;
    label: string;
    options: string[];
}

export function AttributeFilter({ paramName, label, options }: Props) {
    const { selected, toggle } = useAttributeFilter(paramName);

    if (options.length === 0) {
        return null;
    }

    return (
        <div className="space-y-1">
            <p className="text-sm font-semibold">{label}</p>
            {options.map((option) => (
                <label key={option} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={selected.includes(option)} onChange={() => toggle(option)} />
                    {option}
                </label>
            ))}
        </div>
    );
}