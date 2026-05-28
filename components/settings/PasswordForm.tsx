"use client";

import React, { useState } from "react";
import { Lock, KeyRound, Eye, EyeOff, Loader2, Check, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

interface Props {
  accent?: "emerald" | "amber";
}

const REFRESH_TOKEN_KEY = "dy_refresh_token";

/**
 * Renders one of two UIs depending on whether the user already has a password:
 *   - hasPassword === false → "Set a password" (single new + confirm)
 *   - hasPassword === true  → "Change password" (current + new + confirm)
 */
export default function PasswordForm({ accent = "emerald" }: Props) {
  const { user, refreshUser } = useAuth();

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showNext, setShowNext] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);

  if (!user) return null;

  const isSetMode = user.hasPassword === false;

  const accentBtnEnabled =
    accent === "amber"
      ? "bg-amber-600 hover:bg-amber-700 text-white shadow-[0_8px_18px_rgba(217,119,6,0.22)]"
      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_8px_18px_rgba(5,150,105,0.22)]";
  const accentBtnDisabled = "bg-white border border-[#EDE8E0] text-[#A8A39A] cursor-not-allowed";

  const resetForm = () => {
    setCurrent("");
    setNext("");
    setConfirm("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (next.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (!isSetMode && !current) {
      setError("Enter your current password.");
      return;
    }

    setSaving(true);
    try {
      const path = isSetMode
        ? "/api/auth/me/set-password"
        : "/api/auth/me/change-password";
      const body = isSetMode
        ? JSON.stringify({ newPassword: next })
        : JSON.stringify({ currentPassword: current, newPassword: next });

      const data = await apiRequest<{ refreshToken?: string }>(path, {
        method: "POST",
        body,
      });

      // Backend rotates the refresh token so other devices are signed out.
      if (data.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      }

      await refreshUser();
      resetForm();
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 2800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password.");
    } finally {
      setSaving(false);
    }
  };

  const headerAccent =
    accent === "amber"
      ? { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" }
      : { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" };

  return (
    <section className="rounded-2xl bg-white border border-[#EDE8E0] shadow-[0_4px_16px_rgba(31,29,25,0.04)] overflow-hidden">
      <header className="px-6 py-4 border-b border-[#EDE8E0] flex items-center gap-2.5 bg-white">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${headerAccent.bg} ${headerAccent.text} ring-1 ${headerAccent.ring}`}>
          {isSetMode ? <KeyRound size={15} /> : <Lock size={15} />}
        </span>
        <h2 className="text-[14px] font-bold text-[#1F1D19] flex-1">
          {isSetMode ? "Set a password" : "Change password"}
        </h2>
        {isSetMode && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.18em]">
            <ShieldCheck size={10} /> Google only
          </span>
        )}
      </header>

      <form onSubmit={handleSubmit} className="p-6 gap-5 flex-1 flex flex-col">
        {!isSetMode && (
          <Field label="Current password" htmlFor="pw-current">
            <input
              id="pw-current"
              type="password"
              value={current}
              onChange={(e) => { setCurrent(e.target.value); if (error) setError(""); }}
              autoComplete="current-password"
              disabled={saving}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[14px] text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition disabled:opacity-60"
            />
          </Field>
        )}

        <Field label={isSetMode ? "New password" : "New password"} htmlFor="pw-next">
          <div className="relative">
            <input
              id="pw-next"
              type={showNext ? "text" : "password"}
              value={next}
              onChange={(e) => { setNext(e.target.value); if (error) setError(""); }}
              autoComplete="new-password"
              disabled={saving}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-[14px] text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowNext((v) => !v)}
              tabIndex={-1}
              aria-label={showNext ? "Hide password" : "Show password"}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showNext ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>

        <Field label="Confirm new password" htmlFor="pw-confirm">
          <input
            id="pw-confirm"
            type={showNext ? "text" : "password"}
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); if (error) setError(""); }}
            autoComplete="new-password"
            disabled={saving}
            placeholder="Re-enter new password"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[14px] text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition disabled:opacity-60"
          />
        </Field>

        {error && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2">
            <p className="text-[12px] text-rose-700 font-medium">{error}</p>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-[#EDE8E0]">
          {savedAt ? (
            <p className="inline-flex items-center gap-1.5 text-[13px] text-emerald-700 font-medium">
              <Check size={14} /> {isSetMode ? "Password set" : "Password updated"}
            </p>
          ) : (
            <span className="text-[12px] text-slate-500">
              {isSetMode ? "Adds a password so you can sign in with email too." : "Other devices will be signed out."}
            </span>
          )}
          {(() => {
            const isDisabled = saving || !next || !confirm || (!isSetMode && !current);
            return (
              <button
                type="submit"
                disabled={isDisabled}
                className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-bold transition ${isDisabled ? accentBtnDisabled : accentBtnEnabled}`}
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving
                  ? "Saving..."
                  : isSetMode
                  ? "Set password"
                  : "Update password"}
              </button>
            );
          })()}
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
