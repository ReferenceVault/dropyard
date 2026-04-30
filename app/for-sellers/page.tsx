"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles, ArrowRight, MessageCircle, Calendar, Eye,
  Tag, CheckCircle, Upload, Check, DollarSign, Zap,
  MapPin, Package,
} from "lucide-react";

// DropYard theme colors
const C = {
  gLightBg: "#ECFDF5", gSoft: "#D1FAE5", gAccent: "#6EE7B7",
  gPrimary: "#059669", gHover: "#047857", gDark: "#064e3b",
  oLightBg: "#FFF7ED", oSoft: "#FED7AA", oAccent: "#FDBA74",
  oPrimary: "#f59e0b", oHover: "#d97706", oDark: "#92400e",
  ai: "#7C3AED", aiLight: "#F5F3FF", aiBorder: "#DDD6FE",
  wa: "#25D366",
};

export default function ForSellersPage() {
  const router = useRouter();
  const [dedTab, setDedTab] = useState("moving");
  const goJoin = () => router.push("/join?mode=signup");

  return (
    <>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
      `}</style>
      <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8" }}>

        {/* ══════════ 1. HERO ══════════ */}
        <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(165deg, #fefce8 0%, #fff7ed 40%, #fef3c7 100%)", padding: "80px 24px 60px" }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: C.oAccent, opacity: 0.08 }} />
          <div style={{ position: "absolute", bottom: -60, left: "10%", width: 300, height: 300, borderRadius: "50%", background: C.gAccent, opacity: 0.06 }} />
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 50, backgroundColor: "rgba(255,255,255,0.7)", border: "1px solid rgba(245,158,11,0.2)", marginBottom: 24, backdropFilter: "blur(4px)" }}>
              <Sparkles size={14} style={{ color: C.oPrimary }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: C.oDark }}>Turn clutter into cash — list yourself or let AI help</span>
            </div>
            <h1 style={{ fontSize: "clamp(40px,7vw,64px)", fontWeight: 900, color: C.gDark, lineHeight: 1.05, marginBottom: 16 }}>
              Sell easily to your<br /><span style={{ color: C.oPrimary }}>neighbours.</span>
            </h1>
            <p style={{ fontSize: 16, color: "#64748b", maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.7 }}>
              Turn unused items into cash through simple, time-limited community Drops. List items yourself or let AI do it for you — create listings, talk to buyers, and schedule pickups. No meetups with strangers — just neighbours helping neighbours.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 20, flexWrap: "wrap" }}>
              <button onClick={goJoin} style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 50, border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, backgroundColor: C.oPrimary, color: "#fff", boxShadow: "0 8px 28px rgba(245,158,11,0.35)" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.oHover)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.oPrimary)}>
                Become a Seller <ArrowRight size={18} />
              </button>
              <button onClick={() => router.push("/join?mode=signin")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 50, border: `2px solid ${C.oPrimary}`, cursor: "pointer", fontSize: 16, fontWeight: 700, backgroundColor: "transparent", color: C.oPrimary }}>
                I Have an Account
              </button>
            </div>
          </div>
        </section>

        {/* ══════════ 2. HOW SELLING WORKS ══════════ */}
        <section style={{ padding: "56px 24px", backgroundColor: "#fff" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ position: "relative", overflow: "hidden", borderRadius: 36, border: "1px solid #e2e8f0", background: "linear-gradient(180deg,#fcfcfb 0%,#f7f7f4 100%)", padding: "56px 40px", boxShadow: "0 25px 70px rgba(15,23,42,0.06)" }}>
              <div style={{ position: "absolute", left: -40, top: 32, width: 176, height: 176, borderRadius: "50%", background: "rgba(254,215,170,0.4)", filter: "blur(48px)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", right: -20, top: 0, width: 208, height: 208, borderRadius: "50%", background: "rgba(196,181,253,0.3)", filter: "blur(48px)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.24em", color: C.oPrimary }}>Simple Steps</span>
                  <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#0f172a", marginTop: 14 }}>How selling works</h2>
                  <p style={{ fontSize: 16, lineHeight: 1.7, color: "#64748b", marginTop: 14 }}>From photo to pickup, DropYard makes selling to your neighbours effortless.</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginTop: 48 }}>
                  {[
                    { n: "1", icon: Upload, title: "List Your Items", desc: "Write your own listings or snap photos and let AI do it. Set your price, describe the item, and choose Drop or Shelf.", color: C.oPrimary, bg: C.oLightBg, accent: "rgba(254,215,170,0.8)" },
                    { n: "2", icon: Eye, title: "Buyers Discover", desc: "Your items appear in the weekend Drop or on the Shelf. Dedicated Sales get featured placement and their own storefront.", color: C.gPrimary, bg: C.gLightBg, accent: "rgba(209,250,229,0.8)" },
                    { n: "3", icon: MessageCircle, title: "Handle Inquiries", desc: "Respond to buyers yourself, or turn on the AI agent to auto-respond, negotiate offers, and schedule pickups for you.", color: C.ai, bg: C.aiLight, accent: "rgba(196,181,253,0.6)" },
                    { n: "4", icon: CheckCircle, title: "Confirm & Collect", desc: "Accept claims, confirm pickup times, and meet your neighbour. Get notified via WhatsApp every step of the way.", color: C.gPrimary, bg: C.gLightBg, accent: "rgba(209,250,229,0.8)" },
                  ].map((step, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <div style={{ position: "relative", overflow: "hidden", borderRadius: 28, border: "1px solid #e2e8f0", backgroundColor: "#fff", padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "all 0.3s", cursor: "pointer", height: "100%" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}>
                        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 96, background: `linear-gradient(to bottom, ${step.accent}, transparent)`, pointerEvents: "none" }} />
                        <div style={{ position: "relative" }}>
                          <div style={{ position: "relative", width: 64, height: 64, borderRadius: 24, backgroundColor: step.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <step.icon size={32} style={{ color: step.color }} />
                            <span style={{ position: "absolute", top: -8, right: -8, width: 32, height: 32, borderRadius: "50%", backgroundColor: step.color, color: "#fff", fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>{step.n}</span>
                          </div>
                          <h3 style={{ fontSize: "clamp(18px,2vw,24px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#0f172a", marginTop: 24 }}>{step.title}</h3>
                          <p style={{ fontSize: 14, lineHeight: 1.8, color: "#64748b", marginTop: 12 }}>{step.desc}</p>
                        </div>
                      </div>
                      {i < 3 && <div style={{ position: "absolute", right: -14, top: "50%", transform: "translateY(-50%)", zIndex: 20, width: 40, height: 40, borderRadius: "50%", border: "1px solid #e2e8f0", backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}><ArrowRight size={16} style={{ color: "#cbd5e1" }} /></div>}
                    </div>
                  ))}
                </div>
                {/* WhatsApp banner */}
                <div style={{ maxWidth: 600, margin: "40px auto 0", borderRadius: 24, border: "1px solid #a7f3d0", backgroundColor: "rgba(236,253,245,0.7)", padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: C.wa, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><MessageCircle size={24} style={{ color: "#fff" }} /></div>
                    <p style={{ fontSize: 15, lineHeight: 1.7, color: "#334155" }}>Claims, confirmations, and pickup reminders — all delivered to your <b style={{ color: C.wa }}>WhatsApp</b></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ 3. CHOOSE HOW TO SELL ══════════ */}
        <section style={{ padding: "56px 24px", backgroundColor: "#FAFAF8" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.24em", color: C.oPrimary }}>Two tiers, one community</span>
              <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0f172a", marginTop: 10 }}>Choose how you want to sell</h2>
              <p style={{ fontSize: 15, color: "#64748b", marginTop: 8 }}>Whether it&apos;s a few items or your entire household, there&apos;s a tier for you.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
              {/* Weekly Drop */}
              <div style={{ borderRadius: 28, overflow: "hidden", border: `2px solid ${C.gSoft}`, backgroundColor: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", transition: "all 0.3s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)"; }}>
                <div style={{ padding: "28px 28px 20px", background: `linear-gradient(135deg,${C.gDark},${C.gHover})`, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                  <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><Calendar size={24} style={{ color: C.gAccent }} /></div>
                      <span style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>Free</span>
                    </div>
                    <h3 style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginTop: 16 }}>Weekly Neighbourhood Drop</h3>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 6, lineHeight: 1.6 }}>Sell a few items each week. Perfect for regular decluttering. Items go live every Saturday.</p>
                  </div>
                </div>
                <div style={{ padding: 28 }}>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginBottom: 24 }}>
                    {["List 1–10 items per week", "Items go live each Saturday 8am", "48-hour claiming window", "Unsold items roll to the Shelf", "List manually or use AI Agent (5 free/month)"].map((pt, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span style={{ marginTop: 2, display: "inline-flex", width: 20, height: 20, alignItems: "center", justifyContent: "center", borderRadius: "50%", backgroundColor: C.gLightBg, color: C.gPrimary, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: 14, color: "#475569" }}>{pt}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={goJoin} style={{ width: "100%", padding: "14px 0", borderRadius: 50, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, backgroundColor: C.gPrimary, color: "#fff", boxShadow: `0 4px 16px ${C.gPrimary}40`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.gHover)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.gPrimary)}>
                    Start Selling Weekly <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Dedicated Sales Drop */}
              <div style={{ borderRadius: 28, overflow: "hidden", border: `2px solid ${C.oSoft}`, backgroundColor: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", position: "relative", transition: "all 0.3s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)"; }}>
                <div style={{ position: "absolute", top: 12, right: 12, zIndex: 5, fontSize: 10, fontWeight: 800, padding: "4px 12px", borderRadius: 50, backgroundColor: C.oPrimary, color: "#fff", letterSpacing: 0.5 }}>PREMIUM</div>
                <div style={{ padding: "28px 28px 20px", background: `linear-gradient(135deg,${C.oPrimary},${C.oHover})`, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                  <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}><Tag size={24} style={{ color: "#fff" }} /></div>
                      <span style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>From <span style={{ fontSize: 28 }}>$29</span></span>
                    </div>
                    <h3 style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginTop: 16 }}>Dedicated Sales Drop</h3>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 6, lineHeight: 1.6 }}>Your own featured sale with a custom date range, seller storefront, and extended visibility.</p>
                  </div>
                </div>
                <div style={{ padding: 28 }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                    {[{ id: "moving", label: "🚚 Moving", price: "$49" }, { id: "estate", label: "🏠 Estate", price: "$79" }, { id: "garage", label: "🏷️ Garage", price: "$29" }].map(t => (
                      <button key={t.id} onClick={() => setDedTab(t.id)} style={{ flex: 1, padding: "8px 0", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 700, backgroundColor: dedTab === t.id ? C.oPrimary : "#f8fafc", color: dedTab === t.id ? "#fff" : "#64748b", border: `1.5px solid ${dedTab === t.id ? C.oPrimary : "#e2e8f0"}`, transition: "all 0.15s" }}>
                        {t.label} <span style={{ fontWeight: 800 }}>{t.price}</span>
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginBottom: 24 }}>
                    {(dedTab === "moving"
                      ? ["Unlimited items — list your entire home", "Custom date range (2–4 weeks)", "Featured placement during live Drops", "Dedicated seller storefront page", "List manually or let AI handle everything"]
                      : dedTab === "estate"
                        ? ["Unlimited items — full estate catalogue", "Extended date range (up to 30 days)", "Featured placement + priority visibility", "Dedicated storefront with collection grouping", "List manually or let AI handle everything"]
                        : ["Up to 50 items", "Weekend date range", "Featured in neighbourhood feed", "Dedicated seller page", "List manually or let AI handle everything"]
                    ).map((pt, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span style={{ marginTop: 2, display: "inline-flex", width: 20, height: 20, alignItems: "center", justifyContent: "center", borderRadius: "50%", backgroundColor: C.oLightBg, color: C.oPrimary, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: 14, color: "#475569" }}>{pt}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={goJoin} style={{ width: "100%", padding: "14px 0", borderRadius: 50, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, backgroundColor: C.oPrimary, color: "#fff", boxShadow: "0 4px 16px rgba(245,158,11,0.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.oHover)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.oPrimary)}>
                    {dedTab === "moving" ? "Plan Your Moving Sale" : dedTab === "estate" ? "Start Your Estate Sale" : "Launch Your Garage Sale"} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Shelf callout */}
            <div style={{ marginTop: 24, padding: "16px 24px", borderRadius: 16, backgroundColor: "#fff", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: C.oLightBg, display: "flex", alignItems: "center", justifyContent: "center" }}><Package size={22} style={{ color: C.oPrimary }} /></div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>The Shelf — your items stay visible</p>
                  <p style={{ fontSize: 13, color: "#64748b" }}>Unsold Drop items automatically move to the Shelf — browsable anytime. AI suggests price reductions over time.</p>
                </div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.oPrimary, flexShrink: 0 }}>Included free</span>
            </div>
          </div>
        </section>

        {/* ══════════ 4. AI SELLER AGENT ══════════ */}
        <section style={{ padding: "56px 24px", backgroundColor: "#fff" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 48, alignItems: "center" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 50, backgroundColor: C.aiLight, border: `1px solid ${C.aiBorder}`, marginBottom: 16 }}>
                  <Sparkles size={14} style={{ color: C.ai }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.ai }}>Optional — AI Seller Agent</span>
                </div>
                <h2 style={{ fontSize: "clamp(26px,3.5vw,36px)", fontWeight: 900, color: "#0f172a", lineHeight: 1.15, marginBottom: 12 }}>Want to go hands-free?<br /><span style={{ color: C.oPrimary }}>Let AI handle it.</span></h2>
                <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, marginBottom: 28 }}>You can manage everything yourself — or turn on the AI Seller Agent and let it handle the rest. Set your price floor once. The AI responds to buyers, negotiates offers, and schedules pickups. You just get a WhatsApp when something sells.</p>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 28 }}>
                  {[
                    { e: "📸", t: "Photo-to-listing", d: "Identifies items, writes descriptions, suggests prices" },
                    { e: "💬", t: "Buyer communication", d: "Responds to questions and 'is this still available?' messages" },
                    { e: "🤝", t: "Price negotiation", d: "Accepts, counters, or declines within your rules" },
                    { e: "📅", t: "Pickup scheduling", d: "Coordinates times within your availability windows" },
                    { t: "WhatsApp notifications", d: "Claims, confirmations, and reminders to your WhatsApp", isWa: true },
                    { e: "🔄", t: "No-show handling", d: "Re-opens and contacts the next buyer" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px", borderRadius: 14, backgroundColor: i % 2 === 0 ? "#fafafa" : "#fff", border: "1px solid #f0f0f0" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: (item as any).isWa ? "#F0FFF4" : C.gLightBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>
                        {(item as any).isWa ? <MessageCircle size={16} style={{ color: C.wa }} /> : (item as any).e}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{item.t}</p>
                        <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={goJoin} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 50, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, background: `linear-gradient(135deg,${C.ai},#6D28D9)`, color: "#fff", boxShadow: `0 6px 24px ${C.ai}30` }}>
                  Try the AI Agent — 5 Free Listings/Month <ArrowRight size={16} />
                </button>
                <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>Then $4.99/month for unlimited AI listings</p>
              </div>

              {/* Chat simulation */}
              <div style={{ borderRadius: 24, overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 12px 48px rgba(0,0,0,0.08)" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #f0f0f0", backgroundColor: "#fafafa", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${C.ai},#6D28D9)`, display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkles size={16} style={{ color: "#fff" }} /></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>DropYard AI Agent</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#22C55E" }} /><span style={{ fontSize: 10, color: "#94a3b8" }}>Handling buyers for your 15 items</span></div>
                  </div>
                </div>
                <div style={{ padding: 20, backgroundColor: "#fff", display: "flex", flexDirection: "column" as const, gap: 14 }}>
                  <div style={{ display: "flex", gap: 8 }}><div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>S</span></div>
                    <div style={{ borderRadius: 16, borderBottomLeftRadius: 4, padding: "10px 14px", backgroundColor: "#f1f5f9", maxWidth: "75%" }}>
                      <p style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", marginBottom: 2 }}>Sarah M. — Barrhaven</p>
                      <p style={{ fontSize: 13, color: "#0f172a", lineHeight: 1.5 }}>&quot;Is the bookshelf still available? Would you take $30?&quot;</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <div style={{ borderRadius: 16, borderBottomRightRadius: 4, padding: "10px 14px", maxWidth: "80%", backgroundColor: C.aiLight, border: `1px solid ${C.aiBorder}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}><Sparkles size={9} style={{ color: C.ai }} /><span style={{ fontSize: 8, fontWeight: 800, color: C.ai }}>AI AGENT</span></div>
                      <p style={{ fontSize: 13, color: "#0f172a", lineHeight: 1.6 }}>&quot;Hi Sarah! The KALLAX bookshelf is available. The seller&apos;s minimum is $30, so you&apos;ve got a deal! Shall I book it? Saturday 10am–12pm or 12pm–3pm? 😊&quot;</p>
                    </div>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${C.ai},#6D28D9)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Sparkles size={10} style={{ color: "#fff" }} /></div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}><div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>S</span></div>
                    <div style={{ borderRadius: 16, borderBottomLeftRadius: 4, padding: "10px 14px", backgroundColor: "#f1f5f9", maxWidth: "75%" }}><p style={{ fontSize: 13, color: "#0f172a" }}>&quot;Saturday 10am works!&quot;</p></div>
                  </div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <div style={{ borderRadius: 16, borderBottomRightRadius: 4, padding: "10px 14px", maxWidth: "80%", backgroundColor: C.gLightBg, border: `1px solid ${C.gSoft}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}><CheckCircle size={10} style={{ color: C.gPrimary }} /><span style={{ fontSize: 8, fontWeight: 800, color: C.gPrimary }}>CLAIMED</span></div>
                      <p style={{ fontSize: 13, color: "#0f172a", lineHeight: 1.6 }}>&quot;Done! Bookshelf claimed at $30. Pickup Saturday 10am. Address sent. See you then! 🏡&quot;</p>
                    </div>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${C.gPrimary},${C.gHover})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Check size={10} style={{ color: "#fff" }} /></div>
                  </div>
                </div>
                <div style={{ padding: "12px 20px", borderTop: "1px solid #f0f0f0", backgroundColor: "#F0FFF4", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: C.wa, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><MessageCircle size={13} style={{ color: "#fff" }} /></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#0f172a" }}>You received on WhatsApp:</p>
                    <p style={{ fontSize: 12, color: "#475569" }}>&quot;Your bookshelf was claimed! $30, pickup Sat 10am.&quot;</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ 5. WHY SELLERS LOVE DROPYARD ══════════ */}
        <section style={{ padding: "56px 24px", backgroundColor: "#FAFAF8" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ position: "relative", overflow: "hidden", borderRadius: 36, border: "1px solid #e2e8f0", background: "linear-gradient(180deg,#fcfcfb 0%,#f7f7f4 100%)", padding: "56px 40px", boxShadow: "0 25px 70px rgba(15,23,42,0.06)" }}>
              <div style={{ position: "absolute", left: -40, top: 32, width: 176, height: 176, borderRadius: "50%", background: "rgba(254,215,170,0.4)", filter: "blur(48px)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", right: -20, top: 0, width: 208, height: 208, borderRadius: "50%", background: "rgba(209,250,229,0.5)", filter: "blur(48px)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.24em", color: C.oPrimary }}>The Perks</span>
                  <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#0f172a", marginTop: 14 }}>Why sellers love DropYard</h2>
                  <p style={{ fontSize: 16, lineHeight: 1.7, color: "#64748b", marginTop: 14 }}>Sell faster, keep more, and let AI do the heavy lifting.</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginTop: 48 }}>
                  {[
                    { icon: Zap, title: "Sell Fast", desc: "Items sell quickly during weekend Drops. The 48-hour window creates urgency that drives claims.", color: C.oPrimary, bg: C.oLightBg },
                    { icon: MapPin, title: "Local Only", desc: "Buyers come to you — no shipping, no packaging. Just neighbours picking up from your front porch.", color: C.gPrimary, bg: C.gLightBg },
                    { icon: DollarSign, title: "Keep More", desc: "No fees on your first 10 items each month. No commission on sales. Your price is your price.", color: C.oPrimary, bg: C.oLightBg },
                    { icon: Sparkles, title: "AI Available", desc: "List manually or turn on the AI agent. It creates listings from photos, responds to buyers, negotiates, and schedules pickups.", color: C.ai, bg: C.aiLight },
                  ].map((perk, i) => (
                    <div key={i} style={{ position: "relative", overflow: "hidden", borderRadius: 28, border: "1px solid #e2e8f0", backgroundColor: "#fff", padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "all 0.3s", cursor: "pointer" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}>
                      <div style={{ width: 64, height: 64, borderRadius: 24, backgroundColor: perk.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><perk.icon size={32} style={{ color: perk.color }} /></div>
                      <h3 style={{ fontSize: "clamp(18px,2vw,24px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#0f172a", marginTop: 24 }}>{perk.title}</h3>
                      <p style={{ fontSize: 14, lineHeight: 1.8, color: "#64748b", marginTop: 12 }}>{perk.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ 6. STATS ══════════ */}
        <section style={{ padding: "48px 24px", backgroundColor: "#fff" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ position: "relative", overflow: "hidden", borderRadius: 36, border: "1px solid #e2e8f0", background: "linear-gradient(180deg,#fcfcfb 0%,#f7f7f4 100%)", padding: "48px 40px", boxShadow: "0 25px 70px rgba(15,23,42,0.06)" }}>
              <div style={{ position: "absolute", left: -30, top: 24, width: 160, height: 160, borderRadius: "50%", background: "rgba(251,191,36,0.15)", filter: "blur(48px)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", right: -20, top: 0, width: 176, height: 176, borderRadius: "50%", background: "rgba(209,250,229,0.5)", filter: "blur(48px)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.24em", color: C.gPrimary }}>Trusted Locally</span>
                  <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#0f172a", marginTop: 14 }}>Sellers are thriving</h2>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20, marginTop: 40 }}>
                  {[
                    { v: "2,500+", l: "items sold", color: C.oPrimary, accent: "rgba(254,215,170,0.6)", e: "🏷️" },
                    { v: "$38K+", l: "earned by sellers", color: C.gPrimary, accent: "rgba(209,250,229,0.8)", e: "💰" },
                    { v: "< 2 min", l: "avg listing time with AI", color: C.ai, accent: "rgba(196,181,253,0.5)", e: "⚡" },
                    { v: "92%", l: "sell within first Drop", color: C.gPrimary, accent: "rgba(209,250,229,0.8)", e: "🎯" },
                  ].map((s, i) => (
                    <div key={i} style={{ position: "relative", overflow: "hidden", borderRadius: 28, border: "1px solid #e2e8f0", backgroundColor: "#fff", padding: 28, textAlign: "center", transition: "all 0.3s", cursor: "pointer" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}>
                      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 96, background: `linear-gradient(to bottom, ${s.accent}, transparent)`, pointerEvents: "none" }} />
                      <div style={{ position: "relative" }}>
                        <span style={{ fontSize: 28 }}>{s.e}</span>
                        <p style={{ fontSize: "clamp(28px,3vw,40px)", fontWeight: 800, letterSpacing: "-0.05em", color: "#0f172a", marginTop: 12 }}>{s.v}</p>
                        <p style={{ fontSize: 16, color: "#64748b", marginTop: 8 }}>{s.l}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ 7. CTA ══════════ */}
        <section style={{ padding: "64px 24px", background: `linear-gradient(165deg,${C.oPrimary},${C.oHover})`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: "15%", width: 250, height: 250, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ position: "absolute", bottom: -40, left: "10%", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            <h2 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, color: "#fff", marginBottom: 10 }}>Ready to start selling?</h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", marginBottom: 28, lineHeight: 1.7 }}>Join DropYard and turn your unused items into cash. List items yourself or let AI handle everything — from listings to pickups. Your choice, your pace.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={goJoin} style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 50, border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, backgroundColor: "#fff", color: C.oPrimary, boxShadow: "0 8px 28px rgba(0,0,0,0.1)" }}>
                Become a Seller <ArrowRight size={18} />
              </button>
              <button onClick={goJoin} style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 50, border: "2px solid rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 16, fontWeight: 700, backgroundColor: "transparent", color: "#fff" }}>
                <Sparkles size={16} /> Try AI Agent Free
              </button>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
