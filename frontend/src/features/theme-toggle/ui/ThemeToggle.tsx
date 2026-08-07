"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Сменить тему"
      suppressHydrationWarning
      className="relative w-[52px] h-[30px] rounded-full border border-border bg-surface cursor-pointer p-0"
    >
      <span
        suppressHydrationWarning
        className="absolute top-0.5 w-6 h-6 rounded-full bg-primary transition-[left] duration-200 ease-in-out"
        style={{ left: resolvedTheme === "dark" ? "24px" : "2px" }}
      />
    </button>
  );
}
