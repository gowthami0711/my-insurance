"use client";

import { memo, useMemo } from "react";
import { getPaginationRange } from "@/lib/pagination";

type Props = {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
};

export const CustomersPagination = memo(function CustomersPagination({
  page,
  totalPages,
  total,
  onPageChange,
}: Props) {
  const range = useMemo(
    () => getPaginationRange(page, totalPages),
    [page, totalPages],
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 text-xs text-[#b5b7c0]">
      <p>
        Showing page {page} of {totalPages} ({total} entries)
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="grid h-6 w-6 place-items-center rounded-md border border-[#eeeeee] bg-[#f5f5f5] text-[#404b52] disabled:opacity-40"
        >
          {"<"}
        </button>

        {range.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-1 text-xs text-[#b5b7c0]">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`grid h-6 w-6 place-items-center rounded-md border text-xs ${
                p === page
                  ? "border-[#5932ea] bg-[#5932ea] text-white"
                  : "border-[#eeeeee] bg-[#f5f5f5] text-[#404b52]"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="grid h-6 w-6 place-items-center rounded-md border border-[#eeeeee] bg-[#f5f5f5] text-[#404b52] disabled:opacity-40"
        >
          {">"}
        </button>
      </div>
    </div>
  );
});
