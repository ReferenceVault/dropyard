"use client";

import React from "react";
import { Search, RefreshCw } from "lucide-react";

export type ToolbarTab<T extends string> = {
  id: T;
  label: string;
  count?: number;
};

/**
 * Reusable toolbar that sits above admin data tables.
 * Layout: [tabs (left)] [search] [filter slot] [refresh] [primary CTA (right)]
 */
export function AdminToolbar<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  searchPlaceholder = "Search…",
  filter,
  onRefresh,
  refreshing,
  primaryAction,
}: {
  tabs?: ToolbarTab<T>[];
  activeTab?: T;
  onTabChange?: (tab: T) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  /** Slot for additional filters (e.g. a <select> dropdown). */
  filter?: React.ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
  primaryAction?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 mb-5">
      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div className="flex items-center gap-1 bg-white rounded-full border border-slate-200 p-1 self-start">
          {tabs.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange?.(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
                  active
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
                {typeof tab.count === "number" && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="lg:flex-1" />

      {/* Right cluster */}
      <div className="flex items-center gap-2 flex-wrap">
        {typeof search === "string" && (
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9 pr-3 py-2 w-56 sm:w-64 rounded-full bg-white border border-slate-200 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200/50 transition"
            />
          </div>
        )}

        {filter}

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            title="Refresh"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 transition"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          </button>
        )}

        {primaryAction}
      </div>
    </div>
  );
}
