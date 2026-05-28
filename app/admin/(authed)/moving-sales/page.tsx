"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  RefreshCw,
  Check,
  X,
  Calendar,
  Mail,
  MapPin,
  Tag,
  Package,
  AlertCircle,
  Truck,
  Users as UsersIcon,
  Phone,
  Building2,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

// ── Types ────────────────────────────────────────────────────

type AppStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "COMPLETED";

interface Application {
  id: string;
  status: AppStatus;
  sellerType: string;
  organizationName?: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  neighborhood?: string;
  saleReason: string;
  estimatedItems: string;
  categories: string[];
  description?: string;
  preferredWeekend: string;
  pickupWindows: string[];
  flexibleDates: boolean;
  needsHelp: string[];
  taxReceipt: boolean;
  referralSource?: string;
  approvedWeekend?: string;
  createdAt: string;
  user: { id: string; name: string; email: string; role: string; createdAt: string };
}

interface Summary {
  PENDING_REVIEW?: number;
  APPROVED?: number;
  REJECTED?: number;
  COMPLETED?: number;
}

// ── Status helpers ───────────────────────────────────────────

const STATUS_CONFIG: Record<AppStatus, { label: string; pill: string; icon: React.ElementType }> = {
  PENDING_REVIEW: { label: "Pending Review", pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",     icon: Clock        },
  APPROVED:       { label: "Approved",       pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", icon: CheckCircle },
  REJECTED:       { label: "Rejected",       pill: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",         icon: XCircle     },
  COMPLETED:      { label: "Completed",      pill: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",     icon: Package     },
};

function StatusBadge({ status }: { status: AppStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg.pill}`}>
      <Icon size={11} /> {cfg.label}
    </span>
  );
}

// ── Application row (compact, clickable) ────────────────────

function ApplicationRow({
  app,
  selected,
  onSelect,
}: {
  app: Application;
  selected: boolean;
  onSelect: () => void;
}) {
  const submitted = new Date(app.createdAt).toLocaleDateString("en-CA", {
    month: "short", day: "numeric",
  });
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group w-full grid grid-cols-1 lg:grid-cols-[2fr_1.2fr_1fr_70px_1.1fr] gap-3 items-center px-4 py-2.5 text-left transition-colors border-l-2 ${
        selected
          ? "border-l-emerald-500 bg-emerald-50/40"
          : "border-l-transparent hover:bg-slate-50/60"
      }`}
    >
      {/* Applicant */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13px] font-bold text-slate-900 truncate">{app.contactName}</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
            {app.sellerType.toLowerCase()}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-2 min-w-0 text-[11.5px] text-slate-500">
          <Mail size={10} className="flex-shrink-0" />
          <span className="truncate">{app.email}</span>
        </div>
        {app.organizationName && (
          <p className="text-[11px] text-slate-400 truncate mt-0.5 inline-flex items-center gap-1">
            <Building2 size={10} /> {app.organizationName}
          </p>
        )}
      </div>

      {/* Location */}
      <div className="text-[12px] text-slate-700 min-w-0">
        <p className="flex items-center gap-1.5 truncate">
          <MapPin size={11} className="text-slate-400 flex-shrink-0" />
          {app.city}, {app.postalCode}
        </p>
        <p className="text-[11px] text-slate-500 truncate mt-0.5">
          {app.neighborhood ?? "—"}
        </p>
      </div>

      {/* Schedule */}
      <div className="text-[12px] text-slate-700 min-w-0">
        <p className="flex items-center gap-1.5 truncate">
          <Calendar size={11} className="text-slate-400 flex-shrink-0" />
          {app.preferredWeekend}
        </p>
        <p className="text-[11px] text-slate-500 truncate mt-0.5">
          {app.estimatedItems}
        </p>
      </div>

      {/* Submitted (own column, no more wrap) */}
      <div className="hidden lg:flex flex-col items-end gap-0.5 min-w-0">
        <span className="text-[11px] font-semibold text-slate-600 whitespace-nowrap">{submitted}</span>
        <span className="text-[10px] text-slate-400 whitespace-nowrap">
          {new Date(app.createdAt).toLocaleDateString("en-CA", { year: "numeric" })}
        </span>
      </div>

      {/* Status + chevron */}
      <div className="flex items-center justify-end gap-2">
        <StatusBadge status={app.status} />
        <ChevronRight
          size={14}
          className={`hidden lg:block flex-shrink-0 transition ${
            selected ? "text-emerald-600 translate-x-0" : "text-slate-300 -translate-x-1 group-hover:translate-x-0 group-hover:text-slate-500"
          }`}
        />
      </div>
    </button>
  );
}

// ── Side panel (Inbox pattern) ─────────────────────────────

function MovingSaleDetailPanel({
  app,
  token,
  onClose,
  onUpdated,
}: {
  app: Application;
  token: string;
  onClose: () => void;
  onUpdated: (next: Application) => void;
}) {
  const [approvedWeekend, setApprovedWeekend] = useState(app.approvedWeekend ?? app.preferredWeekend);
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState("");

  // Reset local input when switching to a different application.
  useEffect(() => {
    setApprovedWeekend(app.approvedWeekend ?? app.preferredWeekend);
    setError("");
  }, [app.id, app.approvedWeekend, app.preferredWeekend]);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const accountJoined = useMemo(
    () => new Date(app.user.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" }),
    [app.user.createdAt],
  );
  const submitted = useMemo(
    () => new Date(app.createdAt).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" }),
    [app.createdAt],
  );

  async function doAction(action: "approve" | "reject") {
    setLoading(action);
    setError("");
    try {
      const data = await apiRequest<{ application: Application }>(
        `/api/admin/moving-sales/${encodeURIComponent(app.id)}/${action}`,
        {
          method: "PATCH",
          token,
          body: action === "approve" ? JSON.stringify({ approvedWeekend }) : undefined,
        },
      );
      onUpdated(data.application ?? { ...app, status: action === "approve" ? "APPROVED" : "REJECTED", approvedWeekend });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update application.");
    } finally {
      setLoading(null);
    }
  }

  const isPending = app.status === "PENDING_REVIEW";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative w-full max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-5 py-4 border-b border-slate-200 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={app.status} />
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {app.sellerType.toLowerCase()}
              </span>
            </div>
            <h2 className="mt-2 text-[15px] font-bold text-slate-900 truncate">
              {app.contactName}
            </h2>
            <p className="text-[11px] text-slate-500 truncate">{app.email}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={16} />
          </button>
        </header>

        {/* Body — scroll */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Meta grid */}
          <section className="grid grid-cols-2 gap-3">
            <Meta label="Submitted" value={submitted} />
            <Meta label="Preferred weekend" value={app.preferredWeekend} />
            {app.organizationName && <Meta label="Organization" value={app.organizationName} />}
            <Meta label="Estimated items" value={app.estimatedItems} />
          </section>

          {/* Contact + location */}
          <section>
            <SectionHeader label="Contact & location" />
            <ul className="rounded-xl bg-slate-50 border border-slate-100 divide-y divide-slate-200/60 overflow-hidden">
              <DetailItem icon={<Mail size={12} />} label="Email" value={app.email} />
              <DetailItem icon={<Phone size={12} />} label="Phone" value={app.phone} />
              <DetailItem icon={<MapPin size={12} />} label="Address" value={`${app.address}, ${app.city} ${app.postalCode}`} />
              {app.neighborhood && (
                <DetailItem icon={<MapPin size={12} />} label="Neighbourhood" value={app.neighborhood} />
              )}
            </ul>
          </section>

          {/* Sale details */}
          <section>
            <SectionHeader label="Sale details" />
            <ul className="rounded-xl bg-slate-50 border border-slate-100 divide-y divide-slate-200/60 overflow-hidden">
              <DetailItem label="Reason" value={app.saleReason} />
              {app.description && <DetailItem label="Notes" value={app.description} />}
            </ul>

            {app.categories.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 mr-1">
                  Categories
                </span>
                {app.categories.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10.5px] font-semibold"
                  >
                    <Tag size={9} /> {c}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Schedule */}
          <section>
            <SectionHeader label="Schedule" />
            <ul className="rounded-xl bg-slate-50 border border-slate-100 divide-y divide-slate-200/60 overflow-hidden">
              <DetailItem label="Preferred weekend" value={app.preferredWeekend} />
              <DetailItem label="Pickup windows" value={app.pickupWindows.join(", ") || "—"} />
              <DetailItem label="Flexible dates" value={app.flexibleDates ? "Yes" : "No"} />
              {app.approvedWeekend && app.status === "APPROVED" && (
                <DetailItem label="Approved weekend" value={app.approvedWeekend} />
              )}
            </ul>
            {app.taxReceipt && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-amber-700">
                <AlertCircle size={12} /> Tax receipt requested
              </p>
            )}
          </section>

          {/* Account */}
          <section>
            <SectionHeader label="Linked account" />
            <ul className="rounded-xl bg-slate-50 border border-slate-100 divide-y divide-slate-200/60 overflow-hidden">
              <DetailItem label="Name" value={app.user.name} />
              <DetailItem label="Email" value={app.user.email} />
              <DetailItem label="Role" value={app.user.role.toLowerCase()} />
              <DetailItem label="Joined" value={accountJoined} />
            </ul>
          </section>

          {error && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2">
              <p className="text-[12px] text-rose-700 font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Footer action bar — context-aware */}
        {isPending ? (
          <footer className="border-t border-slate-200 bg-slate-50/60 p-4 space-y-3">
            <div>
              <label htmlFor="approved-weekend" className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 mb-1.5">
                Approved weekend
              </label>
              <input
                id="approved-weekend"
                type="text"
                value={approvedWeekend}
                onChange={(e) => setApprovedWeekend(e.target.value)}
                placeholder="e.g. Apr 5–6, 2026"
                disabled={!!loading}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
              />
              <p className="text-[10.5px] text-slate-500 mt-1">
                Defaults to the seller&apos;s preferred weekend; change before approving if needed.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => doAction("reject")}
                disabled={!!loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-rose-200 text-rose-700 text-[12.5px] font-bold hover:bg-rose-50 disabled:opacity-50 transition"
              >
                {loading === "reject" ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
                Reject
              </button>
              <button
                onClick={() => doAction("approve")}
                disabled={!approvedWeekend.trim() || !!loading}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 text-white text-[12.5px] font-bold hover:bg-emerald-700 disabled:opacity-50 transition shadow-[0_8px_18px_rgba(5,150,105,0.25)]"
              >
                {loading === "approve" ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                Approve
              </button>
            </div>
          </footer>
        ) : (
          <footer className="border-t border-slate-200 bg-slate-50/60 px-4 py-3 flex items-center justify-between gap-3">
            <p className="text-[12px] text-slate-500">
              {app.status === "APPROVED" && (
                <>Approved for <strong className="text-slate-900">{app.approvedWeekend ?? app.preferredWeekend}</strong></>
              )}
              {app.status === "REJECTED" && <>Marked as rejected.</>}
              {app.status === "COMPLETED" && <>Sale completed.</>}
            </p>
            <a
              href={`mailto:${app.email}?subject=${encodeURIComponent("Your DropYard Moving Sale")}`}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-bold text-slate-700 border border-slate-200 hover:bg-white"
            >
              <Mail size={12} /> Email seller
            </a>
          </footer>
        )}
      </aside>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-2">
      {label}
    </h4>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="text-[12px] font-semibold text-slate-900 mt-0.5 break-words">{value}</p>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <li className="px-3 py-2 flex items-start gap-3">
      <span className="flex items-center gap-1.5 min-w-[110px] text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-500">
        {icon}
        {label}
      </span>
      <span className="text-[12.5px] text-slate-800 break-words flex-1">{value}</span>
    </li>
  );
}

// ── Page ────────────────────────────────────────────────────

const FILTERS = ["ALL", "PENDING_REVIEW", "APPROVED", "REJECTED", "COMPLETED"] as const;
type Filter = (typeof FILTERS)[number];

export default function MovingSalesPage() {
  const { accessToken } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [summary, setSummary] = useState<Summary>({});
  const [filter, setFilter] = useState<Filter>("ALL");
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!accessToken) return;
    setFetching(true);
    setError("");
    try {
      const params = filter !== "ALL" ? `?status=${filter}` : "";
      const data = await apiRequest<{ applications: Application[]; summary: Summary }>(
        `/api/admin/moving-sales${params}`,
        { token: accessToken },
      );
      setApplications(data.applications);
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load applications");
    } finally {
      setFetching(false);
    }
  }, [accessToken, filter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Patch a single application in local state after a panel save — avoids
  // the full refetch flash and keeps the side panel open with fresh data.
  const replaceApplication = useCallback((next: Application) => {
    setApplications((prev) => prev.map((a) => (a.id === next.id ? next : a)));
    setSummary((prev) => {
      // The application's status may have transitioned; recompute the affected
      // counters from current state.
      const updated = { ...prev };
      // We don't know the old status here, so just bump the new one. A
      // follow-up fetch (e.g. on filter change) will reconcile.
      const key = next.status as keyof Summary;
      updated[key] = (updated[key] ?? 0) + 1;
      return updated;
    });
  }, []);

  const selected = selectedId ? applications.find((a) => a.id === selectedId) ?? null : null;

  const pending = summary.PENDING_REVIEW ?? 0;
  const approved = summary.APPROVED ?? 0;
  const rejected = summary.REJECTED ?? 0;
  const completed = summary.COMPLETED ?? 0;

  const filtered = filter === "ALL" ? applications : applications.filter((a) => a.status === filter);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 max-w-7xl mx-auto w-full">
      <AdminPageHeader
        title="Moving Sale Applications"
        subtitle="Review and approve seller applications for the weekend Drop"
        action={
          <button
            onClick={fetchApplications}
            disabled={fetching}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-slate-700 border border-slate-200 rounded-full bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={12} className={fetching ? "animate-spin" : ""} />
            Refresh
          </button>
        }
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <AdminStatCard label="Pending Review" value={pending}   icon={<Clock size={14} />}       accent="amber" />
        <AdminStatCard label="Approved"       value={approved}  icon={<CheckCircle size={14} />} accent="emerald" />
        <AdminStatCard label="Rejected"       value={rejected}  icon={<XCircle size={14} />}     accent="rose" />
        <AdminStatCard label="Completed"      value={completed} icon={<Package size={14} />}     accent="slate" />
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 flex-wrap mb-4 bg-white rounded-full border border-slate-200 p-1 w-fit">
        {FILTERS.map((s) => {
          const count = s === "ALL" ? applications.length : summary[s] ?? 0;
          const active = filter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-colors inline-flex items-center gap-1.5 ${
                active
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {s === "ALL" ? "All" : STATUS_CONFIG[s].label}
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums ${
                  active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm mb-4">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* List */}
      {fetching && applications.length === 0 ? (
        <div className="py-20 text-center">
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Loading applications…
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-slate-100">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-3">
            <Truck size={20} />
          </div>
          <p className="text-slate-800 font-semibold">No applications</p>
          <p className="text-slate-500 text-sm mt-1">
            {filter === "ALL"
              ? "No Moving Sale applications yet."
              : `No ${STATUS_CONFIG[filter as AppStatus]?.label} applications.`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(11,47,32,0.04)] overflow-hidden">
          {/* Sticky table header */}
          <div className="hidden lg:grid grid-cols-[2fr_1.2fr_1fr_70px_1.1fr] gap-3 px-4 py-2.5 bg-gradient-to-b from-slate-50/95 to-white/95 backdrop-blur-sm border-b border-slate-200 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 sticky top-0 z-10">
            <span>Applicant</span>
            <span>Location</span>
            <span>Schedule</span>
            <span className="text-right">Submitted</span>
            <span className="text-right pr-6">Status</span>
          </div>

          <ul className="divide-y divide-slate-100/80">
            {filtered.map((app) => (
              <li key={app.id}>
                <ApplicationRow
                  app={app}
                  selected={app.id === selectedId}
                  onSelect={() => setSelectedId(app.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer note */}
      {filtered.length > 0 && (
        <p className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <UsersIcon size={11} /> Showing {filtered.length} of {applications.length} applications
        </p>
      )}

      {/* Side panel */}
      {selected && (
        <MovingSaleDetailPanel
          app={selected}
          token={accessToken ?? ""}
          onClose={() => setSelectedId(null)}
          onUpdated={(next) => {
            replaceApplication(next);
            // Optional: do a quiet refetch so summary counters stay accurate.
            fetchApplications();
          }}
        />
      )}
    </div>
  );
}
