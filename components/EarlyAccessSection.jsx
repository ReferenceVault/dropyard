"use client";

// BUG-071 — Early-access email capture.
// Posts to the new dedicated /api/email-subscriptions endpoint which
// silently re-subscribes / dedups. Counter is real (from /count) and
// only shown once the audience crosses 100, per spec.

import React, { useState, useEffect } from "react";
import { isValidEmail } from "@/lib/submissions";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function MailIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="2" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function EarlyAccessSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Real subscriber count from backend. `showProof` is false until the
  // count crosses the threshold (100). Until then we hide the counter line
  // entirely and replace it with a privacy-first trust line.
  const [count, setCount] = useState(0);
  const [showProof, setShowProof] = useState(false);

  // Persist email across visits — only as a convenience for the field's
  // initial value. AuthContext clears this on signout (BUG-063).
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("dropyard_email") : null;
    if (saved) setEmail(saved);
  }, []);

  // Real count from the backend. Re-fetched after every successful
  // submission so the number ticks up naturally.
  useEffect(() => {
    let cancelled = false;
    fetch(`${BASE_URL}/api/email-subscriptions/count`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (cancelled || !j) return;
        if (typeof j.total === "number")    setCount(j.total);
        if (typeof j.showProof === "boolean") setShowProof(j.showProof);
      })
      .catch(() => { /* silent — homepage shouldn't error */ });
    return () => { cancelled = true; };
  }, [submitted]);

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/email-subscriptions`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim(), source: "homepage-early-access" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data && data.error) || "Could not save your spot. Try again.");
      }
      localStorage.setItem("dropyard_email", email);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your spot. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // BUG-071 — id="early-access" anchor target for the hero card's
    // "Get Notified" button. scroll-mt-20 leaves room for the sticky
    // header so the headline isn't clipped after the smooth scroll.
    <section id="early-access" className="relative bg-[#f9fbf9] py-12 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-mt-20">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 w-96 h-96 bg-[#2f8a22]/10 rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#ff9412]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">

        {/* LABEL */}
        <p className="text-[11px] font-bold tracking-[0.18em] text-[#ff9412] uppercase">
          Early Access
        </p>

        {/* HEADLINE — BUG-071 soft / honest copy. Old copy promised a
            weekly newsletter we don't yet send (CASL risk). */}
        <h2 className="mt-2 text-[28px] sm:text-[34px] lg:text-[46px] font-semibold tracking-tighter text-[#0b2f20] leading-[1.05]">
          Be first in line for{" "}
          <span className="text-[#ff9412]">Barrhaven drops.</span>
        </h2>

        {/* SUBTEXT */}
        <p className="mt-3 text-[15px] text-slate-600 leading-relaxed max-w-2xl mx-auto">
          We&rsquo;ll email you when the next weekend Drop goes live &mdash; and occasionally with featured items. No spam. Unsubscribe anytime.
        </p>

        {/* INPUT + CTA */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className={`relative flex items-center gap-3 w-full sm:w-auto bg-white rounded-full px-6 py-4 shadow-md border transition ${
            error
              ? "border-red-400 animate-shake"
              : "border-slate-200 focus-within:ring-2 focus-within:ring-[#2f8a22]/20"
          }`}>
            <MailIcon className="h-5 w-5 text-slate-400" />
            <input
              type="email"
              placeholder="you@barrhaven.ca"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="outline-none bg-transparent text-[13px] w-full sm:w-72"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="group inline-flex items-center justify-center rounded-full bg-[#2f8a22] px-8 py-4 text-[13px] font-bold text-white shadow-[0_15px_35px_rgba(47,138,34,0.3)] transition duration-300 hover:-translate-y-1 hover:bg-[#26751d] disabled:opacity-70"
          >
            {loading ? "Saving your spot..." : "Save my spot"}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <p className="mt-4 text-[13px] text-red-500">{error}</p>
        )}

        {/* SUCCESS STATE */}
        {submitted && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="text-[23px]">🎉</div>
            <p className="text-[13px] text-[#2f8a22] font-semibold">
              You&rsquo;re in. Friday just got better.
            </p>
          </div>
        )}

        {/* SOCIAL PROOF — BUG-071 honest behavior.
            Until we have ≥ 100 active subscribers, show a trust line in
            place of a count (the old code faked a 1,482 counter that
            ticked up by random — that's gone). */}
        <div className="mt-5 text-[12px] tracking-wide text-slate-500">
          {showProof ? (
            <><span className="font-semibold text-[#0b2f20]">{count.toLocaleString()} neighbours</span> already joined &middot; No spam &middot; Unsubscribe anytime</>
          ) : (
            <>Your email is only used for drop alerts &middot; Unsubscribe anytime</>
          )}
        </div>

        {/* TRUST BADGES */}
        <div className="mt-3 flex justify-center gap-6 text-[12px] text-slate-400">
          <span>&#10004; Privacy-first</span>
          <span>&#10004; No spam ever</span>
          <span>&#10004; One-click unsubscribe</span>
        </div>
      </div>
    </section>
  );
}
