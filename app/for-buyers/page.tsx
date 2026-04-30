"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Heart, Clock, MapPin, Package, ChevronRight,
  TrendingDown, DollarSign, Shield, Eye,
  Sparkles, MessageCircle, Calendar, ArrowRight,
  Tag, Star,
} from "lucide-react";

const C = {
  gLightBg: "#ECFDF5", gSoft: "#D1FAE5", gAccent: "#6EE7B7",
  gPrimary: "#059669", gHover: "#047857", gDark: "#064e3b",
  oLightBg: "#FFF7ED", oSoft: "#FED7AA", oAccent: "#FDBA74",
  oPrimary: "#f59e0b", oHover: "#d97706", oDark: "#92400e",
  tPrimary: "#0F766E", tLight: "#CCFBF1", tSoft: "#99F6E4",
  ai: "#7C3AED", aiLight: "#F5F3FF",
  wa: "#25D366",
};

const dropItems = [
  { t: "Sectional Sofa", p: 450, op: 1800, img: "🛋️", cat: "Furniture" },
  { t: "iPhone 13", p: 320, op: 600, img: "📱", cat: "Electronics" },
  { t: "Mountain Bike", p: 180, op: 500, img: "🚲", cat: "Sports" },
  { t: "PS5 Bundle", p: 380, op: 550, img: "🎮", cat: "Electronics" },
];

const shelfItems = [
  { t: "Standing Desk", p: 140, op: 175, img: "🖥️", days: 12, pd: true },
  { t: "Galaxy Tab A7", p: 65, op: 80, img: "📲", days: 10, pd: true },
  { t: "Yoga Mat + Bands", p: 15, op: null, img: "🧘", days: 5, pd: false },
  { t: "Winter Jacket", p: 20, op: null, img: "🧥", days: 7, pd: false },
];

const dedSellers = [
  { name: "The Patel Family", badge: "🚚 Moving Sale", items: 12, tagline: "Relocating — everything must go!", date: "Apr 5 – 20", color: C.tPrimary, bg: C.tLight, img: "📦", daysLeft: 8 },
  { name: "Estate of M. Williams", badge: "🏠 Estate Sale", items: 28, tagline: "A lifetime of treasures and antiques.", date: "Apr 8 – May 8", color: "#7C3AED", bg: "#F5F3FF", img: "🏺", daysLeft: 26 },
  { name: "Chris B.", badge: "🏷️ Garage Sale", items: 15, tagline: "Spring cleanout! Tools, gear, and more.", date: "Apr 12 – 14", color: C.oPrimary, bg: C.oLightBg, img: "🔧", daysLeft: 2 },
];

const pad = (n: number) => String(n).padStart(2, "0");

export default function ForBuyersPage() {
  const router = useRouter();
  const go = () => router.push("/join?mode=signup");

  const [cd, setCd] = useState({ h: 23, m: 44, s: 59 });
  useEffect(() => {
    const t = setInterval(() => setCd((p) => {
      let { h, m, s } = p;
      s--;
      if (s < 0) { s = 59; m--; }
      if (m < 0) { m = 59; h--; }
      if (h < 0) h = 23;
      return { h, m, s };
    }), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-full flex flex-col">

      {/* ═══ 1. HERO ═══ */}
      <section style={{ position: "relative", overflow: "hidden", background: `linear-gradient(165deg,${C.gDark} 0%,${C.gHover} 50%,${C.gPrimary} 100%)`, padding: "60px 24px 50px" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: C.gAccent, opacity: 0.06 }} />
        <div style={{ position: "absolute", bottom: -40, left: "20%", width: 200, height: 200, borderRadius: "50%", background: C.oAccent, opacity: 0.04 }} />
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 50, backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#22C55E" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>This week&apos;s Drop is live — 40+ items from your neighbours</span>
          </div>
          <h1 style={{ fontSize: "clamp(36px,6vw,56px)", fontWeight: 900, color: "#fff", lineHeight: 1.08, marginBottom: 14 }}>
            For <span style={{ color: C.oAccent }}>Buyers</span>
          </h1>
          <p style={{ fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 8 }}>Shop locally. Simply.</p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.7 }}>
            Discover amazing deals from your neighbours through curated weekend Drops, always-on Shelf listings, and Dedicated Sales. Quality items at great prices, just around the corner.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24, flexWrap: "wrap" }}>
            <button onClick={go} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 14, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, backgroundColor: C.oPrimary, color: "#fff", boxShadow: "0 8px 28px rgba(245,158,11,0.35)" }}>
              Join This Week&apos;s Drop <ChevronRight size={18} />
            </button>
            <button onClick={() => router.push("/join?mode=signin")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 15, fontWeight: 700, backgroundColor: "rgba(255,255,255,0.06)", color: "#fff" }}>
              I Have an Account
            </button>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 20px", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Clock size={14} style={{ color: C.gAccent }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Drop ends in</span>
            <div style={{ display: "flex", gap: 4 }}>
              {[pad(cd.h), pad(cd.m), pad(cd.s)].map((v, i) => (
                <span key={i} style={{ fontSize: 16, fontWeight: 900, color: "#fff", backgroundColor: "rgba(255,255,255,0.1)", padding: "3px 8px", borderRadius: 6, letterSpacing: 1, minWidth: 36, textAlign: "center" }}>{v}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. THIS WEEK'S PICKS ═══ */}
      <section style={{ padding: "48px 24px", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: C.gPrimary, textTransform: "uppercase", letterSpacing: 2 }}>This Week</span>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: C.gDark, marginTop: 4 }}>This Week&apos;s Picks</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {dropItems.map((item, i) => {
              const d = item.op ? Math.round((1 - item.p / item.op) * 100) : 0;
              return (
                <div key={i}
                  style={{ borderRadius: 16, border: "1px solid #f0f0f0", overflow: "hidden", backgroundColor: "#fff", transition: "all 0.2s", cursor: "pointer" }}
                  onClick={go}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 10px 28px rgba(0,0,0,0.06)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
                  <div style={{ height: 140, backgroundColor: C.gLightBg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <span style={{ fontSize: 44 }}>{item.img}</span>
                    {d > 0 && <span style={{ position: "absolute", top: 10, right: 10, fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 8, backgroundColor: "#DC2626", color: "#fff" }}>-{d}%</span>}
                    <div style={{ position: "absolute", top: 10, left: 10, display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 6, backgroundColor: C.gDark, color: "#fff" }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "#22C55E" }} />
                      <span style={{ fontSize: 7, fontWeight: 800, letterSpacing: 0.7 }}>LIVE</span>
                    </div>
                  </div>
                  <div style={{ padding: "12px 14px" }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: C.gDark }}>{item.t}</p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 3 }}>
                      <span style={{ fontSize: 20, fontWeight: 900, color: C.gPrimary }}>${item.p}</span>
                      {item.op && <span style={{ fontSize: 12, color: "#ccc", textDecoration: "line-through" }}>${item.op}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button onClick={go} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 10, border: `1.5px solid ${C.gPrimary}`, cursor: "pointer", fontSize: 13, fontWeight: 700, backgroundColor: "#fff", color: C.gPrimary }}>
              Browse All Drop Items <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ═══ 3. THREE WAYS TO SHOP ═══ */}
      <section style={{ padding: "48px 24px", backgroundColor: "#FAFAF8" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.24em", color: C.oPrimary }}>Three ways to shop</span>
            <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0f172a", marginTop: 10 }}>There&apos;s always something for you</h2>
            <p style={{ fontSize: 16, color: "#64748b", marginTop: 10 }}>Whether it&apos;s Drop day or a quiet Tuesday, your community has items waiting.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {[
              {
                eyebrow: "Every Saturday", title: "The Drop", pill: "Live weekly",
                desc: "Fresh items go live Saturday 8am. Browse, claim, and pick up — all within 48 hours.",
                headerBg: `linear-gradient(135deg,#065f46,${C.gPrimary})`, accentDot: "#22C55E", ctaBg: C.gPrimary, ctaHover: C.gHover, cta: "Browse Drops",
                points: ["New items every weekend", "48-hour claiming window", "Preview items Thu–Fri", "Pickup same weekend"],
              },
              {
                eyebrow: "Always Open", title: "The Shelf", pill: "Open now",
                desc: "Items available right now, anytime. No countdown, no rush — browse and claim when you're ready.",
                headerBg: `linear-gradient(135deg,${C.oPrimary},#f97316)`, accentDot: "#fbbf24", ctaBg: C.oPrimary, ctaHover: C.oHover, cta: "Explore Shelf",
                points: ["Browse anytime, claim anytime", "Unsold Drop items roll here", "AI suggests price reductions", "No weekend window required"],
              },
              {
                eyebrow: "Premium Events", title: "Dedicated Drops", pill: "Premium",
                desc: "Moving, estate, and garage sales with custom date ranges and seller storefronts.",
                headerBg: `linear-gradient(135deg,${C.tPrimary},#0d9488)`, accentDot: "#22d3ee", ctaBg: C.tPrimary, ctaHover: "#115e59", cta: "View Dedicated Drops",
                points: ["Bulk deals from one seller", "Custom availability periods", "Featured during live Drops", "Browse full seller catalogues"],
              },
            ].map((card) => (
              <div key={card.title}
                style={{ borderRadius: 28, overflow: "hidden", border: "1px solid #e2e8f0", backgroundColor: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,0.04)", transition: "all 0.3s", cursor: "pointer" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.04)"; }}>
                <div style={{ padding: 24, background: card.headerBg, color: "#fff", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", right: 0, top: 0, width: 96, height: 96, borderRadius: "50%", background: "rgba(255,255,255,0.1)", filter: "blur(24px)" }} />
                  <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.8 }}>{card.eyebrow}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 50, border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)" }}>{card.pill}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: card.accentDot }} />
                      <h3 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em" }}>{card.title}</h3>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.8)", marginTop: 12 }}>{card.desc}</p>
                  </div>
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {card.points.map((pt, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span style={{ marginTop: 2, display: "inline-flex", width: 20, height: 20, alignItems: "center", justifyContent: "center", borderRadius: "50%", backgroundColor: C.gLightBg, color: C.gPrimary, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: 14, color: "#475569" }}>{pt}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={go}
                    style={{ width: "100%", marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0", borderRadius: 50, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, backgroundColor: card.ctaBg, color: "#fff", transition: "background 0.2s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = card.ctaHover; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = card.ctaBg; }}>
                    {card.cta} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. DEDICATED DROPS SPOTLIGHT ═══ */}
      <section style={{ padding: "48px 24px", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, color: C.tPrimary, textTransform: "uppercase", letterSpacing: 2 }}>Happening Now</span>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: C.gDark, marginTop: 4 }}>Dedicated Drops Near You</h2>
            </div>
            <button onClick={go} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700, color: C.tPrimary, background: "none", border: "none", cursor: "pointer" }}>View All <ChevronRight size={14} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {dedSellers.map((s, i) => (
              <div key={i}
                style={{ borderRadius: 16, overflow: "hidden", border: `1.5px solid ${s.color}20`, cursor: "pointer", transition: "all 0.2s" }}
                onClick={go}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 10px 28px ${s.color}22`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
                <div style={{ padding: "12px 16px", background: `linear-gradient(135deg,${s.color},${s.color}dd)`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 6, backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }}>{s.badge}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={10} style={{ color: "rgba(255,255,255,0.7)" }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{s.date}</span>
                    {s.daysLeft <= 3 && <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 4, backgroundColor: "rgba(255,255,255,0.25)", color: "#fff" }}>{s.daysLeft}d left!</span>}
                  </div>
                </div>
                <div style={{ padding: "14px 16px", backgroundColor: "#fff" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{s.img}</div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 800, color: C.gDark }}>{s.name}</p>
                      <p style={{ fontSize: 10, color: "#999" }}>{s.items} items · {s.tagline}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, fontSize: 11, fontWeight: 700, color: s.color }}>Browse Sale <ChevronRight size={13} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. ON THE SHELF ═══ */}
      <section style={{ padding: "48px 24px", backgroundColor: C.oLightBg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, color: C.oPrimary, textTransform: "uppercase", letterSpacing: 2 }}>No Countdown Needed</span>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: C.gDark, marginTop: 4 }}>On the Shelf Right Now</h2>
              <p style={{ fontSize: 13, color: "#999", marginTop: 4 }}>Available right now — no waiting for Saturday.</p>
            </div>
            <button onClick={go} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700, color: C.oPrimary, background: "none", border: "none", cursor: "pointer" }}>Browse the Shelf <ChevronRight size={14} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {shelfItems.map((item, i) => (
              <div key={i}
                style={{ borderRadius: 16, border: "1px solid #f0f0f0", overflow: "hidden", backgroundColor: "#fff", transition: "all 0.2s", cursor: "pointer" }}
                onClick={go}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 10px 28px rgba(0,0,0,0.06)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
                <div style={{ height: 120, backgroundColor: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <span style={{ fontSize: 38 }}>{item.img}</span>
                  <div style={{ position: "absolute", top: 8, left: 8, display: "flex", alignItems: "center", gap: 3, padding: "3px 7px", borderRadius: 6, backgroundColor: C.oPrimary, color: "#fff" }}>
                    <Package size={8} /><span style={{ fontSize: 7, fontWeight: 800 }}>SHELF</span>
                  </div>
                  {item.pd && <div style={{ position: "absolute", top: 8, right: 8, display: "flex", alignItems: "center", gap: 3, padding: "3px 7px", borderRadius: 6, backgroundColor: "#DC2626", color: "#fff" }}>
                    <TrendingDown size={8} /><span style={{ fontSize: 7, fontWeight: 800 }}>PRICE DROP</span>
                  </div>}
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: C.gDark }}>{item.t}</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 2 }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: C.gPrimary }}>${item.p}</span>
                    {item.op && <span style={{ fontSize: 11, color: "#ccc", textDecoration: "line-through" }}>${item.op}</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, fontSize: 9, fontWeight: 600, color: C.oDark, padding: "3px 6px", borderRadius: 4, backgroundColor: C.oLightBg }}>
                    <Package size={8} style={{ color: C.oPrimary }} />{item.days}d ago{item.pd && <span style={{ color: "#DC2626", fontWeight: 700 }}> — reduced!</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. WHY BUY — THE PERKS ═══ */}
      <section style={{ padding: "48px 24px", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ position: "relative", overflow: "hidden", borderRadius: 36, border: "1px solid #e2e8f0", background: "linear-gradient(180deg,#fcfcfb 0%,#f7f7f4 100%)", padding: "56px 40px", boxShadow: "0 25px 70px rgba(15,23,42,0.06)" }}>
            <div style={{ position: "absolute", left: -40, top: 32, width: 176, height: 176, borderRadius: "50%", background: "rgba(209,250,229,0.5)", filter: "blur(48px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", right: -20, top: 0, width: 208, height: 208, borderRadius: "50%", background: "rgba(251,191,36,0.15)", filter: "blur(48px)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.24em", color: C.gPrimary }}>The Perks</span>
                <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#0f172a", marginTop: 14 }}>Why buy on DropYard?</h2>
                <p style={{ fontSize: 16, lineHeight: 1.7, color: "#64748b", marginTop: 14 }}>Shop smarter, closer, and faster with neighbourhood finds that feel more personal than a typical marketplace.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginTop: 48 }}>
                {[
                  { icon: DollarSign, title: "Amazing Prices", desc: "Items priced 50–70% below retail. Your neighbours' quality stuff at yard sale prices.", color: C.gPrimary, bg: C.gLightBg },
                  { icon: MapPin, title: "Hyper-Local", desc: "Everything is in your neighbourhood. No shipping, no waiting — just walk or drive over.", color: C.oPrimary, bg: C.oLightBg },
                  { icon: Shield, title: "Quality Items", desc: "Real neighbours selling real stuff. See seller ratings and item conditions upfront.", color: C.tPrimary, bg: C.tLight },
                  { icon: Sparkles, title: "AI-Powered Q&A", desc: "Get instant answers to your questions. Many sellers use an AI agent that responds in seconds.", color: C.ai, bg: C.aiLight },
                ].map((perk, i) => (
                  <div key={i}
                    style={{ position: "relative", overflow: "hidden", borderRadius: 28, border: "1px solid #e2e8f0", backgroundColor: "#fff", padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "all 0.3s", cursor: "pointer" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}>
                    <div style={{ width: 64, height: 64, borderRadius: 24, backgroundColor: perk.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <perk.icon size={32} style={{ color: perk.color }} />
                    </div>
                    <h3 style={{ fontSize: "clamp(18px,2vw,24px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0f172a", marginTop: 24 }}>{perk.title}</h3>
                    <p style={{ fontSize: 15, lineHeight: 1.8, color: "#64748b", marginTop: 12 }}>{perk.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 7. HOW BUYING WORKS ═══ */}
      <section style={{ padding: "48px 24px", backgroundColor: "#FAFAF8" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ position: "relative", overflow: "hidden", borderRadius: 36, border: "1px solid #e2e8f0", background: "linear-gradient(180deg,#fcfcfb 0%,#f7f7f4 100%)", padding: "56px 40px", boxShadow: "0 25px 70px rgba(15,23,42,0.06)" }}>
            <div style={{ position: "absolute", left: -40, top: 32, width: 176, height: 176, borderRadius: "50%", background: "rgba(209,250,229,0.5)", filter: "blur(48px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", right: -20, top: 0, width: 208, height: 208, borderRadius: "50%", background: "rgba(196,181,253,0.4)", filter: "blur(48px)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.24em", color: C.gPrimary }}>Simple Steps</span>
                <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#0f172a", marginTop: 14 }}>How buying works</h2>
                <p style={{ fontSize: 16, lineHeight: 1.7, color: "#64748b", marginTop: 14 }}>From discovery to pickup, DropYard keeps buying local simple, fast, and low-friction.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginTop: 48 }}>
                {[
                  { n: "1", icon: Search, title: "Browse", desc: "Explore items in your neighbourhood during weekend Drops, on the Shelf, or in Dedicated Sales.", color: C.gPrimary, bg: C.gLightBg, accent: "rgba(209,250,229,0.8)" },
                  { n: "2", icon: Heart, title: "Save & Ask", desc: "Save items to your wishlist. Ask questions — AI-powered sellers respond in seconds.", color: C.oPrimary, bg: C.oLightBg, accent: "rgba(254,215,170,0.8)" },
                  { n: "3", icon: Tag, title: "Claim or Offer", desc: "Claim at listed price for instant confirmation, or make an offer and negotiate.", color: C.tPrimary, bg: C.tLight, accent: "rgba(153,246,228,0.8)" },
                  { n: "4", icon: MapPin, title: "Pick Up Locally", desc: "Choose a pickup slot, get the address via WhatsApp, and meet your neighbour.", color: C.ai, bg: C.aiLight, accent: "rgba(196,181,253,0.6)" },
                ].map((step, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <div
                      style={{ position: "relative", overflow: "hidden", borderRadius: 28, border: "1px solid #e2e8f0", backgroundColor: "#fff", padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "all 0.3s", cursor: "pointer", height: "100%" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}>
                      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 96, background: `linear-gradient(to bottom, ${step.accent}, transparent)`, pointerEvents: "none" }} />
                      <div style={{ position: "relative" }}>
                        <div style={{ position: "relative", width: 64, height: 64, borderRadius: 24, backgroundColor: step.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <step.icon size={32} style={{ color: step.color }} />
                          <span style={{ position: "absolute", top: -8, right: -8, width: 32, height: 32, borderRadius: "50%", backgroundColor: step.color, color: "#fff", fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>{step.n}</span>
                        </div>
                        <h3 style={{ fontSize: "clamp(18px,2vw,24px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0f172a", marginTop: 28 }}>{step.title}</h3>
                        <p style={{ fontSize: 15, lineHeight: 1.8, color: "#64748b", marginTop: 12 }}>{step.desc}</p>
                      </div>
                    </div>
                    {i < 3 && (
                      <div style={{ position: "absolute", right: -14, top: "50%", transform: "translateY(-50%)", zIndex: 20, width: 40, height: 40, borderRadius: "50%", border: "1px solid #e2e8f0", backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ArrowRight size={16} style={{ color: "#cbd5e1" }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* WhatsApp banner */}
              <div style={{ maxWidth: 600, margin: "40px auto 0", borderRadius: 24, border: "1px solid #a7f3d0", backgroundColor: "rgba(236,253,245,0.7)", padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: C.wa, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <MessageCircle size={24} style={{ color: "#fff" }} />
                  </div>
                  <p style={{ fontSize: 16, lineHeight: 1.7, color: "#334155" }}>
                    Pickup details, reminders, and confirmations — all delivered to your <strong style={{ color: C.wa }}>WhatsApp</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 8. STATS ═══ */}
      <section style={{ padding: "48px 24px", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ position: "relative", overflow: "hidden", borderRadius: 36, border: "1px solid #e2e8f0", background: "linear-gradient(180deg,#fcfcfb 0%,#f7f7f4 100%)", padding: "48px 40px", boxShadow: "0 25px 70px rgba(15,23,42,0.06)" }}>
            <div style={{ position: "absolute", left: -30, top: 24, width: 160, height: 160, borderRadius: "50%", background: "rgba(251,191,36,0.15)", filter: "blur(48px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", right: -20, top: 0, width: 176, height: 176, borderRadius: "50%", background: "rgba(209,250,229,0.5)", filter: "blur(48px)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.24em", color: C.gPrimary }}>Trusted Locally</span>
                <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#0f172a", marginTop: 14 }}>DropYard by the numbers</h2>
                <p style={{ fontSize: 16, lineHeight: 1.7, color: "#64748b", marginTop: 14 }}>Real traction from real neighbourhoods — proving that local buying can be simple, affordable, and reliable.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginTop: 48 }}>
                {[
                  { value: "2,500+", label: "items listed", color: C.oPrimary, bg: C.oLightBg, accent: "rgba(251,191,36,0.25)" },
                  { value: "15–25", label: "neighbourhoods", color: C.gPrimary, bg: C.gLightBg, accent: "rgba(209,250,229,0.8)" },
                  { value: "$45K+", label: "saved by buyers", color: C.oPrimary, bg: C.oLightBg, accent: "rgba(254,243,199,0.8)" },
                  { value: "98%", label: "successful pickups", color: C.ai, bg: C.aiLight, accent: "rgba(196,181,253,0.5)" },
                ].map((stat, i) => (
                  <div key={i}
                    style={{ position: "relative", overflow: "hidden", borderRadius: 28, border: "1px solid #e2e8f0", backgroundColor: "#fff", padding: 28, textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "all 0.3s", cursor: "pointer" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}>
                    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 96, background: `linear-gradient(to bottom, ${stat.accent}, transparent)`, pointerEvents: "none" }} />
                    <div style={{ position: "relative" }}>
                      <div style={{ display: "inline-flex", width: 64, height: 64, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: stat.bg, margin: "0 auto" }}>
                        <Star size={32} style={{ color: stat.color }} />
                      </div>
                      <p style={{ fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 800, letterSpacing: "-0.05em", color: "#0f172a", marginTop: 20 }}>{stat.value}</p>
                      <p style={{ fontSize: 16, color: "#64748b", marginTop: 8 }}>{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 9. CTA ═══ */}
      <section style={{ padding: "56px 24px", background: `linear-gradient(165deg,${C.gDark},${C.gHover})`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: "20%", width: 200, height: 200, borderRadius: "50%", background: C.gAccent, opacity: 0.05 }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 900, color: "#fff", marginBottom: 8 }}>Ready to find your next deal?</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 24, lineHeight: 1.6 }}>
            Join your neighbourhood&apos;s next Drop and discover amazing local finds. Or browse the Shelf right now — no waiting required.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={go} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 14, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, backgroundColor: C.oPrimary, color: "#fff", boxShadow: "0 8px 28px rgba(245,158,11,0.35)" }}>
              Join This Week&apos;s Drop <ChevronRight size={18} />
            </button>
            <button onClick={go} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 15, fontWeight: 700, backgroundColor: "rgba(255,255,255,0.06)", color: "#fff" }}>
              <Package size={16} /> Browse the Shelf
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
