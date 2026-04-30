"use client";
import { useMemo, useState } from "react";
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
  { day: "Thu–Fri", act: "Buyers preview", icon: Heart, color: "#7C3AED" },
  { day: "Sat 8am", act: "Drop goes live!", icon: Zap, color: C.gPrimary },
  { day: "Sun 8pm", act: "Drop closes", icon: Clock, color: "#DC2626" },
];

export default function WaysToDropSection() {
  const [weeklyHover, setWeeklyHover] = useState(false);
  const [dedHover, setDedHover] = useState(false);
  const [shelfHover, setShelfHover] = useState(false);
  const [lifecycleHover, setLifecycleHover] = useState(false);
  const [activeDed, setActiveDed] = useState("moving");

  const weeklyCardStyle = useMemo(
    () => ({
      flex: "1 1 480px",
      borderRadius: 28,
      overflow: "hidden",
      border: `2px solid ${weeklyHover ? C.gAccent : C.gSoft}`,
      backgroundColor: "#fff",
      display: "flex",
      flexDirection: "column",
      boxShadow: weeklyHover
        ? `0 28px 70px ${C.gGlow}, 0 14px 34px ${C.oGlow}`
        : "0 12px 30px rgba(17,24,39,0.06)",
      transform: weeklyHover ? "translateY(-6px)" : "translateY(0px)",
      transition: "transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease",
    }),
    [weeklyHover]
  );

  const dedCardStyle = useMemo(
    () => ({
      flex: "1 1 480px",
      borderRadius: 28,
      overflow: "hidden",
      border: `2px solid ${dedHover ? C.tPrimary : C.tSoft}`,
      backgroundColor: "#fff",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      boxShadow: dedHover
        ? `0 28px 70px ${C.tGlow}, 0 14px 34px ${C.oGlow}`
        : "0 12px 30px rgba(17,24,39,0.06)",
      transform: dedHover ? "translateY(-6px)" : "translateY(0px)",
      transition: "transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease",
    }),
    [dedHover]
  );

  const shelfCardStyle = useMemo(
    () => ({
      flex: "1 1 400px",
      padding: 20,
      borderRadius: 24,
      background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
      boxShadow: shelfHover
        ? `0 24px 60px rgba(0,0,0,0.08), 0 10px 28px ${C.oGlow}`
        : "0 16px 40px rgba(0,0,0,0.06)",
      border: "1px solid #f1f5f9",
      position: "relative",
      overflow: "hidden",
      transform: shelfHover ? "translateY(-4px)" : "translateY(0px)",
      transition: "transform 220ms ease, box-shadow 220ms ease",
    }),
    [shelfHover]
  );

  const lifecycleCardStyle = useMemo(
    () => ({
      borderRadius: 24,
      overflow: "hidden",
      border: "1px solid #e5e7eb",
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      boxShadow: lifecycleHover
        ? `0 28px 65px rgba(0,0,0,0.1), 0 12px 28px ${C.oGlow}`
        : "0 20px 50px rgba(0,0,0,0.08)",
      position: "relative",
      transform: lifecycleHover ? "translateY(-4px)" : "translateY(0px)",
      transition: "transform 220ms ease, box-shadow 220ms ease",
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

      <section style={{ backgroundColor: "#fff", overflow: "hidden" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px 0", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 50,
              backgroundColor: C.gLightBg,
              border: `1px solid ${C.gSoft}`,
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 14 }}>🎯</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.gPrimary, fontFamily: F.b }}>
              How Selling Works
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: 900,
              color: C.gDark,
              lineHeight: 1.1,
              marginBottom: 12,
              fontFamily: F.h,
            }}
          >
            Choose how you want to Drop.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "#888",
              maxWidth: 600,
              margin: "0 auto 48px",
              lineHeight: 1.7,
              fontFamily: F.b,
            }}
          >
            Whether you're clearing a shelf or clearing a house — DropYard fits the moment. Your AI agent handles the work either way.
          </p>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 48px" }}>
          <div style={{ display: "flex", gap: 24, alignItems: "stretch", flexWrap: "wrap" }}>
            <div
              style={weeklyCardStyle}
              onMouseEnter={() => setWeeklyHover(true)}
              onMouseLeave={() => setWeeklyHover(false)}
            >
              <div
                style={{
                  padding: "28px 32px 24px",
                  background:
                    `radial-gradient(circle at top right, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 28%), linear-gradient(135deg, ${C.gDark} 0%, ${C.gPrimary} 52%, ${C.gAccent} 100%)`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -30,
                    right: -30,
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    filter: "blur(2px)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 88,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: C.oAccent,
                    boxShadow: `0 0 22px ${C.oAccent}`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: -20,
                    left: "40%",
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.06)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: weeklyHover
                      ? "linear-gradient(115deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.10) 48%, rgba(255,255,255,0) 78%)"
                      : "linear-gradient(115deg, rgba(255,255,255,0) 24%, rgba(255,255,255,0.06) 48%, rgba(255,255,255,0) 76%)",
                    transform: weeklyHover ? "translateX(6%)" : "translateX(0%)",
                    transition: "all 260ms ease",
                  }}
                />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 28 }}>🎯</span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          letterSpacing: 1.1,
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.78)",
                          fontFamily: F.b,
                        }}
                      >
                        Brand Match
                      </span>
                    </div>
                    <div
                      style={{
                        padding: "4px 14px",
                        borderRadius: 8,
                        backgroundColor: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      <span style={{ fontSize: 22, fontWeight: 900, color: "#fff", fontFamily: F.h }}>Free</span>
                    </div>
                  </div>
                  <h3 style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 4, fontFamily: F.h }}>
                    The Weekly Drop
                  </h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: F.b }}>
                    Your community's yard sale — every Saturday.
                  </p>
                </div>
              </div>

              <div style={{ padding: "24px 32px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#ccc",
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    marginBottom: 12,
                    fontFamily: F.b,
                  }}
                >
                  The weekly cycle
                </p>
                <div style={{ display: "flex", gap: 0, marginBottom: 20, position: "relative" }}>
                  {weeklyTimeline.map((step, i) => (
                    <div key={step.day} style={{ flex: 1, textAlign: "center", position: "relative" }}>
                      {i < weeklyTimeline.length - 1 && (
                        <div
                          style={{
                            position: "absolute",
                            top: 14,
                            left: "50%",
                            width: "100%",
                            height: 2,
                            backgroundColor: "rgba(0,0,0,0.06)",
                            zIndex: 0,
                          }}
                        />
                      )}
                      <div
                        style={{
                          width: 28,
                          height: 28,
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
                      </div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: C.gDark, fontFamily: F.b }}>{step.day}</p>
                      <p style={{ fontSize: 9, color: "#999", fontFamily: F.b }}>{step.act}</p>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    backgroundColor: C.gLightBg,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Users size={14} style={{ color: C.gPrimary }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.gPrimary, fontFamily: F.b }}>
                    Best for: Regular decluttering, seasonal cleanouts, a few items at a time
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  {weeklyFeatures.map((feature) => (
                    <div key={feature} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          backgroundColor: C.gLightBg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        <Check size={10} style={{ color: C.gPrimary }} />
                      </div>
                      <span style={{ fontSize: 13, color: "#555", lineHeight: 1.5, fontFamily: F.b }}>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  style={{
                    width: "100%",
                    padding: "14px 0",
                    borderRadius: 14,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: F.b,
                    background: `linear-gradient(135deg, ${C.gDark} 0%, ${C.gPrimary} 65%, ${C.gAccent} 100%)`,
                    color: "#fff",
                    boxShadow: `0 10px 28px ${C.gGlow}, inset 0 1px 0 rgba(255,255,255,0.18)`,
                    transition: "transform 0.15s, box-shadow 0.15s",
                    marginTop: 24,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02) translateY(-1px)";
                    e.currentTarget.style.boxShadow = `0 14px 34px ${C.gGlow}, 0 8px 22px ${C.oGlow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1) translateY(0)";
                    e.currentTarget.style.boxShadow = `0 10px 28px ${C.gGlow}, inset 0 1px 0 rgba(255,255,255,0.18)`;
                  }}
                >
                  Start Listing — It&apos;s Free <ArrowRight size={15} style={{ display: "inline", verticalAlign: "middle", marginLeft: 6 }} />
                </button>
              </div>
            </div>

            <div
              style={dedCardStyle}
              onMouseEnter={() => setDedHover(true)}
              onMouseLeave={() => setDedHover(false)}
            >
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: -32,
                  transform: "rotate(45deg)",
                  padding: "4px 40px",
                  backgroundColor: C.tPrimary,
                  zIndex: 10,
                }}
              >
                <span style={{ fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: 1, fontFamily: F.b }}>
                  PREMIUM
                </span>
              </div>

              <div
                style={{
                  padding: "28px 32px 24px",
                  background:
                    `radial-gradient(circle at top right, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 28%), linear-gradient(135deg, ${C.tHover} 0%, ${C.tPrimary} 60%, #14b8a6 100%)`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -30,
                    right: -30,
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    filter: "blur(2px)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 88,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: C.oAccent,
                    boxShadow: `0 0 22px ${C.oAccent}`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: dedHover
                      ? "linear-gradient(115deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.10) 48%, rgba(255,255,255,0) 78%)"
                      : "linear-gradient(115deg, rgba(255,255,255,0) 24%, rgba(255,255,255,0.06) 48%, rgba(255,255,255,0) 76%)",
                    transform: dedHover ? "translateX(6%)" : "translateX(0%)",
                    transition: "all 260ms ease",
                  }}
                />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <span style={{ fontSize: 28 }}>⭐</span>
                    <div
                      style={{
                        padding: "4px 14px",
                        borderRadius: 8,
                        backgroundColor: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      <span style={{ fontSize: 16, fontWeight: 900, color: "#fff", fontFamily: F.h }}>From </span>
                      <span style={{ fontSize: 22, fontWeight: 900, color: "#fff", fontFamily: F.h }}>$29</span>
                    </div>
                  </div>
                  <h3 style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 4, fontFamily: F.h }}>
                    Dedicated Sales Drop
                  </h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: F.b }}>
                    Your own featured sale — for life&apos;s big transitions.
                  </p>
                </div>
              </div>

              <div style={{ padding: "24px 32px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#ccc",
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    marginBottom: 10,
                    fontFamily: F.b,
                  }}
                >
                  Choose your sale type
                </p>
                <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                  {[
                    { id: "moving", label: "🚚 Moving", price: "$49" },
                    { id: "estate", label: "🏠 Estate", price: "$79" },
                    { id: "garage", label: "🏷️ Garage", price: "$29" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveDed(tab.id)}
                      style={{
                        flex: 1,
                        padding: "10px 6px",
                        borderRadius: 10,
                        cursor: "pointer",
                        textAlign: "center",
                        border: `2px solid ${activeDed === tab.id ? C.tPrimary : "#e5e7eb"}`,
                        backgroundColor: activeDed === tab.id ? C.tLight : "#fff",
                        transition: "all 0.2s",
                      }}
                    >
                      <p style={{ fontSize: 12, fontWeight: 700, color: activeDed === tab.id ? C.tPrimary : "#888", fontFamily: F.b }}>
                        {tab.label}
                      </p>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 900,
                          color: activeDed === tab.id ? C.tPrimary : "#ccc",
                          fontFamily: F.h,
                          marginTop: 2,
                        }}
                      >
                        {tab.price}
                      </p>
                    </button>
                  ))}
                </div>

                <div style={{ padding: 14, borderRadius: 14, backgroundColor: C.tLight, border: `1px solid ${C.tSoft}`, marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 22 }}>{active.icon}</span>
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 800, color: C.gDark, fontFamily: F.h }}>{active.title}</h4>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#777", fontFamily: F.b }}>
                          <Calendar size={9} />
                          {active.period}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#777", fontFamily: F.b }}>
                          <Package size={9} />
                          {active.items} items
                        </span>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: "#555", lineHeight: 1.5, marginBottom: 8, fontFamily: F.b }}>{active.tagline}</p>
                  <div style={{ padding: "6px 10px", borderRadius: 6, backgroundColor: "rgba(255,255,255,0.7)" }}>
                    <span style={{ fontSize: 10, color: "#999", fontFamily: F.b, fontStyle: "italic" }}>
                      &quot;{active.example}&quot;
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
                  {dedFeatures.map((feature) => (
                    <div key={feature} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          backgroundColor: C.tLight,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        <Check size={10} style={{ color: C.tPrimary }} />
                      </div>
                      <span style={{ fontSize: 13, color: "#555", lineHeight: 1.5, fontFamily: F.b }}>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  style={{
                    width: "100%",
                    padding: "14px 0",
                    borderRadius: 14,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: F.b,
                    background: `linear-gradient(135deg, ${C.tHover} 0%, ${C.tPrimary} 65%, #14b8a6 100%)`,
                    color: "#fff",
                    boxShadow: `0 10px 28px ${C.tGlow}, inset 0 1px 0 rgba(255,255,255,0.18)`,
                    transition: "transform 0.15s, box-shadow 0.15s",
                    marginTop: 24,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02) translateY(-1px)";
                    e.currentTarget.style.boxShadow = `0 14px 34px ${C.tGlow}, 0 8px 22px ${C.oGlow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1) translateY(0)";
                    e.currentTarget.style.boxShadow = `0 10px 28px ${C.tGlow}, inset 0 1px 0 rgba(255,255,255,0.18)`;
                  }}
                >
                  Book a Dedicated Drop <ArrowRight size={15} style={{ display: "inline", verticalAlign: "middle", marginLeft: 6 }} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(180deg, #FAFAF8 0%, #F3F4F6 100%)",
            borderTop: "1px solid #f0f0f0",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
            <div style={{ display: "flex", alignItems: "stretch", gap: 40, flexWrap: "wrap" }}>
              <div
                style={shelfCardStyle}
                onMouseEnter={() => setShelfHover(true)}
                onMouseLeave={() => setShelfHover(false)}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -40,
                    right: -40,
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: C.oGlow,
                    filter: "blur(20px)",
                  }}
                />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: C.oLightBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `1px solid ${C.oSoft}`,
                      }}
                    >
                      <span style={{ fontSize: 20 }}>📚</span>
                    </div>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 900, color: C.gDark, fontFamily: F.h }}>The Shelf</h3>
                      <p style={{ fontSize: 11, color: "#999", fontFamily: F.b }}>
                        Built into both tiers — not a separate product
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 16, fontFamily: F.b }}>
                    When a Drop ends, unsold items don&apos;t disappear — they move to the Shelf automatically. Buyers can browse Shelf items anytime, and the AI suggests price reductions to help things sell. It&apos;s the patient layer beneath the event energy.
                  </p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {shelfFeatures.map((feature) => (
                      <div
                        key={feature.text}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "8px 14px",
                          borderRadius: 10,
                          background: "linear-gradient(135deg, #ffffff, #f9fafb)",
                          border: "1px solid #f1f5f9",
                          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                        }}
                      >
                        <span style={{ fontSize: 12 }}>{feature.icon}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#777", fontFamily: F.b }}>{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ flex: "1 1 340px" }}>
                <div
                  style={lifecycleCardStyle}
                  onMouseEnter={() => setLifecycleHover(true)}
                  onMouseLeave={() => setLifecycleHover(false)}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "radial-gradient(circle at top right, rgba(255,255,255,0.4), transparent 40%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 20,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: C.oAccent,
                      boxShadow: `0 0 20px ${C.oAccent}`,
                    }}
                  />
                  <div style={{ padding: "20px 22px", position: "relative", zIndex: 1 }}>
                    <p
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#ccc",
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                        marginBottom: 12,
                        fontFamily: F.b,
                      }}
                    >
                      Item Lifecycle
                    </p>
                    {lifecycleSteps.map((step, i) => (
                      <div
                        key={step.step}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: i < lifecycleSteps.length - 1 ? 8 : 0,
                          position: "relative",
                        }}
                      >
                        {i < lifecycleSteps.length - 1 && (
                          <div
                            style={{
                              position: "absolute",
                              left: 17,
                              top: 30,
                              width: 2,
                              height: 18,
                              backgroundColor: "rgba(0,0,0,0.06)",
                            }}
                          />
                        )}
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: `linear-gradient(135deg, ${step.bg}, #ffffff)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            zIndex: 1,
                            boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
                          }}
                        >
                          <step.icon size={14} style={{ color: step.color }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: C.gDark, fontFamily: F.b }}>{step.step}</span>
                            <span style={{ fontSize: 9, fontWeight: 600, color: "#ccc", fontFamily: F.b }}>{step.time}</span>
                          </div>
                          <p style={{ fontSize: 10, color: "#999", fontFamily: F.b }}>{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
