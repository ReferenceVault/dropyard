"use client";

// Faithful copy of /preview/feedback/early-access-banner.jsx — do not modify
// in isolation. If the preview changes, mirror the change here.

import React, { useState, useEffect } from "react";
import { submitSubmission, isValidEmail } from "@/lib/submissions";

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
  const [count, setCount] = useState(1482);

  // Persist email across visits
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("dropyard_email") : null;
    if (saved) setEmail(saved);
  }, []);

  // Subtle live counter (growth signal)
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 2));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setError("Enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await submitSubmission({
        type: "EARLY_ACCESS_SIGNUP",
        source: "homepage-early-access",
        payload: { email: email.trim() },
      });
      localStorage.setItem("dropyard_email", email);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your spot. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-[#f9fbf9] py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">

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

        {/* HEADLINE */}
        <h2 className="mt-2 text-[28px] sm:text-[34px] lg:text-[46px] font-semibold tracking-tighter text-[#0b2f20] leading-[1.05]">
          Get the Friday email for{" "}
          <span className="text-[#ff9412]">Barrhaven.</span>
        </h2>

        {/* SUBTEXT */}
        <p className="mt-3 text-[15px] text-slate-600 leading-relaxed max-w-2xl mx-auto">
          One email every Friday with the weekend&rsquo;s best items, plus what&rsquo;s new on The Shelf. No spam. Unsubscribe anytime.
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

        {/* SOCIAL PROOF (LIVE) */}
        <div className="mt-5 text-[12px] tracking-wide text-slate-500">
          <span className="font-semibold text-[#0b2f20]">{count.toLocaleString()} neighbours</span> already joined &middot; One email/week &middot; No spam
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
