"use client";

import { useAttributeFilter } from "../model/useAttributeFilter";
import { useExpandableList } from "../model/useExpandableList";

interface Props {
  paramName: string;
  label: string;
  options: string[];
}

export function AttributeFilter({ paramName, label, options }: Props) {
  const { selected, toggle } = useAttributeFilter(paramName);
  const { visibleItems, hasMore, remainingCount, expanded, toggleExpand } =
    useExpandableList(options);

  if (options.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1">
      <p className="text-sm font-semibold">{label}</p>
      {visibleItems.map((option) => (
        <label key={option} className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => toggle(option)}
          />
          {option}
        </label>
      ))}
      {hasMore && (
        <button
          type="button"
          onClick={toggleExpand}
          className="text-sm font-semibold text-primary mt-1"
        >
          {expanded ? "Свернуть" : `Показать ещё ${remainingCount}`}
        </button>
      )}
    </div>
  );
}
