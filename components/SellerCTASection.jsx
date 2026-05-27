"use client";

// Faithful copy of /preview/feedback/ready-to-start-selling.jsx — only
// deviation is that CTA buttons accept onClick props so they navigate.
// Visual + copy is byte-for-byte identical to the preview.

import React from "react";

function ArrowIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkleIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function SellerIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 19h16M6 19V9l6-4 6 4v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 19v-6h6v6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export default function SellerCTASection(props) {
  const onCTA = props && props.onCTA;
  return (
    <section className="relative overflow-hidden bg-[#f6a000] px-4 py-10 sm:px-6 lg:px-8">
      {/* ambient shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 bottom-[-8rem] h-80 w-80 rounded-full bg-white/8 blur-sm" />
        <div className="absolute right-20 top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-white/10 blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#ffb020] via-[#f59e0b] to-[#e87900]" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/30" />
      </div>

      <div className="relative mx-auto max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
          <SellerIcon className="h-4 w-4" />
          Start selling locally
        </div>

        <h2 className="mx-auto mt-3 max-w-4xl text-[27px] font-semibold tracking-tighter leading-[1.05] text-white sm:text-[39px] lg:text-[51px]">
          Ready to start selling?
        </h2>

        <p className="mx-auto mt-3 text-[15px] leading-6 text-white/88 sm:whitespace-nowrap">
          Join DropYard and turn your unused items into cash. List items yourself now &mdash; with AI-assisted listing coming soon.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button onClick={onCTA} className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-7 py-3.5 text-[15px] font-black text-[#d97706] shadow-[0_22px_55px_rgba(15,23,42,0.16)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#fffaf0] sm:w-auto">
            Become a Seller
            <ArrowIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button disabled className="group inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/35 bg-white/10 px-7 py-3.5 text-[15px] font-black text-white backdrop-blur-md transition-all duration-300 sm:w-auto cursor-not-allowed opacity-90">
            <SparkleIcon className="h-5 w-5" />
            AI Agent Coming Soon
          </button>
        </div>

        <p className="mt-5 text-[13px] font-medium text-white/75">
          Free to list &middot; Local buyers &middot; Simple pickup flow
        </p>
      </div>
    </section>
  );
}
