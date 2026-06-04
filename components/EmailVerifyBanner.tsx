"use client";

import React, { useState } from "react";
import { Mail, X, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

/**
 * Soft email-verification banner. Renders at the top of any authenticated page
 * when the current user's `verifiedAt` is null. Lets them resend the email
 * without leaving the dashboard. Doesn't gate any features yet.
 */
export function EmailVerifyBanner() {
  const { user, accessToken } = useAuth();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [dismissed, setDismissed] = useState(false);

  if (!user || user.verifiedAt || dismissed) return null;

  const resend = async () => {
    if (!accessToken) return;
    setState("sending");
    try {
      await apiRequest("/api/auth/me/resend-verification", {
        method: "POST",
        token:  accessToken,
      });
      setState("sent");
    } catch {
      setState("error");
    }
  };

  return (
    <div
      role="status"
      className="relative w-full overflow-hidden"
      style={{ zIndex: 40 }}
    >
      {/* Subtle dot-grid texture matches the admin login + footer style. Hidden
          when very narrow to keep the strip readable on phones. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 pointer-events-none hidden sm:block"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(217,119,6,0.10) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Warm amber gradient bed with brand-aligned border */}
      <div className="relative bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b border-amber-200/70">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center gap-3 sm:gap-4">
          {/* Halo icon badge */}
          <div className="relative shrink-0">
            {state !== "sent" && (
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-amber-400/30 blur-md animate-pulse"
              />
            )}
            <div
              className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center shadow-sm transition-colors ${
                state === "sent"
                  ? "bg-gradient-to-br from-emerald-100 to-emerald-200 border-emerald-300/60"
                  : "bg-gradient-to-br from-amber-100 to-amber-200 border-amber-300/60"
              }`}
            >
              {state === "sent" ? (
                <CheckCircle2 size={18} className="text-emerald-700" strokeWidth={2.3} />
              ) : (
                <Mail size={17} className="text-amber-700" strokeWidth={2.2} />
              )}
            </div>
          </div>

          {/* Text — title + subtitle on desktop, single line on small */}
          <div className="flex-1 min-w-0">
            {state === "sent" ? (
              <div>
                <p className="text-[14px] sm:text-[15px] font-bold text-emerald-900 leading-tight">
                  Verification email sent
                </p>
                <p className="text-[12px] sm:text-[13px] text-emerald-800/80 mt-0.5 truncate">
                  Check your inbox — and don&rsquo;t forget the spam folder.
                </p>
              </div>
            ) : state === "error" ? (
              <p className="text-[14px] sm:text-[15px] font-semibold text-amber-900 leading-tight">
                We couldn&rsquo;t send the verification email. Try again in a minute.
              </p>
            ) : (
              <div>
                <p className="text-[14px] sm:text-[15px] font-bold text-amber-950 leading-tight tracking-tight">
                  Verify your email to unlock the full DropYard experience
                </p>
                <p className="text-[12px] sm:text-[13px] text-amber-800/85 mt-0.5 truncate">
                  We sent a link to{" "}
                  <span className="font-semibold text-amber-900">{user.email}</span>
                </p>
              </div>
            )}
          </div>

          {/* Sparkly CTA — shimmer on hover, glow, scale lift */}
          <div className="flex items-center gap-1.5 shrink-0">
            {state !== "sent" && (
              <button
                type="button"
                onClick={resend}
                disabled={state === "sending"}
                className="group relative inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 min-h-11 sm:min-h-0 rounded-full text-[13px] sm:text-sm font-bold text-white overflow-hidden transition-all shadow-md shadow-amber-500/30 hover:shadow-lg hover:shadow-amber-500/40 hover:scale-105 active:scale-100 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
                style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #f0900d 50%, #d97706 100%)",
                }}
              >
                {/* Shimmer sweep — slides across on hover. Pointer-events-none
                    so it doesn't intercept the click. */}
                <span
                  aria-hidden
                  className="absolute inset-y-0 -inset-x-1/2 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none"
                  style={{
                    background: "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)",
                  }}
                />
                {state === "sending" ? (
                  <>
                    <Loader2 size={14} className="animate-spin relative z-10" />
                    <span className="relative z-10 hidden sm:inline">Sending…</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} className="relative z-10 group-hover:rotate-12 transition-transform" />
                    <span className="relative z-10">Resend email</span>
                  </>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss banner"
              className="p-1.5 rounded-full text-amber-700/70 hover:text-amber-900 hover:bg-amber-100/70 active:scale-95 transition-all"
            >
              <X size={14} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
