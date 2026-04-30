"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Clock,
  ArrowRight,
  Package,
  Calendar,
  Heart,
  Camera,
  Zap,
  TrendingDown,
  Users,
  Sparkles,
  Store,
  Layers3,
  Wand2,
  ChevronRight,
  ShieldCheck,
  TimerReset,
} from "lucide-react";

const C = {
  gLightBg: "#E8F5E9",
  gSoft: "#C8E6C9",
  gAccent: "#4CAF50",
  gPrimary: "#2F8F2F",
  gHover: "#3D9C3D",
  gDark: "#1F6F1F",
  gGlow: "rgba(76, 175, 80, 0.22)",

  oLightBg: "#FFF7ED",
  oSoft: "#FED7AA",
  oAccent: "#F59E0B",
  oPrimary: "#F08A00",
  oHover: "#C96F00",
  oDark: "#7A4300",
  oGlow: "rgba(240, 138, 0, 0.18)",

  tPrimary: "#0F766E",
  tLight: "#CCFBF1",
  tSoft: "#99F6E4",
  tHover: "#115E59",
  tGlow: "rgba(15, 118, 110, 0.25)",

  ai: "#7C3AED",
  aiLight: "#F5F3FF",
  aiBorder: "#DDD6FE",
  aiGlow: "rgba(124, 58, 237, 0.18)",

  ink: "#0F172A",
  softInk: "#475569",
  line: "#E2E8F0",
};

const F = {
  h: "Outfit, sans-serif",
  b: "Plus Jakarta Sans, sans-serif",
};

const weeklyFeatures = [
  "48-hour claiming window — urgency drives action",
  "List alongside your neighbours in one community event",
  "Buyers browse, save favourites, claim & schedule pickup",
  "Unsold items roll to the Shelf automatically",
  "AI Agent: 5 free AI listings per month included",
];

const dedFeatures = [
  "Your own seller storefront with featured placement",
  "Custom date range — you set the start and end",
  "Visible during live Drops AND between Drops",
  "Promotional email to buyers in your area",
  "Unlimited item listings — no cap",
  "Unsold items stay on the Shelf for 30 days",
  "Full AI Agent included with unlimited listings",
];

const shelfFeatures = [
  { icon: "♻️", text: "Auto-rolls from Drop" },
  { icon: "📉", text: "AI price reductions" },
  { icon: "🔄", text: "Re-Drop with one click" },
  { icon: "🤝", text: "Donation option after 30 days" },
];

const lifecycleSteps = [
  {
    step: "Listed",
    time: "Monday",
    bg: C.oLightBg,
    color: C.oPrimary,
    icon: Camera,
    desc: "You upload photos, AI creates listing",
  },
  {
    step: "In the Drop",
    time: "Saturday",
    bg: C.gLightBg,
    color: C.gPrimary,
    icon: Zap,
    desc: "Live for 48 hours — buyers claim",
  },
  {
    step: "On the Shelf",
    time: "Monday",
    bg: C.oLightBg,
    color: C.oPrimary,
    icon: Package,
    desc: "Unsold? Auto-moves here. Still visible.",
  },
  {
    step: "AI reduces price",
    time: "Day 10",
    bg: C.aiLight,
    color: C.ai,
    icon: TrendingDown,
    desc: "AI suggests 20% reduction",
  },
  {
    step: "Re-Dropped or donated",
    time: "Day 14+",
    bg: "#FEF2F2",
    color: "#DC2626",
    icon: ArrowRight,
    desc: "Back to the next Drop or donated",
  },
];

const weeklyTimeline = [
  { day: "Mon–Wed", act: "List items", icon: Camera, color: C.oPrimary },
  { day: "Thu–Fri", act: "Buyers preview", icon: Heart, color: C.ai },
  { day: "Sat 8am", act: "Drop goes live!", icon: Zap, color: C.gPrimary },
  { day: "Sun 8pm", act: "Drop closes", icon: Clock, color: "#DC2626" },
];

const heroStats = [
  { value: 48, suffix: "hr", label: "urgent claiming window", icon: TimerReset, glow: C.gGlow },
  { value: 30, suffix: " days", label: "shelf persistence", icon: Layers3, glow: C.oGlow },
  { value: 100, suffix: "%", label: "AI-assisted listing flow", icon: Wand2, glow: C.aiGlow },
];

const saleTabs = [
  { id: "moving", label: "🚚 Moving", price: "$49" },
  { id: "estate", label: "🏠 Estate", price: "$79" },
  { id: "garage", label: "🏷️ Garage", price: "$29" },
];

function AnimatedNumber({ value, suffix = "", duration = 1.3 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <>{display}{suffix}</>;
}

function GlowOrb({ color, size, top, left, right, bottom }) {
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: "blur(60px)",
        top,
        left,
        right,
        bottom,
        pointerEvents: "none",
      }}
    />
  );
}

export default function WaysToDropSection() {
  const [weeklyHover, setWeeklyHover] = useState(false);
  const [dedHover, setDedHover] = useState(false);
  const [shelfHover, setShelfHover] = useState(false);
  const [lifecycleHover, setLifecycleHover] = useState(false);
  const [activeDed, setActiveDed] = useState("moving");
  const [activeLife, setActiveLife] = useState(1);
  const [activeWeeklyStep, setActiveWeeklyStep] = useState(2);

  useEffect(() => {
    const weeklyTimer = setInterval(() => {
      setActiveWeeklyStep((s) => (s + 1) % weeklyTimeline.length);
    }, 1800);
    const lifeTimer = setInterval(() => {
      setActiveLife((s) => (s + 1) % lifecycleSteps.length);
    }, 2200);
    return () => {
      clearInterval(weeklyTimer);
      clearInterval(lifeTimer);
    };
  }, []);

  const weeklyCardStyle = useMemo(
    () => ({
      flex: "1 1 480px",
      borderRadius: 30,
      overflow: "hidden",
      border: `1px solid ${weeklyHover ? C.gAccent : C.gSoft}`,
      backgroundColor: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(16px)",
      display: "flex",
      flexDirection: "column",
      boxShadow: weeklyHover
        ? `0 36px 90px ${C.gGlow}, 0 18px 42px ${C.oGlow}`
        : "0 14px 36px rgba(17,24,39,0.08)",
      transform: weeklyHover ? "translateY(-8px)" : "translateY(0px)",
      transition: "transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease",
      position: "relative",
    }),
    [weeklyHover]
  );

  const dedCardStyle = useMemo(
    () => ({
      flex: "1 1 480px",
      borderRadius: 30,
      overflow: "hidden",
      border: `1px solid ${dedHover ? C.tPrimary : C.tSoft}`,
      backgroundColor: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(16px)",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      boxShadow: dedHover
        ? `0 36px 90px ${C.tGlow}, 0 18px 42px ${C.oGlow}`
        : "0 14px 36px rgba(17,24,39,0.08)",
      transform: dedHover ? "translateY(-8px)" : "translateY(0px)",
      transition: "transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease",
    }),
    [dedHover]
  );

  const shelfCardStyle = useMemo(
    () => ({
      flex: "1 1 400px",
      padding: 24,
      borderRadius: 28,
      background: "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.96) 100%)",
      boxShadow: shelfHover
        ? `0 30px 70px rgba(0,0,0,0.10), 0 12px 30px ${C.oGlow}`
        : "0 18px 42px rgba(0,0,0,0.07)",
      border: "1px solid rgba(255,255,255,0.85)",
      position: "relative",
      overflow: "hidden",
      transform: shelfHover ? "translateY(-5px)" : "translateY(0px)",
      transition: "transform 240ms ease, box-shadow 240ms ease",
      backdropFilter: "blur(14px)",
    }),
    [shelfHover]
  );

  const lifecycleCardStyle = useMemo(
    () => ({
      borderRadius: 28,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.85)",
      background: "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.96) 100%)",
      boxShadow: lifecycleHover
        ? `0 34px 80px rgba(0,0,0,0.11), 0 12px 28px ${C.oGlow}`
        : "0 20px 50px rgba(0,0,0,0.08)",
      position: "relative",
      transform: lifecycleHover ? "translateY(-5px)" : "translateY(0px)",
      transition: "transform 240ms ease, box-shadow 240ms ease",
      backdropFilter: "blur(14px)",
    }),
    [lifecycleHover]
  );

  const dedDetails = {
    moving: {
      title: "Moving Sale Drop",
      price: "$49",
      icon: "📦",
      tagline:
        "Relocating? List your entire household. AI creates all listings from a room-by-room photo walk.",
      period: "2–4 weeks",
      items: "30–80+",
      example: "The Patel Family — relocating to Vancouver. 42 items, sold 35 in 12 days.",
      metric: "Fastest setup",
      color: C.tPrimary,
    },
    estate: {
      title: "Estate Sale Drop",
      price: "$79",
      icon: "🏠",
      tagline:
        "Settling an estate with care. Bulk upload, bundle suggestions, sensitivity options, and donation integration.",
      period: "Up to 30 days",
      items: "50–200+",
      example: "Estate of M. Williams — a lifetime of antiques and furniture. 28 items across 4 categories.",
      metric: "Highest inventory",
      color: C.ai,
    },
    garage: {
      title: "Garage Sale Drop",
      price: "$29",
      icon: "🏷️",
      tagline:
        "The classic spring cleanout — with DropYard's digital reach and your AI agent handling everything.",
      period: "1–2 weekends",
      items: "15–50",
      example: "Chris B. — garage cleanout in Stonebridge. 15 tools and sports items, sold 12 in one weekend.",
      metric: "Best starter tier",
      color: C.oPrimary,
    },
  };

  const active = dedDetails[activeDed];

  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: F.b }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <section
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 52%, #ffffff 100%)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <GlowOrb color={C.gGlow} size={340} top={40} left={-120} />
        <GlowOrb color={C.aiGlow} size={260} top={130} right={-60} />

        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 24px 0", textAlign: "center", position: "relative", zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.82)",
              border: `1px solid ${C.gSoft}`,
              marginBottom: 18,
              boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Sparkles size={14} style={{ color: C.gPrimary }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: C.gPrimary, fontFamily: F.b, letterSpacing: 0.3 }}>
              Investor Demo • How Selling Works
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            style={{
              fontSize: "clamp(34px, 5.3vw, 58px)",
              fontWeight: 900,
              color: C.ink,
              lineHeight: 1.02,
              marginBottom: 14,
              fontFamily: F.h,
              letterSpacing: -1.3,
            }}
          >
            One marketplace. <span style={{ color: C.gPrimary }}>Two selling modes.</span> <span style={{ color: C.tPrimary }}>One smart afterlife.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{
              fontSize: 17,
              color: C.softInk,
              maxWidth: 760,
              margin: "0 auto 28px",
              lineHeight: 1.7,
              fontFamily: F.b,
            }}
          >
            DropYard turns neighbourhood selling into a designed system: weekly urgency for everyday decluttering, dedicated sale infrastructure for major transitions, and an AI-powered Shelf that keeps value alive after the event ends.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 14,
              maxWidth: 900,
              margin: "0 auto 44px",
            }}
          >
            {heroStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  style={{
                    padding: "16px 18px",
                    borderRadius: 22,
                    background: "rgba(255,255,255,0.78)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.92)",
                    boxShadow: `0 20px 40px rgba(15,23,42,0.06), 0 8px 24px ${stat.glow}`,
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        display: "grid",
                        placeItems: "center",
                        background: "linear-gradient(135deg, #ffffff, #f8fafc)",
                        border: "1px solid rgba(226,232,240,0.8)",
                      }}
                    >
                      <Icon size={17} style={{ color: C.ink }} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", letterSpacing: 1.2, textTransform: "uppercase" }}>
                      Live
                    </span>
                  </div>
                  <div style={{ fontSize: 30, lineHeight: 1, fontWeight: 900, fontFamily: F.h, color: C.ink, marginBottom: 6 }}>
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div style={{ fontSize: 12, color: C.softInk, lineHeight: 1.5 }}>{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px 56px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", gap: 24, alignItems: "stretch", flexWrap: "wrap" }}>
            <motion.div
              style={weeklyCardStyle}
              onMouseEnter={() => setWeeklyHover(true)}
              onMouseLeave={() => setWeeklyHover(false)}
              whileHover={{ y: -8 }}
            >
              <div
                style={{
                  padding: "28px 32px 24px",
                  background:
                    `radial-gradient(circle at top right, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 28%), linear-gradient(135deg, ${C.gDark} 0%, ${C.gPrimary} 52%, ${C.gAccent} 100%)`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  animate={{ x: weeklyHover ? 24 : 0, opacity: weeklyHover ? 1 : 0.65 }}
                  transition={{ duration: 0.45 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(115deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.12) 48%, rgba(255,255,255,0) 78%)",
                  }}
                />
                <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.08)", filter: "blur(2px)" }} />
                <div style={{ position: "absolute", top: 14, right: 88, width: 10, height: 10, borderRadius: "50%", background: C.oAccent, boxShadow: `0 0 22px ${C.oAccent}` }} />
                <div style={{ position: "absolute", bottom: -20, left: "40%", width: 88, height: 88, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 28 }}>🎯</span>
                      <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.1, textTransform: "uppercase", color: "rgba(255,255,255,0.78)", fontFamily: F.b }}>
                        Community Engine
                      </span>
                    </div>
                    <div style={{ padding: "4px 14px", borderRadius: 999, backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}>
                      <span style={{ fontSize: 22, fontWeight: 900, color: "#fff", fontFamily: F.h }}>Free</span>
                    </div>
                  </div>
                  <h3 style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 6, fontFamily: F.h }}>The Weekly Drop</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.66)", fontFamily: F.b, maxWidth: 420 }}>
                    Recurring neighbourhood energy built for everyday sellers, lightweight inventory, and instant weekend urgency.
                  </p>
                </div>
              </div>

              <div style={{ padding: "24px 32px 28px", flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
                  {[
                    { icon: Store, text: "Shared community event" },
                    { icon: ShieldCheck, text: "Low-friction onboarding" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.text}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "8px 12px",
                          borderRadius: 999,
                          background: C.gLightBg,
                          border: `1px solid ${C.gSoft}`,
                        }}
                      >
                        <Icon size={13} style={{ color: C.gPrimary }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: C.gPrimary }}>{item.text}</span>
                      </div>
                    );
                  })}
                </div>

                <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12, fontFamily: F.b }}>
                  The weekly cycle
                </p>
                <div style={{ display: "flex", gap: 0, marginBottom: 22, position: "relative" }}>
                  {weeklyTimeline.map((step, i) => {
                    const isActive = i === activeWeeklyStep;
                    return (
                      <motion.div
                        key={step.day}
                        animate={{ y: isActive ? -3 : 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ flex: 1, textAlign: "center", position: "relative" }}
                      >
                        {i < weeklyTimeline.length - 1 && (
                          <div style={{ position: "absolute", top: 15, left: "50%", width: "100%", height: 2, backgroundColor: "rgba(0,0,0,0.06)", zIndex: 0 }} />
                        )}
                        <motion.div
                          animate={{ scale: isActive ? 1.08 : 1, boxShadow: isActive ? `0 0 0 6px ${step.color}15` : "0 0 0 0 transparent" }}
                          transition={{ duration: 0.25 }}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            backgroundColor: `${step.color}12`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 6px",
                            position: "relative",
                            zIndex: 1,
                            border: `2px solid ${step.color}25`,
                          }}
                        >
                          <step.icon size={12} style={{ color: step.color }} />
                        </motion.div>
                        <p style={{ fontSize: 10, fontWeight: 800, color: isActive ? C.ink : C.gDark, fontFamily: F.b }}>{step.day}</p>
                        <p style={{ fontSize: 9, color: isActive ? C.softInk : "#999", fontFamily: F.b }}>{step.act}</p>
                      </motion.div>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeWeeklyStep}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 14,
                      background: "linear-gradient(135deg, #F8FAFC, #FFFFFF)",
                      border: `1px solid ${C.line}`,
                      marginBottom: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 10, display: "grid", placeItems: "center", background: C.gLightBg }}>
                      <ChevronRight size={15} style={{ color: C.gPrimary }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: C.ink }}>Live step highlight</div>
                      <div style={{ fontSize: 12, color: C.softInk }}>{weeklyTimeline[activeWeeklyStep].act} drives momentum for the whole market loop.</div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div style={{ padding: "10px 14px", borderRadius: 14, backgroundColor: C.gLightBg, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <Users size={14} style={{ color: C.gPrimary }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.gPrimary, fontFamily: F.b }}>
                    Best for: Regular decluttering, seasonal cleanouts, a few items at a time
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
                  {weeklyFeatures.map((feature, i) => (
                    <motion.div key={feature} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: C.gLightBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <Check size={10} style={{ color: C.gPrimary }} />
                      </div>
                      <span style={{ fontSize: 13, color: "#555", lineHeight: 1.5, fontFamily: F.b }}>{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.995 }}
                  style={{
                    width: "100%",
                    padding: "14px 0",
                    borderRadius: 16,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 800,
                    fontFamily: F.b,
                    background: `linear-gradient(135deg, ${C.gDark} 0%, ${C.gPrimary} 65%, ${C.gAccent} 100%)`,
                    color: "#fff",
                    boxShadow: `0 10px 28px ${C.gGlow}, inset 0 1px 0 rgba(255,255,255,0.18)`,
                    marginTop: 24,
                  }}
                >
                  Start Listing — It&apos;s Free <ArrowRight size={15} style={{ display: "inline", verticalAlign: "middle", marginLeft: 6 }} />
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              style={dedCardStyle}
              onMouseEnter={() => setDedHover(true)}
              onMouseLeave={() => setDedHover(false)}
              whileHover={{ y: -8 }}
            >
              <motion.div
                animate={{ rotate: 45, scale: dedHover ? 1.04 : 1 }}
                style={{ position: "absolute", top: 18, right: -34, transform: "rotate(45deg)", padding: "5px 42px", backgroundColor: C.tPrimary, zIndex: 10, boxShadow: `0 10px 24px ${C.tGlow}` }}
              >
                <span style={{ fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: 1, fontFamily: F.b }}>PREMIUM</span>
              </motion.div>

              <div
                style={{
                  padding: "28px 32px 24px",
                  background:
                    `radial-gradient(circle at top right, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 28%), linear-gradient(135deg, ${C.tHover} 0%, ${C.tPrimary} 60%, #14b8a6 100%)`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  animate={{ x: dedHover ? 24 : 0, opacity: dedHover ? 1 : 0.65 }}
                  transition={{ duration: 0.45 }}
                  style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.12) 48%, rgba(255,255,255,0) 78%)" }}
                />
                <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.08)", filter: "blur(2px)" }} />
                <div style={{ position: "absolute", top: 14, right: 88, width: 10, height: 10, borderRadius: "50%", background: C.oAccent, boxShadow: `0 0 22px ${C.oAccent}` }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <span style={{ fontSize: 28 }}>⭐</span>
                    <div style={{ padding: "4px 14px", borderRadius: 999, backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}>
                      <span style={{ fontSize: 16, fontWeight: 900, color: "#fff", fontFamily: F.h }}>From </span>
                      <span style={{ fontSize: 22, fontWeight: 900, color: "#fff", fontFamily: F.h }}>$29</span>
                    </div>
                  </div>
                  <h3 style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 6, fontFamily: F.h }}>Dedicated Sales Drop</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.66)", fontFamily: F.b, maxWidth: 420 }}>
                    A premium operating layer for moving sales, estate transitions, and curated single-seller events.
                  </p>
                </div>
              </div>

              <div style={{ padding: "24px 32px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 12, flexWrap: "wrap" }}>
                  <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1.5, fontFamily: F.b }}>
                    Choose your sale type
                  </p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 999, background: C.aiLight, border: `1px solid ${C.aiBorder}` }}>
                    <Wand2 size={13} style={{ color: C.ai }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.ai }}>AI Agent included</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                  {saleTabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveDed(tab.id)}
                      style={{
                        flex: 1,
                        padding: "10px 6px",
                        borderRadius: 12,
                        cursor: "pointer",
                        textAlign: "center",
                        border: `2px solid ${activeDed === tab.id ? C.tPrimary : "#e5e7eb"}`,
                        background: activeDed === tab.id ? "linear-gradient(135deg, #ECFEFF, #CCFBF1)" : "#fff",
                        transition: "all 0.2s",
                        boxShadow: activeDed === tab.id ? `0 10px 24px ${C.tGlow}` : "none",
                      }}
                    >
                      <p style={{ fontSize: 12, fontWeight: 700, color: activeDed === tab.id ? C.tPrimary : "#888", fontFamily: F.b }}>{tab.label}</p>
                      <p style={{ fontSize: 14, fontWeight: 900, color: activeDed === tab.id ? C.tPrimary : "#ccc", fontFamily: F.h, marginTop: 2 }}>{tab.price}</p>
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDed}
                    initial={{ opacity: 0, y: 10, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.985 }}
                    transition={{ duration: 0.26 }}
                    style={{ padding: 16, borderRadius: 18, background: "linear-gradient(135deg, #ECFEFF, #FFFFFF)", border: `1px solid ${C.tSoft}`, marginBottom: 16, boxShadow: `0 12px 30px ${C.tGlow}` }}
                  >
                    <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 22 }}>{active.icon}</span>
                        <div>
                          <h4 style={{ fontSize: 15, fontWeight: 900, color: C.gDark, fontFamily: F.h }}>{active.title}</h4>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2, flexWrap: "wrap" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#777", fontFamily: F.b }}><Calendar size={9} />{active.period}</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#777", fontFamily: F.b }}><Package size={9} />{active.items} items</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ padding: "6px 10px", borderRadius: 999, background: active.color + "12", color: active.color, fontSize: 10, fontWeight: 800, whiteSpace: "nowrap" }}>
                        {active.metric}
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: "#555", lineHeight: 1.6, marginBottom: 10, fontFamily: F.b }}>{active.tagline}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center", padding: "8px 10px", borderRadius: 10, backgroundColor: "rgba(255,255,255,0.74)" }}>
                      <span style={{ fontSize: 10, color: "#64748B", fontFamily: F.b, fontStyle: "italic" }}>&quot;{active.example}&quot;</span>
                      <span style={{ fontSize: 12, fontWeight: 900, color: active.color }}>{active.price}</span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  {dedFeatures.map((feature, i) => (
                    <motion.div key={feature} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: C.tLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <Check size={10} style={{ color: C.tPrimary }} />
                      </div>
                      <span style={{ fontSize: 13, color: "#555", lineHeight: 1.5, fontFamily: F.b }}>{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.995 }}
                  style={{
                    width: "100%",
                    padding: "14px 0",
                    borderRadius: 16,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 800,
                    fontFamily: F.b,
                    background: `linear-gradient(135deg, ${C.tHover} 0%, ${C.tPrimary} 65%, #14b8a6 100%)`,
                    color: "#fff",
                    boxShadow: `0 10px 28px ${C.tGlow}, inset 0 1px 0 rgba(255,255,255,0.18)`,
                    marginTop: 24,
                  }}
                >
                  Book a Dedicated Drop <ArrowRight size={15} style={{ display: "inline", verticalAlign: "middle", marginLeft: 6 }} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        <div style={{ background: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)", borderTop: "1px solid rgba(226,232,240,0.65)", borderBottom: "1px solid rgba(226,232,240,0.65)", position: "relative" }}>
          <GlowOrb color={C.oGlow} size={280} bottom={-100} left={80} />
          <div style={{ maxWidth: 1160, margin: "0 auto", padding: "52px 24px 64px", position: "relative", zIndex: 2 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1.1fr) minmax(320px, 0.9fr)", gap: 28, alignItems: "stretch" }}>
              <motion.div style={shelfCardStyle} onMouseEnter={() => setShelfHover(true)} onMouseLeave={() => setShelfHover(false)} whileHover={{ y: -5 }}>
                <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: C.oGlow, filter: "blur(24px)" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: C.oLightBg, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.oSoft}` }}>
                        <span style={{ fontSize: 20 }}>📚</span>
                      </div>
                      <div>
                        <h3 style={{ fontSize: 21, fontWeight: 900, color: C.gDark, fontFamily: F.h }}>The Shelf</h3>
                        <p style={{ fontSize: 12, color: "#94A3B8", fontFamily: F.b }}>Always-on value recovery layer</p>
                      </div>
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 999, background: C.aiLight, border: `1px solid ${C.aiBorder}` }}>
                      <Sparkles size={13} style={{ color: C.ai }} />
                      <span style={{ fontSize: 11, fontWeight: 800, color: C.ai }}>AI optimizes inventory after the event</span>
                    </div>
                  </div>

                  <p style={{ fontSize: 15, color: C.softInk, lineHeight: 1.75, marginBottom: 18, fontFamily: F.b, maxWidth: 560 }}>
                    The Shelf prevents the typical garage-sale drop-off. Items that don&apos;t sell during the event keep living inside the marketplace, where AI can recommend price drops, push re-list opportunities, and guide donation outcomes.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 18 }}>
                    {[
                      { label: "Retention layer", value: "Post-event continuity" },
                      { label: "AI signal", value: "Price + timing prompts" },
                      { label: "Seller action", value: "Re-Drop in one click" },
                    ].map((item) => (
                      <div key={item.label} style={{ padding: "14px 14px", borderRadius: 18, background: "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(248,250,252,0.92))", border: `1px solid ${C.line}` }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1.1, marginBottom: 6 }}>{item.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: C.ink, lineHeight: 1.4 }}>{item.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {shelfFeatures.map((feature, i) => (
                      <motion.div
                        key={feature.text}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -2, scale: 1.01 }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "10px 14px",
                          borderRadius: 12,
                          background: "linear-gradient(135deg, #ffffff, #f9fafb)",
                          border: "1px solid #f1f5f9",
                          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                        }}
                      >
                        <span style={{ fontSize: 13 }}>{feature.icon}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#64748B", fontFamily: F.b }}>{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div style={lifecycleCardStyle} onMouseEnter={() => setLifecycleHover(true)} onMouseLeave={() => setLifecycleHover(false)} whileHover={{ y: -5 }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at top right, rgba(255,255,255,0.4), transparent 40%)" }} />
                <div style={{ position: "absolute", top: 10, right: 20, width: 10, height: 10, borderRadius: "50%", background: C.oAccent, boxShadow: `0 0 20px ${C.oAccent}` }} />
                <div style={{ padding: "22px 22px 24px", position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, fontFamily: F.b }}>
                        Item Lifecycle
                      </p>
                      <h4 style={{ fontSize: 21, fontWeight: 900, fontFamily: F.h, color: C.ink, margin: 0 }}>From listing to second chance</h4>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.oPrimary, background: C.oLightBg, border: `1px solid ${C.oSoft}`, padding: "8px 10px", borderRadius: 999 }}>
                      Auto-playing flow demo
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, marginBottom: 16, overflowX: "auto", paddingBottom: 2 }}>
                    {lifecycleSteps.map((step, i) => (
                      <button
                        key={step.step + "-chip"}
                        onClick={() => setActiveLife(i)}
                        style={{
                          border: "none",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          padding: "8px 12px",
                          borderRadius: 999,
                          background: activeLife === i ? `${step.color}12` : "rgba(255,255,255,0.85)",
                          color: activeLife === i ? step.color : "#64748B",
                          fontSize: 11,
                          fontWeight: 800,
                          borderWidth: 1,
                          borderStyle: "solid",
                          borderColor: activeLife === i ? `${step.color}40` : C.line,
                        }}
                      >
                        {step.step}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                    {lifecycleSteps.map((step, i) => {
                      const isActive = i === activeLife;
                      return (
                        <motion.div
                          key={step.step}
                          animate={{ scale: isActive ? 1.02 : 1, opacity: isActive ? 1 : 0.72 }}
                          transition={{ duration: 0.22 }}
                          onMouseEnter={() => setActiveLife(i)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "10px 10px",
                            borderRadius: 16,
                            background: isActive ? "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))" : "transparent",
                            boxShadow: isActive ? "0 12px 28px rgba(15,23,42,0.08)" : "none",
                            position: "relative",
                            border: isActive ? `1px solid ${C.line}` : "1px solid transparent",
                          }}
                        >
                          {i < lifecycleSteps.length - 1 && (
                            <div style={{ position: "absolute", left: 28, top: 46, width: 2, height: 20, backgroundColor: "rgba(0,0,0,0.06)" }} />
                          )}
                          <motion.div
                            animate={{ scale: isActive ? 1.08 : 1, boxShadow: isActive ? `0 0 0 6px ${step.color}12` : "0 6px 14px rgba(0,0,0,0.08)" }}
                            style={{ width: 36, height: 36, borderRadius: 12, background: `linear-gradient(135deg, ${step.bg}, #ffffff)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}
                          >
                            <step.icon size={14} style={{ color: step.color }} />
                          </motion.div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                              <span style={{ fontSize: 12, fontWeight: 800, color: C.gDark, fontFamily: F.b }}>{step.step}</span>
                              <span style={{ fontSize: 9, fontWeight: 700, color: isActive ? step.color : "#94A3B8", fontFamily: F.b }}>{step.time}</span>
                            </div>
                            <p style={{ fontSize: 10, color: "#64748B", fontFamily: F.b, margin: "2px 0 0" }}>{step.desc}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeLife}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                      style={{
                        padding: "14px 14px",
                        borderRadius: 18,
                        background: "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,250,252,0.96))",
                        border: `1px solid ${C.line}`,
                        display: "grid",
                        gap: 8,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 900, color: lifecycleSteps[activeLife].color }}>{lifecycleSteps[activeLife].step}</span>
                        <span style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase" }}>Active stage</span>
                      </div>
                      <div style={{ fontSize: 12, color: C.softInk, lineHeight: 1.6 }}>
                        {lifecycleSteps[activeLife].step === "AI reduces price"
                          ? "This is where marketplace intelligence boosts sell-through. AI recommends a lower price after enough exposure time has passed."
                          : lifecycleSteps[activeLife].step === "On the Shelf"
                          ? "Instead of disappearing after the event, inventory stays discoverable — preserving seller intent and buyer demand."
                          : lifecycleSteps[activeLife].step === "Re-Dropped or donated"
                          ? "The item gets a final conversion path: re-enter a future Drop or exit gracefully through donation."
                          : "Each step feeds the next, making DropYard feel like a complete selling operating system rather than a one-time posting tool."}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
