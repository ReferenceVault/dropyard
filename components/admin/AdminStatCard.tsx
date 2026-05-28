import React from "react";

const ACCENT: Record<string, { bg: string; text: string; ring: string }> = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-100" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-700",   ring: "ring-amber-100" },
  violet:  { bg: "bg-violet-50",  text: "text-violet-700",  ring: "ring-violet-100" },
  sky:     { bg: "bg-sky-50",     text: "text-sky-700",     ring: "ring-sky-100" },
  rose:    { bg: "bg-rose-50",    text: "text-rose-700",    ring: "ring-rose-100" },
  slate:   { bg: "bg-slate-100",  text: "text-slate-700",   ring: "ring-slate-200" },
};

export function AdminStatCard({
  label,
  value,
  icon,
  accent = "emerald",
  hint,
  delta,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: keyof typeof ACCENT;
  hint?: string;
  delta?: { value: string; positive?: boolean };
}) {
  const styles = ACCENT[accent];
  return (
    <div className="group bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(11,47,32,0.04)] p-3.5 hover:shadow-[0_6px_18px_rgba(11,47,32,0.05)] hover:border-slate-200 transition-all duration-200">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ring-2 ${styles.bg} ${styles.text} ${styles.ring} group-hover:scale-105 transition-transform duration-200`}
          >
            {icon}
          </span>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 leading-tight truncate">{label}</p>
        </div>
        {delta && (
          <span
            className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
              delta.positive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            <span>{delta.positive ? "↑" : "↓"}</span>
            {delta.value}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <p className="text-[22px] font-bold text-slate-900 tracking-tight leading-none">{value}</p>
        {hint && <p className="text-[11px] text-slate-500 leading-tight text-right pb-0.5">{hint}</p>}
      </div>
    </div>
  );
}
