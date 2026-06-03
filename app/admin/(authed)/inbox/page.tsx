"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Inbox,
  AlertCircle,
  ChevronRight,
  Link2,
  Mail,
  ExternalLink,
  ArrowDownUp,
  ChevronUp,
  ChevronDown,
  X,
  CheckCircle2,
  CircleSlash,
  Loader2,
  User as UserIcon,
  Globe,
  Calendar,
  Save,
  Reply,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AvatarChip } from "@/components/admin/AvatarChip";
import { RelativeDateBadge, relativeTime } from "@/components/admin/RelativeDateBadge";
import {
  SubmissionTypeBadge,
  SubmissionStatusBadge,
  SUBMISSION_TYPE_META,
  type SubmissionType,
  type SubmissionStatus,
} from "@/components/admin/SubmissionTypeBadge";

// ── Types ────────────────────────────────────────────────────────

type Submission = {
  id: string;
  type: SubmissionType;
  status: SubmissionStatus;
  source: string;
  email: string | null;
  name: string | null;
  message: string | null;
  payload: Record<string, unknown>;
  internalNotes: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string; email: string; role: string } | null;
  assignedTo: { id: string; name: string; email: string } | null;
};

type SubmissionsResponse = {
  data: Submission[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  counts: { byType: Record<string, number>; byStatus: Record<string, number> };
};

type Stats = {
  total: number;
  new: number;
  inProgress: number;
  resolved: number;
  spam: number;
  newLast7Days: number;
};

type StatusTab = "ALL" | SubmissionStatus;
type SortField = "createdAt" | "updatedAt";

const PAGE_SIZE = 20;

// Build dropdown groups from SUBMISSION_TYPE_META
const TYPE_GROUPS: Record<string, SubmissionType[]> = (() => {
  const groups: Record<string, SubmissionType[]> = {};
  (Object.keys(SUBMISSION_TYPE_META) as SubmissionType[]).forEach((t) => {
    const g = SUBMISSION_TYPE_META[t].group;
    (groups[g] ??= []).push(t);
  });
  return groups;
})();

// Render the source nicely
function formatSource(source: string): string {
  if (source.startsWith("/")) return source;
  return source.replace(/_/g, " ");
}

// ── Page ─────────────────────────────────────────────────────────

export default function AdminInboxPage() {
  const { accessToken } = useAuth();

  const [resp, setResp] = useState<SubmissionsResponse | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [statusTab, setStatusTab] = useState<StatusTab>("ALL");
  const [typeFilter, setTypeFilter] = useState<SubmissionType | "">("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Reset to first page on filter change
  useEffect(() => {
    setPage(1);
  }, [statusTab, typeFilter, debouncedSearch, sortBy, sortDir]);

  // Fetch list
  const fetchSubmissions = useCallback(async () => {
    if (!accessToken) return;
    const isInitial = !resp;
    if (isInitial) setLoading(true);
    else setRefreshing(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        sortBy,
        sortDir,
      });
      if (statusTab !== "ALL") params.set("status", statusTab);
      if (typeFilter) params.set("type", typeFilter);
      if (debouncedSearch) params.set("search", debouncedSearch);

      const data = await apiRequest<SubmissionsResponse>(
        `/api/admin/submissions?${params.toString()}`,
        { token: accessToken },
      );
      setResp(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load submissions");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, page, statusTab, typeFilter, debouncedSearch, sortBy, sortDir, refreshKey]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Fetch stats
  useEffect(() => {
    if (!accessToken) return;
    apiRequest<Stats>("/api/admin/submissions/stats", { token: accessToken })
      .then(setStats)
      .catch(() => {});
  }, [accessToken, refreshKey]);

  // Update a submission row in local state after side-panel save
  const replaceSubmission = (updated: Submission) => {
    setResp((prev) =>
      prev
        ? { ...prev, data: prev.data.map((s) => (s.id === updated.id ? updated : s)) }
        : prev,
    );
  };

  const selected = selectedId ? resp?.data.find((s) => s.id === selectedId) ?? null : null;

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
  };

  const statusTabs = [
    { id: "ALL" as const,         label: "All",         count: stats?.total },
    { id: "NEW" as const,         label: "New",         count: stats?.new },
    { id: "IN_PROGRESS" as const, label: "In progress", count: stats?.inProgress },
    { id: "RESOLVED" as const,    label: "Resolved",    count: stats?.resolved },
    { id: "SPAM" as const,        label: "Spam",        count: stats?.spam },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 max-w-7xl mx-auto w-full">
      <AdminPageHeader
        title="Inbox"
        subtitle="Everything users have submitted from the portal — contact forms, waitlists, reports."
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <AdminStatCard label="New"          value={stats?.new ?? "—"}        icon={<Inbox size={14} />}        accent="amber" hint="Awaiting first response" />
        <AdminStatCard label="In progress"  value={stats?.inProgress ?? "—"} icon={<Loader2 size={14} />}      accent="sky" />
        <AdminStatCard label="Resolved"     value={stats?.resolved ?? "—"}   icon={<CheckCircle2 size={14} />} accent="emerald" />
        <AdminStatCard label="Last 7 days"  value={stats?.newLast7Days ?? "—"} icon={<Calendar size={14} />}   accent="violet" hint="New submissions" />
      </div>

      <AdminToolbar
        tabs={statusTabs}
        activeTab={statusTab}
        onTabChange={setStatusTab}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search name, email, or message…"
        filter={
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter((e.target.value as SubmissionType | ""))}
            className="px-3 py-2 rounded-full bg-white border border-slate-200 text-[12px] text-slate-700 font-semibold focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200/50 transition"
          >
            <option value="">All types</option>
            {Object.entries(TYPE_GROUPS).map(([group, types]) => (
              <optgroup key={group} label={group}>
                {types.map((t) => (
                  <option key={t} value={t}>{SUBMISSION_TYPE_META[t].label}</option>
                ))}
              </optgroup>
            ))}
          </select>
        }
        onRefresh={() => setRefreshKey((k) => k + 1)}
        refreshing={refreshing}
      />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm mb-4">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(11,47,32,0.04)] overflow-hidden">
        {/* Header */}
        <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_2fr_1fr_1fr_40px] gap-3 px-4 py-2.5 bg-gradient-to-b from-slate-50/95 to-white/95 backdrop-blur-sm border-b border-slate-200 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 sticky top-0 z-10">
          <span>Submitter</span>
          <span>Type</span>
          <span>Source</span>
          <span>Preview</span>
          <SortableHeader label="Submitted" field="createdAt" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
          <span>Status</span>
          <span aria-hidden="true" />
        </div>

        {loading && !resp ? (
          <RowsSkeleton />
        ) : resp && resp.data.length === 0 ? (
          <EmptyInbox hasFilter={!!debouncedSearch || statusTab !== "ALL" || !!typeFilter} />
        ) : (
          <ul className="divide-y divide-slate-100/80">
            {resp?.data.map((s) => (
              <SubmissionRow
                key={s.id}
                submission={s}
                isActive={s.id === selectedId}
                onSelect={() => setSelectedId(s.id)}
              />
            ))}
          </ul>
        )}
      </div>

      {resp && resp.data.length > 0 && (
        <AdminPagination
          page={resp.page}
          totalPages={resp.totalPages}
          total={resp.total}
          unit="submission"
          onPageChange={setPage}
        />
      )}

      {/* Detail side panel */}
      {selected && (
        <SubmissionDetailPanel
          submission={selected}
          onClose={() => setSelectedId(null)}
          onUpdated={(updated) => {
            replaceSubmission(updated);
            setRefreshKey((k) => k + 1); // refresh stats counts
          }}
        />
      )}
    </div>
  );
}

// ── Sortable column header ──────────────────────────────────────

function SortableHeader({
  label,
  field,
  sortBy,
  sortDir,
  onSort,
}: {
  label: string;
  field: SortField;
  sortBy: SortField;
  sortDir: "asc" | "desc";
  onSort: (field: SortField) => void;
}) {
  const active = sortBy === field;
  const Icon = !active ? ArrowDownUp : sortDir === "asc" ? ChevronUp : ChevronDown;
  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className={`inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors ${
        active ? "text-emerald-700" : "text-slate-500"
      }`}
    >
      {label}
      <Icon size={11} className={active ? "text-emerald-700" : "text-slate-400"} />
    </button>
  );
}

// ── Submission row ──────────────────────────────────────────────

function SubmissionRow({
  submission,
  isActive,
  onSelect,
}: {
  submission: Submission;
  isActive: boolean;
  onSelect: () => void;
}) {
  const displayName = submission.name || submission.user?.name || submission.email || "Anonymous";
  const subtitle = submission.user
    ? submission.user.email
    : submission.email || "no email provided";

  return (
    <li
      onClick={onSelect}
      className={`group grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_2fr_1fr_1fr_40px] gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
        isActive
          ? "bg-emerald-50/60"
          : "hover:bg-gradient-to-r hover:from-emerald-50/40 hover:to-transparent"
      }`}
    >
      {/* Submitter */}
      <div className="flex items-center gap-2.5 min-w-0">
        <AvatarChip name={displayName} seed={submission.id} size="md" />
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-slate-900 truncate leading-tight">
            {displayName}
          </p>
          <p className="text-[11px] text-slate-500 truncate">{subtitle}</p>
        </div>
      </div>

      {/* Type */}
      <div className="flex items-center min-w-0">
        <SubmissionTypeBadge type={submission.type} />
      </div>

      {/* Source */}
      <div className="flex items-center min-w-0 text-[11px] text-slate-600">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 font-mono truncate">
          <Globe size={9} className="text-slate-400 flex-shrink-0" />
          <span className="truncate">{formatSource(submission.source)}</span>
        </span>
      </div>

      {/* Preview */}
      <div className="min-w-0 lg:py-0.5 text-[12px] text-slate-600 line-clamp-2">
        {submission.message || (
          <span className="italic text-slate-400">{previewPayload(submission.payload)}</span>
        )}
      </div>

      {/* Submitted */}
      <div className="flex items-center min-w-0">
        <RelativeDateBadge date={submission.createdAt} />
      </div>

      {/* Status */}
      <div className="flex items-center min-w-0">
        <SubmissionStatusBadge status={submission.status} />
      </div>

      {/* Chevron */}
      <div className="flex items-center justify-end">
        <ChevronRight
          size={14}
          className={`text-slate-300 transition-all duration-200 ${
            isActive
              ? "text-emerald-600 translate-x-0"
              : "-translate-x-1 group-hover:translate-x-0 group-hover:text-emerald-600 opacity-0 group-hover:opacity-100"
          }`}
        />
      </div>
    </li>
  );
}

function previewPayload(payload: Record<string, unknown>): string {
  const keys = Object.keys(payload).filter((k) => !["email", "name", "message"].includes(k));
  if (keys.length === 0) return "no message";
  return keys
    .slice(0, 3)
    .map((k) => `${k}: ${String(payload[k]).slice(0, 40)}`)
    .join(" · ");
}

// ── Detail side panel ──────────────────────────────────────────

function SubmissionDetailPanel({
  submission,
  onClose,
  onUpdated,
}: {
  submission: Submission;
  onClose: () => void;
  onUpdated: (s: Submission) => void;
}) {
  const { accessToken } = useAuth();
  const [notes, setNotes] = useState(submission.internalNotes ?? "");
  const [saving, setSaving] = useState<null | "status" | "notes">(null);
  const [error, setError] = useState("");
  const [showPayload, setShowPayload] = useState(false);
  const [showDirectReply, setShowDirectReply] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replySent, setReplySent] = useState(false);

  // Reset notes when switching submissions
  useEffect(() => {
    setNotes(submission.internalNotes ?? "");
    setError("");
    setShowDirectReply(false);
    setReplyBody("");
    setReplySent(false);
  }, [submission.id, submission.internalNotes]);

  const sendDirectReply = async () => {
    if (!accessToken || !replyBody.trim()) return;
    setSendingReply(true);
    setError("");
    try {
      await apiRequest(`/api/admin/submissions/${submission.id}/reply`, {
        method: "POST",
        token: accessToken,
        body: JSON.stringify({ message: replyBody.trim() }),
      });
      setReplySent(true);
      setReplyBody("");
      setShowDirectReply(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const patch = useCallback(
    async (body: { status?: SubmissionStatus; internalNotes?: string }, which: "status" | "notes") => {
      if (!accessToken) return;
      setSaving(which);
      setError("");
      try {
        const { submission: updated } = await apiRequest<{ submission: Submission }>(
          `/api/admin/submissions/${submission.id}`,
          { method: "PATCH", token: accessToken, body: JSON.stringify(body) },
        );
        onUpdated(updated);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update");
      } finally {
        setSaving(null);
      }
    },
    [accessToken, submission.id, onUpdated],
  );

  const displayName = submission.name || submission.user?.name || submission.email || "Anonymous";
  const emailForReply = submission.email || submission.user?.email;
  const replyHref = emailForReply
    ? `mailto:${emailForReply}?subject=${encodeURIComponent(`Re: ${SUBMISSION_TYPE_META[submission.type].label}`)}`
    : null;

  const userFields = useMemo(() => {
    return Object.entries(submission.payload).filter(
      ([k]) => !["email", "name", "message"].includes(k),
    );
  }, [submission.payload]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative w-full max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-5 py-4 border-b border-slate-200 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <SubmissionTypeBadge type={submission.type} />
              <SubmissionStatusBadge status={submission.status} />
            </div>
            <h2 className="mt-2 text-[15px] font-bold text-slate-900 truncate">
              {displayName}
            </h2>
            <p className="text-[11px] text-slate-500 truncate">
              {submission.email || "no email provided"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Meta */}
          <dl className="grid grid-cols-2 gap-3 text-[12px]">
            <Meta label="Submitted" icon={<Calendar size={11} />}>
              <span title={new Date(submission.createdAt).toLocaleString()}>
                {relativeTime(submission.createdAt)}
              </span>
            </Meta>
            <Meta label="Source" icon={<Globe size={11} />}>
              <span className="font-mono text-[11px]">{formatSource(submission.source)}</span>
            </Meta>
            {submission.user && (
              <Meta label="Linked account" icon={<UserIcon size={11} />}>
                <span className="font-semibold">{submission.user.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 ml-1.5">
                  {submission.user.role}
                </span>
              </Meta>
            )}
            {submission.assignedTo && (
              <Meta label="Assigned to" icon={<UserIcon size={11} />}>
                {submission.assignedTo.name}
              </Meta>
            )}
            {submission.resolvedAt && (
              <Meta label="Resolved" icon={<CheckCircle2 size={11} />}>
                <span title={new Date(submission.resolvedAt).toLocaleString()}>
                  {relativeTime(submission.resolvedAt)}
                </span>
              </Meta>
            )}
          </dl>

          {/* Message */}
          {submission.message && (
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-2">
                Message
              </h3>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-[13px] text-slate-800 leading-relaxed whitespace-pre-wrap">
                {submission.message}
              </div>
            </section>
          )}

          {/* Additional payload fields */}
          {userFields.length > 0 && (
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-2">
                Submitted fields
              </h3>
              <dl className="rounded-xl bg-slate-50 border border-slate-200 divide-y divide-slate-200/80 text-[12px]">
                {userFields.map(([key, value]) => (
                  <div key={key} className="px-3.5 py-2 flex gap-3">
                    <dt className="text-slate-500 font-semibold capitalize w-28 flex-shrink-0">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </dt>
                    <dd className="text-slate-800 break-words min-w-0">
                      {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* Raw payload (collapsed) */}
          <section>
            <button
              type="button"
              onClick={() => setShowPayload((v) => !v)}
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 hover:text-slate-900"
            >
              <ChevronDown
                size={11}
                className={`transition-transform ${showPayload ? "" : "-rotate-90"}`}
              />
              Raw payload
            </button>
            {showPayload && (
              <pre className="mt-2 rounded-xl bg-slate-900 text-emerald-200 p-3 text-[11px] overflow-x-auto font-mono">
                {JSON.stringify(submission.payload, null, 2)}
              </pre>
            )}
          </section>

          {/* Internal notes */}
          <section>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-2">
              Internal notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a note for other admins…"
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-[12px] text-slate-800 focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200/50 resize-y"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => patch({ internalNotes: notes }, "notes")}
                disabled={saving === "notes" || notes === (submission.internalNotes ?? "")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[11px] font-semibold transition"
              >
                {saving === "notes" ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
                Save notes
              </button>
            </div>
          </section>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[12px]">
              <AlertCircle size={13} /> {error}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <footer className="border-t border-slate-200 bg-slate-50/50 p-4 space-y-2.5">
          <div className="grid grid-cols-3 gap-1.5">
            <StatusAction
              label="In progress"
              icon={<Loader2 size={12} />}
              active={submission.status === "IN_PROGRESS"}
              loading={saving === "status"}
              tone="sky"
              onClick={() => patch({ status: "IN_PROGRESS" }, "status")}
            />
            <StatusAction
              label="Resolved"
              icon={<CheckCircle2 size={12} />}
              active={submission.status === "RESOLVED"}
              loading={saving === "status"}
              tone="emerald"
              onClick={() => patch({ status: "RESOLVED" }, "status")}
            />
            <StatusAction
              label="Spam"
              icon={<CircleSlash size={12} />}
              active={submission.status === "SPAM"}
              loading={saving === "status"}
              tone="slate"
              onClick={() => patch({ status: "SPAM" }, "status")}
            />
          </div>

          {emailForReply && (
            <div className="grid grid-cols-2 gap-1.5">
              {replyHref && (
                <a
                  href={replyHref}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-[12px] font-semibold transition"
                >
                  <Reply size={12} /> Reply via email
                  <ExternalLink size={10} className="text-slate-400" />
                </a>
              )}
              <button
                type="button"
                onClick={() => { setShowDirectReply((v) => !v); setReplySent(false); setError(""); }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 text-[12px] font-semibold transition"
              >
                <Mail size={12} /> Direct reply
              </button>
            </div>
          )}

          {replySent && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12px]">
              <CheckCircle2 size={13} /> Email sent to {emailForReply}
            </div>
          )}

          {showDirectReply && emailForReply && (
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500">
                To: <span className="font-semibold text-slate-700">{emailForReply}</span>
                {displayName !== emailForReply && (
                  <span className="ml-1 text-slate-400">({displayName})</span>
                )}
              </div>
              <textarea
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder="Write your reply…"
                rows={5}
                className="w-full px-3 py-2.5 text-[13px] text-slate-800 focus:outline-none resize-y"
              />
              <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">
                  Sent as <strong>Dropyard Support</strong>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setShowDirectReply(false); setReplyBody(""); }}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={sendDirectReply}
                    disabled={sendingReply || !replyBody.trim()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[11px] font-semibold transition"
                  >
                    {sendingReply ? <Loader2 size={11} className="animate-spin" /> : <Mail size={11} />}
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </footer>
      </aside>
    </div>
  );
}

function Meta({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-1">
        {icon}
        {label}
      </dt>
      <dd className="text-[12px] text-slate-800 font-medium">{children}</dd>
    </div>
  );
}

function StatusAction({
  label,
  icon,
  active,
  loading,
  tone,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  loading: boolean;
  tone: "sky" | "emerald" | "slate";
  onClick: () => void;
}) {
  const styles: Record<string, string> = {
    sky:     "bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
    slate:   "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={active || loading}
      className={`inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg border text-[11px] font-bold transition-colors ${
        active
          ? `${styles[tone]} ring-2 ring-offset-1 ring-current cursor-default`
          : `${styles[tone]} disabled:opacity-50`
      }`}
    >
      {loading ? <Loader2 size={11} className="animate-spin" /> : icon}
      {label}
    </button>
  );
}

// ── Skeleton ────────────────────────────────────────────────────

function RowsSkeleton() {
  return (
    <ul className="divide-y divide-slate-100/80">
      {Array.from({ length: 5 }).map((_, i) => (
        <li
          key={i}
          className="grid grid-cols-[2fr_1fr_1fr_2fr_1fr_1fr_40px] gap-3 px-4 py-3 items-center"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-slate-100 animate-pulse" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
              <div className="h-2.5 w-40 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-5 w-20 bg-slate-100 rounded-full animate-pulse" />
          <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
          <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
          <div className="h-5 w-16 bg-slate-100 rounded-full animate-pulse" />
          <div className="h-5 w-20 bg-slate-100 rounded-full animate-pulse" />
          <div />
        </li>
      ))}
    </ul>
  );
}

// ── Empty state ─────────────────────────────────────────────────

function EmptyInbox({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="py-16 text-center px-6">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-amber-50 ring-4 ring-emerald-100/60">
        <Inbox size={22} className="text-emerald-700" />
      </div>
      <p className="text-slate-800 font-bold">
        {hasFilter ? "Nothing matches" : "Inbox is empty"}
      </p>
      <p className="text-slate-500 text-[13px] mt-1 max-w-xs mx-auto">
        {hasFilter
          ? "Try clearing your filters or search query."
          : "Submissions from contact forms, waitlists, and reports will land here."}
      </p>
    </div>
  );
}
