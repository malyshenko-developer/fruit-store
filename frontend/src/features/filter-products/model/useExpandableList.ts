"use client";

import { useState } from "react";

const DEFAULT_VISIBLE_COUNT = 5;

export function useExpandableList<T>(items: T[], visibleCount = DEFAULT_VISIBLE_COUNT) {
  const [expanded, setExpanded] = useState(false);

  const hasMore = items.length > visibleCount;
  const visibleItems = expanded ? items : items.slice(0, visibleCount);
  const remainingCount = items.length - visibleCount;

  return {
    visibleItems,
    hasMore,
    remainingCount,
    expanded,
    toggleExpand: () => setExpanded((prev) => !prev),
  };
}
