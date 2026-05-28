"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function AdminPagination({
  page,
  totalPages,
  total,
  unit,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  /** Label of the unit, singular form (e.g. "user", "item", "claim"). */
  unit: string;
  onPageChange: (page: number) => void;
}) {
  const unitLabel = total === 1 ? unit : `${unit}s`;

  return (
    <div className="flex items-center justify-between gap-4 px-1 pt-4">
      <span className="text-[12px] text-slate-500 font-medium">
        {total.toLocaleString()} {unitLabel}
      </span>
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
            aria-label="Previous page"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-[12px] font-semibold text-slate-700 tabular-nums">
            {page} <span className="text-slate-400 font-normal">/ {totalPages}</span>
          </span>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
            aria-label="Next page"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
