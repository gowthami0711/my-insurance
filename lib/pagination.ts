export type PaginationItem = number | "...";

/** Returns page numbers and ellipses for compact pagination UI (max 7 slots). */
export function getPaginationRange(
  current: number,
  total: number,
): PaginationItem[] {
  if (total <= 7) {
    const pages: number[] = new Array(total);
    for (let i = 0; i < total; i++) pages[i] = i + 1;
    return pages;
  }

  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
}
