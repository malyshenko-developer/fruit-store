const MAX_VISIBLE_WITHOUT_ELLIPSIS = 7;
const ELLIPSIS_THRESHOLD = 3;

export function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= MAX_VISIBLE_WITHOUT_ELLIPSIS) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > ELLIPSIS_THRESHOLD) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
}
