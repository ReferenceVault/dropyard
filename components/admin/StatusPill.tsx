import React from "react";

export type StatusTone =
  | "emerald"
  | "amber"
  | "rose"
  | "sky"
  | "violet"
  | "slate";

const STYLES: Record<StatusTone, string> = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber:   "bg-amber-50 text-amber-700 ring-amber-200",
  rose:    "bg-rose-50 text-rose-700 ring-rose-200",
  sky:     "bg-sky-50 text-sky-700 ring-sky-200",
  violet:  "bg-violet-50 text-violet-700 ring-violet-200",
  slate:   "bg-slate-100 text-slate-700 ring-slate-200",
};

export function StatusPill({
  label,
  tone = "slate",
  icon,
  withDot,
}: {
  label: string;
  tone?: StatusTone;
  icon?: React.ReactNode;
  withDot?: boolean;
}) {
  const dotColor: Record<StatusTone, string> = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    sky: "bg-sky-500",
    violet: "bg-violet-500",
    slate: "bg-slate-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ring-1 ${STYLES[tone]}`}
    >
      {withDot && <span className={`h-1.5 w-1.5 rounded-full ${dotColor[tone]}`} />}
      {icon}
      {label}
    </span>
  );
}
