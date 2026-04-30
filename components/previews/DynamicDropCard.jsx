"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Clock3,
  Package,
  ShoppingBag,
  Store,
  ArrowRight,
  Eye,
  Zap,
  CheckCircle2,
} from "lucide-react";

const previewItems = [
  { id: 1, name: "IKEA Kallax Shelf", price: 45, icon: "🪑", watchers: 6 },
  { id: 2, name: "Dyson V8 Vacuum", price: 180, icon: "🔌", watchers: 9 },
  { id: 3, name: "KitchenAid Mixer", price: 120, icon: "🍳", watchers: 3 },
];

const liveItems = [
  { id: 1, name: "IKEA Kallax Shelf", price: 45, icon: "🪑", status: "available", label: "Claim Now" },
  { id: 2, name: "Dyson V8 Vacuum", price: 180, icon: "🔌", status: "claimed", label: "Just Claimed" },
  { id: 3, name: "KitchenAid Mixer", price: 120, icon: "🍳", status: "available", label: "Grab It" },
];

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function CountdownUnit({ value, label }) {
  return (
    <div className="rounded-xl bg-[#066544] px-2.5 py-1.5 text-center text-white ring-1 ring-white/10">
      <div className="text-lg font-bold tracking-tight">{String(value).padStart(2, "0")}</div>
      <div className="text-[9px] font-medium uppercase tracking-widest text-emerald-100">{label}</div>
    </div>
  );
}

function PreviewRow({ item, index }) {
  const labels = ["Be Ready", "Launching Soon", "Watch Item"];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.07 }}
      className="flex items-center justify-between gap-2 rounded-xl bg-white/80 px-3 py-2.5 shadow-sm ring-1 ring-slate-100"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-lg ring-1 ring-amber-100">
          {item.icon}
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">{item.name}</div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-emerald-700">${item.price}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" />{item.watchers}</span>
          </div>
        </div>
      </div>
      <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        {labels[index % labels.length]}
      </span>
    </motion.div>
  );
}

function LiveRow({ item, index }) {
  const isAvailable = item.status === "available";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.07 }}
      className="flex items-center justify-between gap-2 rounded-xl bg-white/85 px-3 py-2.5 shadow-sm ring-1 ring-slate-100"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-lg ring-1 ring-emerald-100">
          {item.icon}
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">{item.name}</div>
          <div className="text-xs text-slate-500">
            <span className="font-semibold text-emerald-700">${item.price}</span>
            {isAvailable ? " · Going fast" : " · Claimed"}
          </div>
        </div>
      </div>
      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
        {item.label}
      </span>
    </motion.div>
  );
}

export default function DynamicDropCard() {
  const [targetTime] = useState(() => Date.now() + (((5 * 24 + 5) * 60 + 10) * 60 * 1000));
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const remaining = Math.max(targetTime - now, 0);
  const isLive = remaining <= 0;
  const time = useMemo(() => formatDuration(remaining), [remaining]);

  return (
    <div className="w-full max-w-sm ml-auto rounded-2xl bg-white shadow-xl ring-1 ring-slate-200/80 overflow-hidden">
      {/* Header */}
      <div className={`relative overflow-hidden px-4 py-3.5 text-white ${isLive ? "bg-emerald-700" : "bg-gradient-to-r from-emerald-700 to-emerald-600"}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_28%)]" />
        <div className="relative flex items-center justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-1.5">
              {isLive ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold ring-1 ring-white/20">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                  LIVE NOW
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold ring-1 ring-white/20">
                  <Bell className="h-3 w-3" />
                  GOING LIVE SOON
                </span>
              )}
            </div>
            <h2 className="text-base font-bold leading-tight">Barrhaven Launch Drop</h2>
            <p className="mt-0.5 text-xs text-emerald-100">
              {isLive ? "Jump in before items are gone." : `Live in ${time.days}d ${time.hours}h ${time.minutes}m`}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLive ? "live" : "countdown"}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-1 shrink-0"
            >
              {isLive ? (
                <div className="rounded-xl bg-[#066544] px-3 py-1.5 text-xs font-semibold tracking-wide text-emerald-100 ring-1 ring-white/10">
                  NOW
                </div>
              ) : (
                <>
                  <CountdownUnit value={time.hours} label="Hrs" />
                  <CountdownUnit value={time.minutes} label="Min" />
                  <CountdownUnit value={time.seconds} label="Sec" />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50">
        {[
          { icon: Package, value: "150+", label: isLive ? "Items Live" : "Dropping", color: "text-slate-900" },
          { icon: ShoppingBag, value: "42", label: isLive ? "Claimed" : "Waiting", color: isLive ? "text-emerald-600" : "text-amber-500" },
          { icon: Store, value: "24", label: "Sellers", color: "text-amber-500" },
        ].map(({ icon: Icon, value, label, color }) => (
          <div key={label} className="border-r last:border-r-0 border-slate-200 py-3 text-center">
            <Icon className="mx-auto h-3.5 w-3.5 text-slate-400" />
            <div className={`mt-0.5 text-xl font-bold tracking-tight ${color}`}>{value}</div>
            <div className="text-[11px] text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-2 p-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLive ? "live-list" : "preview-list"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-2"
          >
            {isLive
              ? liveItems.map((item, i) => <LiveRow key={item.id} item={item} index={i} />)
              : previewItems.map((item, i) => <PreviewRow key={item.id} item={item} index={i} />)}
          </motion.div>
        </AnimatePresence>

        <motion.a
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.99 }}
          href="#"
          className={`mt-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition ${isLive ? "bg-emerald-700 hover:bg-emerald-800" : "bg-slate-900 hover:bg-slate-800"}`}
        >
          {isLive ? <><Zap className="h-4 w-4" />Enter the Live Drop</> : <><Bell className="h-4 w-4" />Get Notified</>}
          <ArrowRight className="h-4 w-4" />
        </motion.a>

        <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          {isLive
            ? <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />Items being claimed in real time.</>
            : <><Clock3 className="h-3.5 w-3.5 text-amber-600" />Be first in line when it opens.</>}
        </p>
      </div>
    </div>
  );
}
