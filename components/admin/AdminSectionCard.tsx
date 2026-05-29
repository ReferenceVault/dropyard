import React from "react";

export function AdminSectionCard({
  title,
  subtitle,
  action,
  children,
  className = "",
  bodyClassName = "",
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={`bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(11,47,32,0.04)] ${className}`}
    >
      <header className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[13px] font-bold text-slate-900 tracking-tight">{title}</h2>
          {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </header>
      <div className={`p-4 ${bodyClassName}`}>{children}</div>
    </section>
  );
}
