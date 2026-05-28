"use client";

import React, { useEffect, useState } from "react";
import { User, Mail, Loader2, Check } from "lucide-react";
import { useAuth, type AuthUser } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

interface Props {
  /** Tailwind theme accent for the save button. */
  accent?: "emerald" | "amber";
}

export default function ProfileForm({ accent = "emerald" }: Props) {
  const { user, refreshUser } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // Keep local state in sync if the user object refreshes mid-edit
  // (e.g. another tab updated it).
  useEffect(() => {
    setFirstName(user?.firstName ?? "");
    setLastName(user?.lastName ?? "");
  }, [user?.firstName, user?.lastName]);

  if (!user) return null;

  const dirty =
    firstName.trim() !== (user.firstName ?? "") ||
    lastName.trim() !== (user.lastName ?? "");

  const accentBtnEnabled =
    accent === "amber"
      ? "bg-amber-600 hover:bg-amber-700 text-white shadow-[0_8px_18px_rgba(217,119,6,0.22)]"
      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_8px_18px_rgba(5,150,105,0.22)]";
  // Disabled buttons use a clear bordered look instead of opacity so they don't
  // look like they're floating into adjacent content.
  const accentBtnDisabled = "bg-white border border-[#EDE8E0] text-[#A8A39A] cursor-not-allowed";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are both required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await apiRequest("/api/auth/me/profile", {
        method: "PATCH",
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      });
      await refreshUser();
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 2400);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : null;

  const headerAccent =
    accent === "amber"
      ? { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" }
      : { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" };

  return (
    <section className="rounded-2xl bg-white border border-[#EDE8E0] shadow-[0_4px_16px_rgba(31,29,25,0.04)] overflow-hidden">
      <header className="px-6 py-4 border-b border-[#EDE8E0] flex items-center gap-2.5 bg-white">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${headerAccent.bg} ${headerAccent.text} ring-1 ${headerAccent.ring}`}>
          <User size={15} />
        </span>
        <h2 className="text-[14px] font-bold text-[#1F1D19]">Profile information</h2>
      </header>

      <form onSubmit={handleSubmit} className="p-6 gap-5 flex-1 flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First name" htmlFor="profile-first">
            <input
              id="profile-first"
              type="text"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); if (error) setError(""); }}
              autoComplete="given-name"
              disabled={saving}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[14px] text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition disabled:opacity-60"
            />
          </Field>
          <Field label="Last name" htmlFor="profile-last">
            <input
              id="profile-last"
              type="text"
              value={lastName}
              onChange={(e) => { setLastName(e.target.value); if (error) setError(""); }}
              autoComplete="family-name"
              disabled={saving}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[14px] text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition disabled:opacity-60"
            />
          </Field>
        </div>

        <Field label="Email" htmlFor="profile-email">
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              id="profile-email"
              type="email"
              value={user.email}
              readOnly
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-[14px] text-slate-600 cursor-not-allowed"
            />
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">
            To change your email, contact <a href="/contact" className="text-emerald-700 font-medium hover:underline">support</a>.
          </p>
        </Field>

        {(memberSince || user.role) && (
          <div className="rounded-xl bg-[#FBF9F3] border border-[#EDE8E0] px-3.5 py-2.5 flex flex-wrap items-center gap-x-6 gap-y-1.5">
            {memberSince && (
              <Meta label="Member since" value={memberSince} />
            )}
            {user.role && (
              <Meta label="Role" value={user.role.charAt(0) + user.role.slice(1).toLowerCase()} />
            )}
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2">
            <p className="text-[12px] text-rose-700 font-medium">{error}</p>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-[#EDE8E0]">
          {savedAt ? (
            <p className="inline-flex items-center gap-1.5 text-[13px] text-emerald-700 font-medium">
              <Check size={14} /> Changes saved
            </p>
          ) : <span className="text-[12px] text-slate-500">Save when you&apos;re ready.</span>}
          <button
            type="submit"
            disabled={!dirty || saving}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-bold transition ${(!dirty || saving) ? accentBtnDisabled : accentBtnEnabled}`}
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{label}</span>
      <span className="text-[13px] font-semibold text-slate-700">{value}</span>
    </div>
  );
}

// Re-export AuthUser type so consumers don't need to import from two places.
export type { AuthUser };
