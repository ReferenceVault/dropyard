"use client";
import { useState, useEffect } from "react";
import {
  Camera, Image, X, Check, ChevronRight, Sparkles, Zap,
  MessageCircle, Package, Heart, Settings, Bell, Eye,
  ArrowRight, Upload, Search, User, Clock, Calendar,
  CheckCircle, MapPin, LayoutGrid, Box, DollarSign,
  ClipboardList, MapPinned, MessageSquare, Plus, Truck,
  History, ArrowLeft, ChevronDown, Shield, AlertCircle,
  RefreshCw, Tag
} from "lucide-react";

/* ═══ BRAND TOKENS ═══ */
const C = {
  gLightBg: "#ECFDF5", gSoft: "#D1FAE5", gAccent: "#6EE7B7",
  gPrimary: "#1F7A4D", gHover: "#17603D", gDark: "#0F3D2A",
  oLightBg: "#FFF7ED", oSoft: "#FED7AA", oAccent: "#FDBA74",
  oPrimary: "#F08A00", oHover: "#C96F00", oDark: "#7A4300",
  tPrimary: "#0F766E", tLight: "#CCFBF1",
  ai: "#7C3AED", aiLight: "#F5F3FF", aiBorder: "#DDD6FE",
  wa: "#25D366",
};
const F = { h: "'Outfit', sans-serif", b: "'Plus Jakarta Sans', sans-serif" };

/* ═══ SIDEBAR ═══ */
function Sidebar({ activeView, onNavigate, aiActive }) {
  const items = [
    { id: "overview", label: "Overview", icon: LayoutGrid, section: "MANAGE" },
    { id: "items", label: "My Items", icon: Box },
    { id: "claims", label: "Incoming Claims", icon: ClipboardList },
    { id: "pickups", label: "Pickups", icon: MapPinned },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "divider1" },
    { id: "list", label: "List Item", icon: Plus, badge: "Mon", section: null },
    { id: "ai", label: "Sell with AI", icon: Sparkles, isAI: true },
    { id: "moving", label: "Start a Dedicated Sale", icon: Truck },
    { id: "history", label: "History", icon: History },
  ];

  return (
    <div style={{ width: 240, borderRight: "1px solid #f0f0f0", background: "#fff", display: "flex", flexDirection: "column", height: "100%", flexShrink: 0 }}>
      {/* Seller/Buyer toggle */}
      <div style={{ padding: "16px 16px 12px", display: "flex", background: "#fafafa", borderRadius: 10, margin: "12px 12px 0", border: "1px solid #f0f0f0" }}>
        <button style={{ flex: 1, padding: "6px 0", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", backgroundColor: C.gLightBg, color: C.gPrimary, fontFamily: F.b }}>Seller</button>
        <button style={{ flex: 1, padding: "6px 0", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", backgroundColor: "transparent", color: "#999", fontFamily: F.b }}>Buyer</button>
      </div>

      <div style={{ padding: "20px 12px", flex: 1 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: 1.5, marginBottom: 8, paddingLeft: 8, fontFamily: F.b }}>MANAGE</p>

        {items.map((item, i) => {
          if (item.id === "divider1") return <div key={i} style={{ height: 1, background: "#f0f0f0", margin: "12px 8px" }} />;
          const active = activeView === item.id || (item.isAI && activeView.startsWith("ai"));
          return (
            <button key={item.id} onClick={() => onNavigate(item.id === "ai" ? (aiActive ? "ai-dashboard" : "ai-setup") : item.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px",
                borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 2, textAlign: "left",
                backgroundColor: active ? (item.isAI ? C.aiLight : C.gLightBg) : "transparent",
                transition: "all 0.15s",
              }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                backgroundColor: active ? (item.isAI ? C.ai : C.gPrimary) : "transparent",
              }}>
                <item.icon size={16} style={{ color: active ? "#fff" : item.isAI ? C.ai : "#aaa" }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? (item.isAI ? C.ai : C.gPrimary) : "#555", fontFamily: F.b, flex: 1 }}>{item.label}</span>
              {item.badge && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, backgroundColor: C.oPrimary + "15", color: C.oPrimary }}>{item.badge}</span>}
              {item.isAI && !active && <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 20, backgroundColor: C.ai + "15", color: C.ai }}>NEW</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══ TOP NAV BAR ═══ */
function TopNav() {
  return (
    <div style={{ height: 56, borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: "#fff", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 20 }}>🏡</span>
        <span style={{ fontSize: 18, fontWeight: 900, fontFamily: F.h }}>
          <span style={{ color: C.oPrimary }}>Drop</span><span style={{ color: C.gPrimary }}>Yard</span>
        </span>
      </div>
      {/* Drop status */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 50, backgroundColor: C.gLightBg, border: `1px solid ${C.gSoft}` }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#22C55E" }} />
        <span style={{ fontSize: 12, fontWeight: 500, color: "#555", fontFamily: F.b }}>Drop:</span>
        <span style={{ fontSize: 12, fontWeight: 800, color: C.oPrimary, fontFamily: F.b }}>Drop is live!</span>
        <span style={{ fontSize: 11, color: "#999", fontFamily: F.b }}>Claim items now. Pickup this weekend.</span>
        <span style={{ fontSize: 12, fontWeight: 800, color: C.gDark, fontFamily: F.h, letterSpacing: 1, backgroundColor: "#fff", padding: "2px 10px", borderRadius: 6 }}>1d 1h 45m</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: C.oAccent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: C.oDark, fontFamily: F.h }}>AA</div>
        <span style={{ fontSize: 13, color: "#999", fontFamily: F.b, cursor: "pointer" }}>Sign out</span>
      </div>
    </div>
  );
}

/* ═══ OVERVIEW (existing dashboard) ═══ */
function OverviewContent({ onStartAI }) {
  return (
    <div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { icon: Box, label: "Items Listed", value: "0", bg: C.gLightBg, ic: C.gPrimary },
          { icon: ClipboardList, label: "Incoming Claims", value: "0", bg: C.oLightBg, ic: C.oPrimary },
          { icon: DollarSign, label: "Total Revenue", value: "$0", bg: "#E0F2FE", ic: "#0284C7" },
          { icon: Eye, label: "Total Watchers", value: "0", bg: "#F3E8FF", ic: "#7C3AED" },
        ].map((s, i) => (
          <div key={i} style={{ padding: 20, borderRadius: 16, border: "1px solid #f0f0f0", background: "#fff" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <s.icon size={18} style={{ color: s.ic }} />
            </div>
            <p style={{ fontSize: 28, fontWeight: 900, color: C.gDark, fontFamily: F.h }}>{s.value}</p>
            <p style={{ fontSize: 12, color: "#999", marginTop: 2, fontFamily: F.b }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ padding: 24, borderRadius: 16, border: "1px solid #f0f0f0", background: "#fff" }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: C.gDark, marginBottom: 14, fontFamily: F.h }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 12, border: "none", cursor: "pointer", backgroundColor: C.gPrimary, color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: F.b }}>
            <Plus size={16} /> List New Item
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 12, border: "1px solid #e5e7eb", cursor: "pointer", backgroundColor: "#fff", color: "#555", fontSize: 13, fontWeight: 600, fontFamily: F.b }}>
            <ClipboardList size={16} /> View Incoming Claims
          </button>

          {/* ★ SELL WITH AI BUTTON ★ */}
          <button onClick={onStartAI}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12,
              border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F.b,
              background: `linear-gradient(135deg, ${C.ai}, #6D28D9)`, color: "#fff",
              boxShadow: `0 4px 16px ${C.ai}30`, transition: "transform 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
            <Sparkles size={16} /> Sell with AI
            <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 20, backgroundColor: "rgba(255,255,255,0.2)", marginLeft: 4 }}>NEW</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══ AI SETUP (first-time) ═══ */
function AISetupContent({ onComplete }) {
  const [priceFloor, setPriceFloor] = useState(60);
  const [autoAccept, setAutoAccept] = useState(true);
  const [style, setStyle] = useState("friendly");

  return (
    <div>
      {/* Back + Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 50, backgroundColor: C.aiLight, border: `1px solid ${C.aiBorder}` }}>
          <Sparkles size={14} style={{ color: C.ai }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: C.ai, fontFamily: F.b }}>AI Seller Agent — Setup</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Left column */}
        <div>
          {/* Intro */}
          <div style={{ padding: 20, borderRadius: 16, marginBottom: 16, background: `linear-gradient(135deg, ${C.aiLight}, #EDE9FE)`, border: `1px solid ${C.aiBorder}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${C.ai}, #6D28D9)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={18} style={{ color: "#fff" }} />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 800, color: C.gDark, fontFamily: F.h }}>Set up your AI agent</p>
                <p style={{ fontSize: 11, color: "#888", fontFamily: F.b }}>One-time setup — change anytime in Settings</p>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "#666", lineHeight: 1.7, fontFamily: F.b }}>
              Your AI agent will create listings from photos, respond to buyers, negotiate prices within your rules, schedule pickups, and notify you via WhatsApp.
            </p>
          </div>

          {/* Price floor */}
          <div style={{ padding: 20, borderRadius: 16, border: "1px solid #f0f0f0", background: "#fff", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.gDark, fontFamily: F.h }}>Price Floor</p>
                <p style={{ fontSize: 11, color: "#999", fontFamily: F.b }}>Accept offers above this % of listed price</p>
              </div>
              <div style={{ textAlign: "center", padding: "6px 14px", borderRadius: 12, backgroundColor: C.gLightBg }}>
                <span style={{ fontSize: 24, fontWeight: 900, color: C.gPrimary, fontFamily: F.h }}>{priceFloor}%</span>
              </div>
            </div>
            <input type="range" min="40" max="100" value={priceFloor} onChange={e => setPriceFloor(Number(e.target.value))}
              style={{ width: "100%", height: 6, borderRadius: 20, appearance: "none", cursor: "pointer",
                background: `linear-gradient(to right, ${C.gPrimary} ${(priceFloor - 40) / 60 * 100}%, #e5e7eb ${(priceFloor - 40) / 60 * 100}%)` }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontSize: 10, color: "#bbb" }}>40% (flexible)</span>
              <span style={{ fontSize: 10, color: "#bbb" }}>100% (firm)</span>
            </div>
            <div style={{ marginTop: 10, padding: 10, borderRadius: 10, backgroundColor: C.oLightBg }}>
              <p style={{ fontSize: 11, color: C.oDark, fontFamily: F.b }}>
                Example: You list a table at $40. At {priceFloor}%, AI auto-accepts any offer of <b>${Math.round(40 * priceFloor / 100)}</b> or above.
              </p>
            </div>
          </div>

          {/* Auto-accept */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 16, border: `1.5px solid ${autoAccept ? C.gPrimary + "40" : "#e5e7eb"}`, backgroundColor: autoAccept ? C.gLightBg : "#fff" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: autoAccept ? C.gPrimary + "20" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={18} style={{ color: autoAccept ? C.gPrimary : "#999" }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.gDark, fontFamily: F.b }}>Auto-Accept Full Price Claims</p>
              <p style={{ fontSize: 11, color: "#999", fontFamily: F.b }}>Claims at listed price are accepted instantly</p>
            </div>
            <button onClick={() => setAutoAccept(!autoAccept)}
              style={{ width: 48, height: 28, borderRadius: 20, padding: 2, border: "none", cursor: "pointer", backgroundColor: autoAccept ? C.gPrimary : "#D1D5DB", transition: "all 0.2s" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.15)", transform: autoAccept ? "translateX(20px)" : "translateX(0)", transition: "transform 0.2s" }} />
            </button>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Pickup availability */}
          <div style={{ padding: 20, borderRadius: 16, border: "1px solid #f0f0f0", background: "#fff", marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.gDark, marginBottom: 12, fontFamily: F.h }}>Pickup Availability</p>
            {[
              { day: "Saturday", slots: ["9am–12pm", "12pm–3pm", "3pm–6pm"], active: [true, true, false] },
              { day: "Sunday", slots: ["10am–1pm", "1pm–4pm", "4pm–6pm"], active: [true, false, false] },
            ].map(d => (
              <div key={d.day} style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 6, fontFamily: F.b }}>{d.day}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  {d.slots.map((s, i) => (
                    <button key={i} style={{
                      flex: 1, padding: "8px 0", borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: "pointer",
                      backgroundColor: d.active[i] ? C.gLightBg : "#fafafa",
                      color: d.active[i] ? C.gPrimary : "#bbb",
                      border: `1.5px solid ${d.active[i] ? C.gPrimary + "30" : "#e5e7eb"}`,
                      fontFamily: F.b,
                    }}>{d.active[i] && "✓ "}{s}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Communication style */}
          <div style={{ padding: 20, borderRadius: 16, border: "1px solid #f0f0f0", background: "#fff", marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.gDark, marginBottom: 12, fontFamily: F.h }}>AI Communication Style</p>
            {[
              { id: "friendly", l: "Friendly Neighbour", d: "\"Hi! Thanks for your interest in the lamp — it's in great shape!\"", e: "😊" },
              { id: "professional", l: "Professional", d: "\"Thank you for your inquiry. The item is available at the listed price.\"", e: "💼" },
              { id: "brief", l: "Quick & Brief", d: "\"Yes, available. $20. Pickup Saturday 2pm?\"", e: "⚡" },
            ].map(s => (
              <button key={s.id} onClick={() => setStyle(s.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 12,
                  border: `2px solid ${style === s.id ? C.gPrimary : "#f0f0f0"}`,
                  backgroundColor: style === s.id ? C.gLightBg : "#fff",
                  marginBottom: 8, textAlign: "left", cursor: "pointer",
                }}>
                <span style={{ fontSize: 20 }}>{s.e}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.gDark, fontFamily: F.b }}>{s.l}</p>
                  <p style={{ fontSize: 10, color: "#999", fontStyle: "italic", fontFamily: F.b }}>{s.d}</p>
                </div>
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${style === s.id ? C.gPrimary : "#D1D5DB"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {style === s.id && <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: C.gPrimary }} />}
                </div>
              </button>
            ))}
          </div>

          {/* WhatsApp */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 12, backgroundColor: "#F0FFF4", border: `1px solid ${C.wa}25` }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: C.wa, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MessageCircle size={16} style={{ color: "#fff" }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.gDark, fontFamily: F.b }}>WhatsApp Notifications</p>
              <p style={{ fontSize: 10, color: "#777", fontFamily: F.b }}>Claims, confirmations, and pickup reminders sent to your WhatsApp</p>
            </div>
            <button style={{ width: 44, height: 26, borderRadius: 20, padding: 2, border: "none", cursor: "pointer", backgroundColor: C.wa }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.15)", transform: "translateX(18px)" }} />
            </button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onComplete}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 14,
            border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F.b,
            background: `linear-gradient(135deg, ${C.ai}, #6D28D9)`, color: "#fff",
            boxShadow: `0 6px 24px ${C.ai}30`,
          }}>
          Save & Start Listing with AI <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ═══ AI PHOTO LISTING FLOW ═══ */
function AIPhotoListingContent({ onComplete, onBack }) {
  const [phase, setPhase] = useState("upload"); // upload, processing, review
  const [processIdx, setProcessIdx] = useState(0);

  const items = [
    { id: 1, e: "🪑", t: "IKEA KALLAX Bookshelf — White", d: "4-cube bookshelf in good condition. Minor scuff on bottom right corner. 77×77cm.", cat: "Furniture", cond: "Good", price: "35" },
    { id: 2, e: "🍳", t: "Cuisinart 12-Cup Coffee Maker", d: "Stainless steel, fully functional. Includes reusable filter and carafe.", cat: "Kitchen", cond: "Excellent", price: "25" },
    { id: 3, e: "👶", t: "Graco Stroller — Blue/Grey", d: "Compact fold stroller, suitable for 6m–3yr. Clean, no tears.", cat: "Kids & Baby", cond: "Good", price: "45" },
    { id: 4, e: "📱", t: "Samsung Galaxy Tab A7 — 32GB", d: "10.4\" tablet with case. Light scratches on screen. Battery good.", cat: "Electronics", cond: "Fair", price: "80" },
    { id: 5, e: "🔧", t: "DeWalt 20V Drill Set", d: "Cordless drill with 2 batteries, charger, and bit set.", cat: "Tools", cond: "Excellent", price: "65" },
  ];

  useEffect(() => {
    if (phase === "processing" && processIdx < items.length) {
      const t = setTimeout(() => setProcessIdx(p => p + 1), 900);
      return () => clearTimeout(t);
    }
    if (phase === "processing" && processIdx >= items.length) setTimeout(() => setPhase("review"), 500);
  }, [phase, processIdx]);

  return (
    <div>
      {/* Header with breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb", backgroundColor: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#777", fontFamily: F.b }}>
          <ArrowLeft size={14} /> Back
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 50, backgroundColor: C.aiLight, border: `1px solid ${C.aiBorder}` }}>
          <Sparkles size={12} style={{ color: C.ai }} />
          <span style={{ fontSize: 11, fontWeight: 800, color: C.ai, fontFamily: F.b }}>
            {phase === "upload" ? "Upload Photos" : phase === "processing" ? "AI Processing..." : "Review & Approve"}
          </span>
        </div>
        {/* Progress */}
        <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
          {["Upload", "AI Processing", "Review"].map((s, i) => (
            <div key={i} style={{ width: 80, height: 4, borderRadius: 4, backgroundColor: (phase === "upload" && i === 0) || (phase === "processing" && i <= 1) || phase === "review" ? C.ai : "#e5e7eb" }} />
          ))}
        </div>
      </div>

      {/* UPLOAD */}
      {phase === "upload" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div onClick={() => { setPhase("processing"); setProcessIdx(0); }}
            style={{ gridColumn: "1 / -1", height: 200, borderRadius: 20, border: `2px dashed ${C.ai}40`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, cursor: "pointer", backgroundColor: C.aiLight, transition: "all 0.2s" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: C.ai + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Camera size={28} style={{ color: C.ai }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: C.gDark, fontFamily: F.h }}>Drop photos here or click to upload</p>
              <p style={{ fontSize: 12, color: "#999", marginTop: 4, fontFamily: F.b }}>One photo per item • JPG, PNG • Batch upload supported</p>
            </div>
          </div>

          {/* Selected photos grid */}
          <div style={{ gridColumn: "1 / -1" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#bbb", letterSpacing: 1, marginBottom: 8, fontFamily: F.b }}>SELECTED PHOTOS ({items.length})</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {items.map(item => (
                <div key={item.id} style={{ width: 72, height: 72, borderRadius: 14, border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, backgroundColor: "#fafafa", position: "relative" }}>
                  {item.e}
                  <button style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: "50%", backgroundColor: "#EF4444", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <X size={8} style={{ color: "#fff" }} />
                  </button>
                </div>
              ))}
              <div style={{ width: 72, height: 72, borderRadius: 14, border: "2px dashed #d1d5db", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Plus size={20} style={{ color: "#d1d5db" }} />
              </div>
            </div>
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => { setPhase("processing"); setProcessIdx(0); }}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 14, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, background: `linear-gradient(135deg, ${C.ai}, #6D28D9)`, color: "#fff", boxShadow: `0 6px 20px ${C.ai}30`, fontFamily: F.b }}>
              <Sparkles size={16} /> Let AI Create {items.length} Listings
            </button>
          </div>
        </div>
      )}

      {/* PROCESSING */}
      {phase === "processing" && (
        <div style={{ maxWidth: 600 }}>
          {items.map((item, i) => (
            <div key={item.id} style={{
              display: "flex", alignItems: "center", gap: 14, padding: 14, borderRadius: 14,
              border: `1.5px solid ${i < processIdx ? C.gPrimary + "30" : i === processIdx ? C.ai + "40" : "#f0f0f0"}`,
              backgroundColor: i < processIdx ? C.gLightBg : i === processIdx ? C.aiLight : "#fff",
              marginBottom: 8, transition: "all 0.4s", opacity: i > processIdx + 1 ? 0.4 : 1,
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, backgroundColor: "#fafafa" }}>{item.e}</div>
              <div style={{ flex: 1 }}>
                {i < processIdx ? (
                  <>
                    <p style={{ fontSize: 13, fontWeight: 700, color: C.gDark, fontFamily: F.b }}>{item.t}</p>
                    <p style={{ fontSize: 11, color: "#999", fontFamily: F.b }}>{item.cat} • {item.cond} • ${item.price}</p>
                  </>
                ) : i === processIdx ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Sparkles size={14} style={{ color: C.ai }} className="animate-spin" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.ai, fontFamily: F.b }}>Identifying item...</span>
                  </div>
                ) : (
                  <span style={{ fontSize: 13, color: "#ccc", fontFamily: F.b }}>Waiting...</span>
                )}
              </div>
              {i < processIdx && <CheckCircle size={20} style={{ color: C.gPrimary }} />}
            </div>
          ))}
        </div>
      )}

      {/* REVIEW */}
      {phase === "review" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, borderRadius: 12, backgroundColor: C.gLightBg, marginBottom: 16 }}>
            <Sparkles size={14} style={{ color: C.gPrimary }} />
            <p style={{ fontSize: 12, color: C.gDark, fontFamily: F.b }}>
              <b>{items.length} listings created.</b> Review each one — click Edit to adjust, or Approve All below.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {items.map(item => (
              <div key={item.id} style={{ borderRadius: 16, border: "1px solid #f0f0f0", overflow: "hidden", backgroundColor: "#fff" }}>
                <div style={{ display: "flex", gap: 12, padding: 14 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 12, border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, backgroundColor: "#fafafa", flexShrink: 0 }}>{item.e}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: C.gDark, fontFamily: F.b, lineHeight: 1.3 }}>{item.t}</p>
                    <p style={{ fontSize: 10, color: "#999", marginTop: 4, lineHeight: 1.5, fontFamily: F.b, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.d}</p>
                    <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                      <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 20, backgroundColor: C.gLightBg, color: C.gPrimary }}>{item.cat}</span>
                      <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 20, backgroundColor: "#f3f4f6", color: "#777" }}>{item.cond}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", borderTop: "1px solid #f5f5f5", backgroundColor: "#fafafa" }}>
                  <div><span style={{ fontSize: 10, color: "#999" }}>AI price: </span><span style={{ fontSize: 17, fontWeight: 900, color: C.gPrimary, fontFamily: F.h }}>${item.price}</span></div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid #e5e7eb", backgroundColor: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", color: "#777", fontFamily: F.b }}>Edit</button>
                    <button style={{ padding: "5px 12px", borderRadius: 8, border: "none", backgroundColor: C.gPrimary, fontSize: 11, fontWeight: 600, cursor: "pointer", color: "#fff", fontFamily: F.b }}>✓ Approve</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Destination + CTA */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, borderRadius: 14, border: "1px solid #f0f0f0", backgroundColor: "#fff" }}>
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#777", fontFamily: F.b, alignSelf: "center" }}>List to:</span>
              {[
                { id: "drop", l: "Saturday's Drop", d: "Goes live Sat 8am", active: true, c: C.gPrimary },
                { id: "shelf", l: "The Shelf", d: "Available now", active: false, c: C.oPrimary },
              ].map(d => (
                <button key={d.id} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10,
                  border: `2px solid ${d.active ? d.c : "#e5e7eb"}`,
                  backgroundColor: d.active ? (d.id === "drop" ? C.gLightBg : C.oLightBg) : "#fff",
                  cursor: "pointer",
                }}>
                  <span style={{ fontSize: 14 }}>{d.id === "drop" ? "🎯" : "📚"}</span>
                  <div style={{ textAlign: "left" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: C.gDark, fontFamily: F.b }}>{d.l}</p>
                    <p style={{ fontSize: 9, color: "#999", fontFamily: F.b }}>{d.d}</p>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={onComplete}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 14, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, background: `linear-gradient(135deg, ${C.gPrimary}, ${C.gHover})`, color: "#fff", boxShadow: `0 6px 20px ${C.gPrimary}30`, fontFamily: F.b }}>
              Approve All & List {items.length} Items <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══ AI DASHBOARD (ongoing management) ═══ */
function AIDashboardContent({ onNewListing }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 50, backgroundColor: C.aiLight, border: `1px solid ${C.aiBorder}` }}>
            <Sparkles size={12} style={{ color: C.ai }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: C.ai, fontFamily: F.b }}>AI Agent Active</span>
          </div>
          <span style={{ fontSize: 11, color: "#999", fontFamily: F.b }}>Managing 20 items across Drop & Shelf</span>
        </div>
        <button onClick={onNewListing}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, background: `linear-gradient(135deg, ${C.ai}, #6D28D9)`, color: "#fff", fontFamily: F.b }}>
          <Camera size={15} /> Add More Items
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { v: "15", l: "In Drop", c: C.gPrimary, bg: C.gLightBg, icon: Tag },
          { v: "5", l: "On Shelf", c: C.oPrimary, bg: C.oLightBg, icon: Package },
          { v: "$285", l: "Sold (AI)", c: C.ai, bg: C.aiLight, icon: DollarSign },
          { v: "3", l: "Pickups Today", c: C.tPrimary, bg: C.tLight, icon: MapPinned },
        ].map((s, i) => (
          <div key={i} style={{ padding: 16, borderRadius: 14, border: "1px solid #f0f0f0", background: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <s.icon size={18} style={{ color: s.c }} />
            </div>
            <div>
              <p style={{ fontSize: 22, fontWeight: 900, color: s.c, fontFamily: F.h }}>{s.v}</p>
              <p style={{ fontSize: 11, color: "#999", fontFamily: F.b }}>{s.l}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Activity feed */}
        <div style={{ padding: 20, borderRadius: 16, border: "1px solid #f0f0f0", background: "#fff" }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: C.gDark, marginBottom: 14, fontFamily: F.h }}>AI Activity Feed</h3>
          {[
            { t: "Claim accepted", d: "IKEA Bookshelf — Sarah M. claimed at $35 (full price). Pickup Sat 2pm.", c: C.gPrimary, bg: C.gLightBg, time: "2 min ago", e: "✅" },
            { t: "Counter-offer sent", d: "Coffee Maker — buyer offered $15. AI countered at $20. Waiting.", c: C.oPrimary, bg: C.oLightBg, time: "18 min ago", e: "🤝" },
            { t: "Price drop suggested", d: "Samsung Tablet on Shelf 10 days. Suggest $80 → $65?", c: C.ai, bg: C.aiLight, time: "1 hr ago", e: "📉" },
            { t: "Lowball declined", d: "Drill Set — $10 offer auto-declined. Your floor: $52.", c: "#DC2626", bg: "#FEF2F2", time: "3 hrs ago", e: "🚫" },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 10, borderRadius: 12, marginBottom: 6, backgroundColor: i === 0 ? a.bg : "#fff", border: `1px solid ${i === 0 ? a.c + "20" : "#f5f5f5"}` }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: a.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{a.e}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: a.c, fontFamily: F.b }}>{a.t}</span>
                  <span style={{ fontSize: 9, color: "#ccc", fontFamily: F.b }}>{a.time}</span>
                </div>
                <p style={{ fontSize: 11, color: "#777", lineHeight: 1.5, marginTop: 2, fontFamily: F.b }}>{a.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp log */}
        <div style={{ padding: 20, borderRadius: 16, border: "1px solid #f0f0f0", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: C.wa, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MessageCircle size={14} style={{ color: "#fff" }} />
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: C.gDark, fontFamily: F.h }}>Your WhatsApp Notifications</h3>
          </div>
          {[
            { msg: "Your IKEA Bookshelf was claimed at $35! Pickup Saturday 2pm.", time: "2 min ago" },
            { msg: "Coffee Maker — buyer offered $15. AI countered at $20 (your floor). No action needed.", time: "18 min ago" },
            { msg: "Reminder: 3 pickups scheduled for tomorrow. Details below.", time: "Yesterday" },
            { msg: "Drop summary: 8 of 15 items sold! Total: $195. 7 items moved to the Shelf.", time: "Last Sunday" },
          ].map((n, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: 10, borderRadius: 10, marginBottom: 4, backgroundColor: i === 0 ? "#F0FFF4" : "#fff", border: `1px solid ${i === 0 ? C.wa + "20" : "#f5f5f5"}` }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: i === 0 ? C.wa : "#e5e7eb", flexShrink: 0, marginTop: 6 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, color: C.gDark, lineHeight: 1.5, fontFamily: F.b }}>{n.msg}</p>
                <p style={{ fontSize: 9, color: "#ccc", marginTop: 2, fontFamily: F.b }}>{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ MAIN APP ═══ */
export default function DropYardSellerDashboard() {
  const [view, setView] = useState("overview");
  const [aiSetupDone, setAiSetupDone] = useState(false);

  const handleStartAI = () => setView(aiSetupDone ? "ai-dashboard" : "ai-setup");

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#F7F7F5", fontFamily: F.b }}>
        <TopNav />
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <Sidebar activeView={view} onNavigate={setView} aiActive={aiSetupDone} />
          <main style={{ flex: 1, overflow: "auto", padding: 24 }}>
            {view === "overview" && <OverviewContent onStartAI={handleStartAI} />}
            {view === "ai-setup" && <AISetupContent onComplete={() => { setAiSetupDone(true); setView("ai-photos"); }} />}
            {view === "ai-photos" && <AIPhotoListingContent onComplete={() => setView("ai-dashboard")} onBack={() => setView("ai-dashboard")} />}
            {view === "ai-dashboard" && <AIDashboardContent onNewListing={() => setView("ai-photos")} />}
            {!["overview", "ai-setup", "ai-photos", "ai-dashboard"].includes(view) && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#ccc", fontSize: 16, fontFamily: F.b }}>
                {view.charAt(0).toUpperCase() + view.slice(1).replace("-", " ")} — Coming soon
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
