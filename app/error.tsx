"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f6fa]">
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-[#202224]">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-[#acacac]">
          {error.message ?? "An unexpected error occurred"}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl bg-[#5932ea] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4a28d1] transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}