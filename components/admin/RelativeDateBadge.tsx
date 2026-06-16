"use client";

// BUG-062 — marked "use client" so the component never SSRs. Calls to
// Date.now() in render bodies on the server would compute a different
// value than on the client, causing hydration warnings. Belt-and-suspenders
// since both consumers (admin inbox + admin users page) already mark
// themselves "use client".

import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

interface ToneStyles {
  label: string;
  tone:  "emerald" | "amber" | "slate";
}

// Pure helper — given a "now" timestamp and a target date, produce label + tone.
// Pulled out of render so the render body itself is pure (no Date.now()).
function deriveBadge(now: number, d: Date): ToneStyles {
  const diffDays = Math.floor((now - d.getTime()) / 86400000);
  if (diffDays === 0) return { label: "Today",     tone: "emerald" };
  if (diffDays === 1) return { label: "Yesterday", tone: "emerald" };
  if (diffDays <= 7)  return { label: `${diffDays} days ago`, tone: "amber" };
  return {
    label: d.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" }),
    tone:  "slate",
  };
}

/**
 * Renders a human-friendly relative date badge with a small tone hint:
 * - "Today" / "Yesterday" — emerald (recent)
 * - "N days ago" within 7 days — amber (this week)
 * - older — neutral slate (absolute date)
 */
export function RelativeDateBadge({ date, prefix }: { date?: string | Date | null; prefix?: React.ReactNode }) {
  // Track "now" in state, seeded after mount. Until then, fall back to the
  // raw target date — older entries render correctly on first paint; only
  // "Today/Yesterday" cases wait one tick to refine. This avoids any
  // Date.now() call during render → no hydration drift, no purity warning.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); }, []);

  if (!date) {
    return (
      <span className="inline-flex items-center gap-1 text-[12px] text-slate-400">
        {prefix}—
      </span>
    );
  }

  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) {
    return <span className="inline-flex items-center gap-1 text-[12px] text-slate-400">{prefix}—</span>;
  }

  // During SSR / before mount: render absolute date (no relative math).
  // After mount: render the relative label.
  const { label, tone } = now === null
    ? { label: d.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" }), tone: "slate" as const }
    : deriveBadge(now, d);

  const styles =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : tone === "amber"
      ? "bg-amber-50 text-amber-700 ring-amber-200"
      : "bg-slate-50 text-slate-600 ring-slate-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ring-1 ${styles}`}
      title={d.toLocaleString()}
    >
      <Calendar size={10} />
      {label}
    </span>
  );
}

/** Inline relative time (e.g. "3 hours ago", "2 days ago"). Plain text, no chrome.
 *  Pure helper — pass a "now" timestamp so the caller controls reactivity. */
export function relativeTime(date?: string | Date | null, now: number = Date.now()): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  const seconds = Math.max(1, Math.floor((now - d.getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}
