"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  LogOut,
  RefreshCw,
  Users,
  Package,
  AlertCircle,
  Check,
  X,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Tag,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

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

interface Summary { PENDING_REVIEW?: number; APPROVED?: number; REJECTED?: number; COMPLETED?: number }

// ── Status helpers ───────────────────────────────────────────

const STATUS_CONFIG: Record<AppStatus, { label: string; color: string; icon: React.ElementType }> = {
  PENDING_REVIEW: { label: "Pending Review", color: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",   icon: Clock        },
  APPROVED:       { label: "Approved",        color: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200", icon: CheckCircle },
  REJECTED:       { label: "Rejected",        color: "bg-red-100 text-red-700 ring-1 ring-red-200",         icon: XCircle     },
  COMPLETED:      { label: "Completed",       color: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",   icon: Package     },
};

function StatusBadge({ status }: { status: AppStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      <Icon size={12} /> {cfg.label}
    </span>
  );
}

// ── Application row ──────────────────────────────────────────

function ApplicationRow({
  app,
  onApprove,
  onReject,
}: {
  app: Application;
  onApprove: (id: string, weekend: string) => Promise<void>;
  onReject:  (id: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [approvedWeekend, setApprovedWeekend] = useState(app.preferredWeekend);
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  const handle = async (action: "approve" | "reject") => {
    setLoading(action);
    try {
      if (action === "approve") await onApprove(app.id, approvedWeekend);
      else await onReject(app.id);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
      {/* Header row */}
      <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpanded(e => !e)}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900">{app.contactName}</span>
            <span className="text-xs text-gray-400 capitalize">{app.sellerType.toLowerCase()}</span>
            {app.organizationName && <span className="text-xs text-gray-500">· {app.organizationName}</span>}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Mail size={11} />{app.email}</span>
            <span className="flex items-center gap-1"><MapPin size={11} />{app.city}, {app.postalCode}</span>
            <span className="flex items-center gap-1"><Calendar size={11} />{app.preferredWeekend}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <StatusBadge status={app.status} />
          <span className="text-xs text-gray-400">{new Date(app.createdAt).toLocaleDateString()}</span>
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Contact & Location */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact & Location</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Name:</span> <span className="font-medium text-gray-900">{app.contactName}</span></p>
                <p><span className="text-gray-500">Email:</span> <span className="font-medium text-gray-900">{app.email}</span></p>
                <p><span className="text-gray-500">Phone:</span> <span className="font-medium text-gray-900">{app.phone}</span></p>
                <p><span className="text-gray-500">Address:</span> <span className="font-medium text-gray-900">{app.address}, {app.city} {app.postalCode}</span></p>
                {app.neighborhood && <p><span className="text-gray-500">Neighborhood:</span> <span className="font-medium text-gray-900">{app.neighborhood}</span></p>}
              </div>

              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-2">Account</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">User:</span> <span className="font-medium text-gray-900">{app.user.name}</span></p>
                <p><span className="text-gray-500">Joined:</span> <span className="font-medium text-gray-900">{new Date(app.user.createdAt).toLocaleDateString()}</span></p>
              </div>
            </div>

            {/* Sale Details */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sale Details</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Reason:</span> <span className="font-medium text-gray-900">{app.saleReason}</span></p>
                <p><span className="text-gray-500">Est. items:</span> <span className="font-medium text-gray-900">{app.estimatedItems}</span></p>
                <p>
                  <span className="text-gray-500">Categories: </span>
                  {app.categories.map(c => (
                    <span key={c} className="inline-flex items-center gap-1 mr-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs"><Tag size={10} />{c}</span>
                  ))}
                </p>
                {app.description && <p><span className="text-gray-500">Notes:</span> <span className="font-medium text-gray-900">{app.description}</span></p>}
              </div>

              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-2">Schedule</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Preferred weekend:</span> <span className="font-medium text-gray-900">{app.preferredWeekend}</span></p>
                <p><span className="text-gray-500">Pickup windows:</span> <span className="font-medium text-gray-900">{app.pickupWindows.join(", ")}</span></p>
                <p><span className="text-gray-500">Flexible dates:</span> <span className="font-medium text-gray-900">{app.flexibleDates ? "Yes" : "No"}</span></p>
                {app.taxReceipt && <p className="text-amber-600 font-medium text-xs">⚠ Requested tax receipt</p>}
              </div>
            </div>
          </div>

          {/* Action bar — only for pending */}
          {app.status === "PENDING_REVIEW" && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-6 py-4 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-2 flex-1">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Approved weekend:</label>
                <input
                  type="text"
                  value={approvedWeekend}
                  onChange={e => setApprovedWeekend(e.target.value)}
                  placeholder="e.g. Apr 5–6, 2026"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handle("reject")}
                  disabled={!!loading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  {loading === "reject" ? <RefreshCw size={14} className="animate-spin" /> : <X size={14} />}
                  Reject
                </button>
                <button
                  onClick={() => handle("approve")}
                  disabled={!approvedWeekend || !!loading}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                >
                  {loading === "approve" ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                  Approve
                </button>
              </div>
            </div>
          )}

          {app.status === "APPROVED" && (
            <div className="px-6 py-3 border-t border-gray-100 bg-emerald-50">
              <p className="text-sm text-emerald-700">
                <strong>Approved weekend:</strong> {app.approvedWeekend ?? app.preferredWeekend}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main admin page ──────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const { user, accessToken, signout, loading: authLoading } = useAuth();

  const [applications, setApplications] = useState<Application[]>([]);
  const [summary, setSummary] = useState<Summary>({});
  const [filter, setFilter] = useState<AppStatus | "ALL">("ALL");
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  // Guard: redirect non-admins
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) {
      router.replace("/join");
    }
  }, [user, authLoading, router]);

  const fetchApplications = useCallback(async () => {
    if (!accessToken) return;
    setFetching(true);
    setError("");
    try {
      const params = filter !== "ALL" ? `?status=${filter}` : "";
      const data = await apiRequest<{ applications: Application[]; summary: Summary }>(
        `/api/admin/moving-sales${params}`,
        { token: accessToken }
      );
      setApplications(data.applications);
      setSummary(data.summary);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load applications");
    } finally {
      setFetching(false);
    }
  }, [accessToken, filter]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const handleApprove = async (id: string, approvedWeekend: string) => {
    await apiRequest(`/api/admin/moving-sales/${id}/approve`, {
      method: "PATCH",
      token: accessToken ?? undefined,
      body: JSON.stringify({ approvedWeekend }),
    });
    fetchApplications();
  };

  const handleReject = async (id: string) => {
    await apiRequest(`/api/admin/moving-sales/${id}/reject`, {
      method: "PATCH",
      token: accessToken ?? undefined,
    });
    fetchApplications();
  };

  if (authLoading || !user || user.role !== "ADMIN") {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm">Checking access…</div>;
  }

  const pending   = summary.PENDING_REVIEW ?? 0;
  const approved  = summary.APPROVED ?? 0;
  const rejected  = summary.REJECTED ?? 0;

  const filtered = filter === "ALL" ? applications : applications.filter(a => a.status === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 h-14 bg-white border-b border-slate-100 flex items-center px-6 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-amber-400 flex items-center justify-center text-white text-xs font-bold">DY</div>
          <span className="font-bold text-gray-900">DropYard</span>
          <span className="text-slate-300 mx-1">|</span>
          <span className="text-sm font-semibold text-slate-500">Admin</span>
        </div>
        <div className="flex-1" />
        <span className="text-sm text-gray-500">{user.name}</span>
        <button onClick={signout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <LogOut size={15} /> Sign out
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Moving Sale Applications</h1>
          <p className="text-gray-500 text-sm mt-1">Review and approve seller applications</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Pending Review", value: pending,  color: "text-amber-600",   bg: "bg-amber-50",   icon: Clock        },
            { label: "Approved",       value: approved, color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle  },
            { label: "Rejected",       value: rejected, color: "text-red-500",     bg: "bg-red-50",     icon: XCircle      },
          ].map(({ label, value, color, bg, icon: Icon }) => (
            <div key={label} className={`${bg} rounded-2xl p-5 border border-white`}>
              <div className="flex items-center gap-2 mb-1">
                <Icon size={16} className={color} />
                <span className="text-xs font-medium text-gray-500">{label}</span>
              </div>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {(["ALL", "PENDING_REVIEW", "APPROVED", "REJECTED"] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                filter === s
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {s === "ALL" ? "All" : STATUS_CONFIG[s].label}
              {s !== "ALL" && summary[s] ? ` (${summary[s]})` : ""}
            </button>
          ))}

          <div className="flex-1" />

          <button
            onClick={fetchApplications}
            disabled={fetching}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-full bg-white transition-colors"
          >
            <RefreshCw size={14} className={fetching ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* List */}
        {fetching && applications.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No applications</p>
            <p className="text-gray-400 text-sm mt-1">
              {filter === "ALL" ? "No Moving Sale applications yet." : `No ${STATUS_CONFIG[filter as AppStatus]?.label} applications.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(app => (
              <ApplicationRow
                key={app.id}
                app={app}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
