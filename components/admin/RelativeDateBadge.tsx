import React from "react";
import { Calendar } from "lucide-react";

/**
 * Renders a human-friendly relative date badge with a small tone hint:
 * - "Today" / "Yesterday" — emerald (recent)
 * - "N days ago" within 7 days — amber (this week)
 * - older — neutral slate (absolute date)
 */
export function RelativeDateBadge({ date, prefix }: { date?: string | Date | null; prefix?: React.ReactNode }) {
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

  const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);

  let label: string;
  let tone: "emerald" | "amber" | "slate";

  if (diffDays === 0) {
    label = "Today";
    tone = "emerald";
  } else if (diffDays === 1) {
    label = "Yesterday";
    tone = "emerald";
  } else if (diffDays <= 7) {
    label = `${diffDays} days ago`;
    tone = "amber";
  } else {
    label = d.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
    tone = "slate";
  }

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

/** Inline relative time (e.g. "3 hours ago", "2 days ago"). Plain text, no chrome. */
export function relativeTime(date?: string | Date | null): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  const seconds = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000));
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
