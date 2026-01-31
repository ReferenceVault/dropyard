"use client";

import React, { useState } from "react";
import {
  Users,
  Clock,
  Recycle,
  Package,
  MapPin,
  Calendar,
  ShoppingBag,
  ChevronRight,
  Check,
  Menu,
  X,
  ArrowRight,
  Truck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  CheckCircle,
  ChevronLeft,
  Sparkles,
  HelpCircle,
  FileText,
} from "lucide-react";

// ============================================================================
// CUSTOM LOGO COMPONENT
// ============================================================================
function DropYardLogo({ size = "default" }: { size?: "small" | "default" | "large" }) {
  const sizes = {
    small: { container: "w-8 h-8" },
    default: { container: "w-10 h-10" },
    large: { container: "w-14 h-14" },
  };
  const s = sizes[size] || sizes.default;

  return (
    <div className={`${s.container} relative flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M20 60 L50 85 L80 60 L80 75 Q50 95 20 75 Z" fill="#F59E0B" />
        <path
          d="M30 70 L45 82 L70 58"
          stroke="white"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M50 10 L15 40 L15 35 L50 5 L85 35 L85 40 L50 10" fill="#059669" />
        <path d="M20 38 L50 12 L80 38 L80 65 L20 65 Z" fill="white" stroke="#059669" strokeWidth="4" />
        <rect x="40" y="30" width="20" height="20" fill="#059669" rx="2" />
        <line x1="50" y1="30" x2="50" y2="50" stroke="white" strokeWidth="2" />
        <line x1="40" y1="40" x2="60" y2="40" stroke="white" strokeWidth="2" />
      </svg>
    </div>
  );
}

function DropYardWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-bold ${className}`}>
      <span className="text-emerald-600">Drop</span>
      <span className="text-amber-500">Yard</span>
    </span>
  );
}

// ============================================================================
// OTTAWA POSTAL CODE ZONES - AUTO DETECTION
// ============================================================================
const POSTAL_ZONES: Record<
  string,
  { name: string; drops: number; items: number; distance: string }
> = {
  K1A: { name: "Downtown Ottawa", drops: 5, items: 312, distance: "1 km" },
  K1B: { name: "Blackburn Hamlet", drops: 2, items: 87, distance: "12 km" },
  K1C: { name: "Orleans South", drops: 3, items: 124, distance: "14 km" },
  K1E: { name: "Orleans Central", drops: 3, items: 156, distance: "15 km" },
  K1G: { name: "Alta Vista", drops: 2, items: 98, distance: "6 km" },
  K1H: { name: "Ottawa South", drops: 3, items: 145, distance: "5 km" },
  K1K: { name: "Vanier", drops: 2, items: 76, distance: "4 km" },
  K1N: { name: "Sandy Hill", drops: 2, items: 89, distance: "2 km" },
  K1S: { name: "Old Ottawa South", drops: 3, items: 134, distance: "4 km" },
  K1T: { name: "Hunt Club", drops: 4, items: 187, distance: "10 km" },
  K1V: { name: "South Keys", drops: 3, items: 156, distance: "11 km" },
  K1Z: { name: "Westboro", drops: 4, items: 198, distance: "5 km" },
  K2A: { name: "Carlingwood", drops: 2, items: 87, distance: "7 km" },
  K2B: { name: "Bayshore", drops: 2, items: 76, distance: "9 km" },
  K2C: { name: "Baseline", drops: 3, items: 112, distance: "8 km" },
  K2E: { name: "Merivale", drops: 3, items: 134, distance: "9 km" },
  K2G: { name: "Nepean", drops: 4, items: 176, distance: "10 km" },
  K2H: { name: "Bells Corners", drops: 3, items: 145, distance: "12 km" },
  K2J: { name: "Barrhaven West", drops: 4, items: 203, distance: "15 km" },
  K2K: { name: "Kanata North", drops: 3, items: 156, distance: "18 km" },
  K2L: { name: "Kanata Central", drops: 3, items: 134, distance: "17 km" },
  K2M: { name: "Kanata South", drops: 2, items: 98, distance: "19 km" },
  K2P: { name: "Centretown", drops: 4, items: 187, distance: "1 km" },
  K2S: { name: "Stittsville", drops: 2, items: 87, distance: "21 km" },
  K2T: { name: "Barrhaven East", drops: 3, items: 156, distance: "14 km" },
  K2V: { name: "Kanata Lakes", drops: 3, items: 143, distance: "20 km" },
};

const detectZone = (pc: string) => {
  if (!pc || pc.length < 3) return null;
  const prefix = pc.substring(0, 3).toUpperCase();
  return POSTAL_ZONES[prefix] || {
    name: "Ottawa Area",
    drops: 3,
    items: 150,
    distance: "10 km",
  };
};

// ============================================================================
// MAIN APP
// ============================================================================
export default function DropYardWebsite() {
  const [view, setView] = useState("website");
  const [page, setPage] = useState("home");
  const [authMode, setAuthMode] = useState("signup");
  const [userType, setUserType] = useState("buyer");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    postalCode: "",
    neighborhood: "",
    zone: null as null | { name: string; drops: number; items: number; distance: string },
    interests: [] as string[],
  });

  const goWebsite = (p = "home") => {
    setView("website");
    setPage(p);
  };
  const goBuyerAuth = (mode = "signup") => {
    setView("auth");
    setAuthMode(mode);
    setUserType("buyer");
  };
  const goSellerAuth = (mode = "signup") => {
    setView("auth");
    setAuthMode(mode);
    setUserType("seller");
  };
  const goMovingAuth = (mode = "signup") => {
    setView("auth");
    setAuthMode(mode);
    setUserType("moving");
  };
  const goSuccess = () => setView("success");

  if (view === "website") {
    return (
      <Website
        page={page}
        setPage={setPage}
        goBuyerAuth={goBuyerAuth}
        goSellerAuth={goSellerAuth}
        goMovingAuth={goMovingAuth}
      />
    );
  }

  if (view === "auth") {
    return (
      <AuthFlow
        userType={userType}
        authMode={authMode}
        onComplete={goSuccess}
        onBack={() => goWebsite(userType === "buyer" ? "buyers" : "sellers")}
        userData={userData}
        setUserData={setUserData}
      />
    );
  }

  if (view === "success") {
    return (
      <SuccessScreen userType={userType} userData={userData} onContinue={() => goWebsite("home")} />
    );
  }

  return null;
}

// ============================================================================
// WEBSITE SHELL
// ============================================================================
function Website({
  page,
  setPage,
  goBuyerAuth,
  goSellerAuth,
  goMovingAuth,
}: {
  page: string;
  setPage: (p: string) => void;
  goBuyerAuth: (mode?: string) => void;
  goSellerAuth: (mode?: string) => void;
  goMovingAuth: (mode?: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setPage("home")} className="flex items-center gap-2">
            <DropYardLogo size="default" />
            <DropYardWordmark className="text-xl" />
          </button>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setPage("howitworks")}
              className={`text-sm font-medium transition-colors ${
                page === "howitworks"
                  ? "text-emerald-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              How it works
            </button>
            <button
              onClick={() => setPage("buyers")}
              className={`text-sm font-medium transition-colors ${
                page === "buyers" ? "text-emerald-700" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              For Buyers
            </button>
            <button
              onClick={() => setPage("sellers")}
              className={`text-sm font-medium transition-colors ${
                page === "sellers" ? "text-emerald-700" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              For Sellers
            </button>
            <button onClick={() => goBuyerAuth("login")} className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Log in
            </button>
            <button
              onClick={() => goBuyerAuth("signup")}
              className="bg-emerald-700 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-emerald-800 transition-colors"
            >
              Join the Next Drop
            </button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg" aria-label="Toggle navigation">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t p-4 space-y-2">
            <button onClick={() => { setPage("howitworks"); setMenuOpen(false); }} className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-50 font-medium">
              How it works
            </button>
            <button onClick={() => { setPage("buyers"); setMenuOpen(false); }} className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-50 font-medium">
              For Buyers
            </button>
            <button onClick={() => { setPage("sellers"); setMenuOpen(false); }} className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-50 font-medium">
              For Sellers
            </button>
            <div className="pt-2 border-t mt-2 space-y-2">
              <button onClick={() => goBuyerAuth("login")} className="w-full border-2 border-emerald-700 text-emerald-700 py-3 rounded-full font-semibold">
                Log in
              </button>
              <button onClick={() => goBuyerAuth("signup")} className="w-full bg-emerald-700 text-white py-3 rounded-full font-semibold">
                Join the Next Drop
              </button>
            </div>
          </div>
        )}
      </nav>

      {page === "home" && (
        <HomePage setPage={setPage} goBuyerAuth={goBuyerAuth} goSellerAuth={goSellerAuth} goMovingAuth={goMovingAuth} />
      )}
      {page === "buyers" && (
        <BuyersPage goBuyerAuth={goBuyerAuth} goSellerAuth={goSellerAuth} goMovingAuth={goMovingAuth} setPage={setPage} />
      )}
      {page === "sellers" && (
        <SellersPage goBuyerAuth={goBuyerAuth} goSellerAuth={goSellerAuth} goMovingAuth={goMovingAuth} setPage={setPage} />
      )}
      {page === "howitworks" && (
        <HowItWorksPage goBuyerAuth={goBuyerAuth} goSellerAuth={goSellerAuth} setPage={setPage} />
      )}
    </div>
  );
}

// ============================================================================
// HOW IT WORKS ILLUSTRATIONS
// ============================================================================
function HowItWorksIllustration({ step }: { step: number }) {
  if (step === 1) {
    return (
      <svg viewBox="0 0 300 200" className="w-full h-48">
        <ellipse cx="50" cy="180" rx="60" ry="20" fill="#E8F5E9" />
        <ellipse cx="250" cy="180" rx="60" ry="20" fill="#FFF3E0" />
        <g transform="translate(30, 120)">
          <path d="M25 0 L0 20 L0 50 L50 50 L50 20 Z" fill="#059669" />
          <rect x="5" y="25" width="40" height="25" fill="white" stroke="#059669" strokeWidth="2" />
          <rect x="15" y="32" width="8" height="8" fill="#059669" />
          <rect x="27" y="32" width="8" height="8" fill="#059669" />
        </g>
        <g transform="translate(220, 120)">
          <path d="M25 0 L0 20 L0 50 L50 50 L50 20 Z" fill="#F59E0B" />
          <rect x="5" y="25" width="40" height="25" fill="white" stroke="#F59E0B" strokeWidth="2" />
          <rect x="15" y="32" width="8" height="8" fill="#F59E0B" />
          <rect x="27" y="32" width="8" height="8" fill="#F59E0B" />
        </g>
        <path d="M80 160 Q150 140 220 160" stroke="#059669" strokeWidth="2" strokeDasharray="4 4" fill="none" />
        <path d="M80 165 Q150 145 220 165" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 4" fill="none" />
        <g transform="translate(115, 50)">
          <rect x="0" y="0" width="70" height="55" rx="4" fill="#E8F5E9" stroke="#059669" strokeWidth="3" />
          <rect x="25" y="55" width="20" height="10" fill="#059669" />
          <rect x="15" y="65" width="40" height="5" rx="2" fill="#059669" />
          <rect x="22" y="18" width="26" height="22" fill="#D4A574" stroke="#8B6914" strokeWidth="2" />
          <line x1="22" y1="25" x2="48" y2="25" stroke="#8B6914" strokeWidth="1" />
        </g>
        <g transform="translate(150, 15)">
          <path d="M0 25 L0 8 L-10 8 L0 -5 L10 8 L0 8" fill="#059669" />
        </g>
        <circle cx="100" cy="80" r="3" fill="#A7F3D0" />
        <circle cx="200" cy="70" r="2" fill="#FDE68A" />
        <circle cx="90" cy="100" r="2" fill="#A7F3D0" />
      </svg>
    );
  }

  if (step === 2) {
    return (
      <svg viewBox="0 0 300 200" className="w-full h-48">
        <ellipse cx="50" cy="180" rx="60" ry="20" fill="#E8F5E9" />
        <ellipse cx="250" cy="180" rx="60" ry="20" fill="#FFF3E0" />
        <g transform="translate(30, 120)">
          <path d="M25 0 L0 20 L0 50 L50 50 L50 20 Z" fill="#059669" />
          <rect x="5" y="25" width="40" height="25" fill="white" stroke="#059669" strokeWidth="2" />
          <rect x="15" y="32" width="8" height="8" fill="#059669" />
          <rect x="27" y="32" width="8" height="8" fill="#059669" />
        </g>
        <g transform="translate(220, 120)">
          <path d="M25 0 L0 20 L0 50 L50 50 L50 20 Z" fill="#F59E0B" />
          <rect x="5" y="25" width="40" height="25" fill="white" stroke="#F59E0B" strokeWidth="2" />
          <rect x="15" y="32" width="8" height="8" fill="#F59E0B" />
          <rect x="27" y="32" width="8" height="8" fill="#F59E0B" />
        </g>
        <path d="M80 160 Q150 140 220 160" stroke="#059669" strokeWidth="2" strokeDasharray="4 4" fill="none" />
        <path d="M80 165 Q150 145 220 165" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 4" fill="none" />
        <g transform="translate(100, 40)">
          <rect x="0" y="10" width="50" height="50" rx="4" fill="#E8F5E9" stroke="#059669" strokeWidth="2" />
          <rect x="0" y="10" width="50" height="12" rx="4" fill="#059669" />
          <circle cx="12" cy="10" r="4" fill="#059669" />
          <circle cx="38" cy="10" r="4" fill="#059669" />
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={8 + col * 14}
                y={28 + row * 10}
                width="8"
                height="6"
                fill={row === 1 && col === 1 ? "#F59E0B" : "#059669"}
                rx="1"
              />
            ))
          )}
        </g>
        <circle cx="150" cy="75" r="12" fill="white" stroke="#F59E0B" strokeWidth="2" />
        <line x1="150" y1="75" x2="150" y2="68" stroke="#F59E0B" strokeWidth="2" />
        <line x1="150" y1="75" x2="155" y2="75" stroke="#F59E0B" strokeWidth="2" />
        <g transform="translate(160, 35)">
          <rect x="0" y="0" width="35" height="6" fill="#8B6914" rx="2" />
          <rect x="0" y="60" width="35" height="6" fill="#8B6914" rx="2" />
          <path d="M5 6 L5 25 L17.5 33 L30 25 L30 6 Z" fill="#FDE68A" stroke="#D4A574" strokeWidth="1" />
          <path d="M5 60 L5 41 L17.5 33 L30 41 L30 60 Z" fill="#F59E0B" stroke="#D4A574" strokeWidth="1" />
          <path d="M10 50 L17.5 40 L25 50 Z" fill="#FDE68A" />
        </g>
        <circle cx="90" cy="90" r="3" fill="#A7F3D0" />
        <circle cx="210" cy="60" r="2" fill="#FDE68A" />
      </svg>
    );
  }

  if (step === 3) {
    return (
      <svg viewBox="0 0 300 200" className="w-full h-48">
        <ellipse cx="50" cy="180" rx="60" ry="20" fill="#E8F5E9" />
        <ellipse cx="250" cy="180" rx="60" ry="20" fill="#FFF3E0" />
        <g transform="translate(30, 120)">
          <path d="M25 0 L0 20 L0 50 L50 50 L50 20 Z" fill="#059669" />
          <rect x="5" y="25" width="40" height="25" fill="white" stroke="#059669" strokeWidth="2" />
          <rect x="15" y="32" width="8" height="8" fill="#059669" />
          <rect x="27" y="32" width="8" height="8" fill="#059669" />
        </g>
        <g transform="translate(220, 120)">
          <path d="M25 0 L0 20 L0 50 L50 50 L50 20 Z" fill="#F59E0B" />
          <rect x="5" y="25" width="40" height="25" fill="white" stroke="#F59E0B" strokeWidth="2" />
          <rect x="15" y="32" width="8" height="8" fill="#F59E0B" />
          <rect x="27" y="32" width="8" height="8" fill="#F59E0B" />
        </g>
        <g transform="translate(200, 95)">
          <rect x="0" y="0" width="55" height="20" rx="3" fill="#F59E0B" transform="rotate(-15)" />
          <text x="8" y="14" fill="white" fontSize="8" fontWeight="bold" transform="rotate(-15)">
            CLAIMED
          </text>
        </g>
        <path d="M80 160 Q150 140 220 160" stroke="#059669" strokeWidth="2" strokeDasharray="4 4" fill="none" />
        <path d="M80 165 Q150 145 220 165" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 4" fill="none" />
        <g transform="translate(100, 45)">
          <circle cx="20" cy="15" r="15" fill="#D4A574" />
          <path d="M5 20 Q20 30 35 20" fill="#8B6914" />
          <ellipse cx="20" cy="50" rx="18" ry="25" fill="#60A5FA" />
        </g>
        <g transform="translate(130, 40)">
          <circle cx="20" cy="15" r="15" fill="#8B6914" />
          <path d="M5 15 Q20 25 35 15 Q35 5 20 5 Q5 5 5 15" fill="#4A3728" />
          <ellipse cx="20" cy="50" rx="18" ry="25" fill="#3B82F6" />
        </g>
        <g transform="translate(160, 45)">
          <circle cx="20" cy="15" r="15" fill="#D4A574" />
          <path d="M5 10 Q20 5 35 10 L35 25 Q20 20 5 25 Z" fill="#4A3728" />
          <ellipse cx="20" cy="50" rx="18" ry="25" fill="#FBBF24" />
        </g>
        <g transform="translate(125, 85)">
          <rect x="0" y="0" width="50" height="30" rx="3" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
          <rect x="5" y="5" width="40" height="20" fill="#F3F4F6" />
          <rect x="18" y="8" width="14" height="12" fill="#D4A574" stroke="#8B6914" strokeWidth="1" />
        </g>
        <circle cx="95" cy="100" r="3" fill="#A7F3D0" />
        <circle cx="205" cy="70" r="2" fill="#FDE68A" />
      </svg>
    );
  }

  if (step === 4) {
    return (
      <svg viewBox="0 0 300 200" className="w-full h-48">
        <ellipse cx="70" cy="170" rx="80" ry="25" fill="#E8F5E9" />
        <ellipse cx="230" cy="170" rx="80" ry="25" fill="#FFF3E0" />
        <g transform="translate(50, 90)">
          <path d="M35 0 L0 28 L0 70 L70 70 L70 28 Z" fill="#059669" />
          <rect x="7" y="35" width="56" height="35" fill="white" stroke="#059669" strokeWidth="2" />
          <rect x="15" y="42" width="12" height="12" fill="#059669" />
          <line x1="21" y1="42" x2="21" y2="54" stroke="white" strokeWidth="1" />
          <line x1="15" y1="48" x2="27" y2="48" stroke="white" strokeWidth="1" />
          <rect x="43" y="42" width="12" height="12" fill="#059669" />
          <line x1="49" y1="42" x2="49" y2="54" stroke="white" strokeWidth="1" />
          <line x1="43" y1="48" x2="55" y2="48" stroke="white" strokeWidth="1" />
        </g>
        <g transform="translate(180, 90)">
          <path d="M35 0 L0 28 L0 70 L70 70 L70 28 Z" fill="#F59E0B" />
          <rect x="7" y="35" width="56" height="35" fill="white" stroke="#F59E0B" strokeWidth="2" />
          <rect x="15" y="42" width="12" height="12" fill="#F59E0B" />
          <line x1="21" y1="42" x2="21" y2="54" stroke="white" strokeWidth="1" />
          <line x1="15" y1="48" x2="27" y2="48" stroke="white" strokeWidth="1" />
          <rect x="43" y="42" width="12" height="12" fill="#F59E0B" />
          <line x1="49" y1="42" x2="49" y2="54" stroke="white" strokeWidth="1" />
          <line x1="43" y1="48" x2="55" y2="48" stroke="white" strokeWidth="1" />
        </g>
        <path d="M120 155 Q150 135 180 155" stroke="#059669" strokeWidth="3" strokeDasharray="6 4" fill="none" />
        <path d="M120 160 Q150 140 180 160" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 4" fill="none" />
        <g transform="translate(135, 50)">
          <path d="M15 0 C6.7 0 0 6.7 0 15 C0 26.25 15 40 15 40 C15 40 30 26.25 30 15 C30 6.7 23.3 0 15 0 Z" fill="#F59E0B" />
          <circle cx="15" cy="14" r="6" fill="white" />
        </g>
        <circle cx="45" cy="130" r="4" fill="#A7F3D0" />
        <circle cx="255" cy="130" r="4" fill="#FDE68A" />
        <circle cx="150" cy="100" r="3" fill="#A7F3D0" />
      </svg>
    );
  }

  return null;
}

// ============================================================================
// PAGE SECTIONS (to be filled)
// ============================================================================
function HomePage({
  setPage,
  goBuyerAuth,
  goSellerAuth,
  goMovingAuth,
}: {
  setPage: (p: string) => void;
  goBuyerAuth: (mode?: string) => void;
  goSellerAuth: (mode?: string) => void;
  goMovingAuth: (mode?: string) => void;
}) {
  return (
    <div>
      <section className="min-h-screen flex items-center bg-gradient-to-br from-amber-50 via-white to-emerald-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Now live in your neighborhood
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your community&apos;s
                <span className="block text-emerald-700">yard sale—online.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Buy and sell locally through curated weekend Drops.
                <span className="block text-emerald-700 font-medium mt-2">From one home to another.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => goBuyerAuth("signup")}
                  className="bg-emerald-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:bg-emerald-800 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  Join the Next Drop
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => goSellerAuth("signup")}
                  className="border-2 border-emerald-700 text-emerald-700 px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                >
                  Sell with DropYard
                  <ChevronRight size={18} />
                </button>
              </div>
              <p className="mt-6 text-sm text-gray-500">
                Already have an account?
                <button onClick={() => goBuyerAuth("login")} className="text-emerald-700 font-medium ml-1 hover:underline">
                  Log in
                </button>
              </p>
            </div>

            <div className="hidden lg:block">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { emoji: "🏠", label: "Home & Kitchen", count: "12 items" },
                    { emoji: "👶", label: "Kids & Baby", count: "8 items" },
                    { emoji: "📱", label: "Electronics", count: "5 items" },
                    { emoji: "🛋️", label: "Furniture", count: "3 items" },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-2xl p-4 hover:bg-emerald-50 transition-colors cursor-pointer">
                      <div className="text-3xl mb-2">{item.emoji}</div>
                      <div className="font-medium text-gray-900 text-sm">{item.label}</div>
                      <div className="text-xs text-emerald-600">{item.count}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-amber-100 to-amber-50 rounded-2xl border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-amber-600 font-medium">NEXT DROP</div>
                      <div className="font-semibold text-gray-900">This Weekend</div>
                    </div>
                    <div className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium">28 items</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-emerald-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-4 md:gap-12">
          {[
            { icon: MapPin, text: "Local pickup only" },
            { icon: Users, text: "Real neighbors" },
            { icon: Clock, text: "Time-limited Drops" },
            { icon: Recycle, text: "Reuse, not waste" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <item.icon size={16} className="text-amber-400" />
              <span className="text-emerald-100">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for communities, <span className="text-emerald-700">not crowds.</span>
            </h2>
            <p className="text-lg text-gray-700 mb-2">
              DropYard brings back the simplicity of yard sales—without the hassle.
            </p>
            <p className="text-gray-600 text-sm md:text-base">
              Every Drop connects neighbors, keeps value local, and gives everyday items a second life. We believe
              communities thrive when value stays local.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex flex-row items-center justify-around gap-4 md:gap-8 overflow-x-auto">
              <div className="text-center flex-shrink-0 min-w-[100px]">
                <div className="text-2xl md:text-4xl font-bold text-emerald-700 mb-1">500+</div>
                <div className="text-gray-600 font-medium text-xs md:text-sm mb-2 md:mb-3">Items rehomed</div>
                <svg viewBox="0 0 120 80" className="w-16 md:w-24 h-12 md:h-16 mx-auto">
                  <ellipse cx="60" cy="75" rx="50" ry="5" fill="#E8F5E9" />
                  <ellipse cx="25" cy="65" rx="5" ry="10" fill="#A7F3D0" transform="rotate(-15 25 65)" />
                  <ellipse cx="32" cy="62" rx="4" ry="8" fill="#6EE7B7" transform="rotate(10 32 62)" />
                  <path d="M60 20 L35 40 L35 70 L85 70 L85 40 Z" fill="#059669" />
                  <rect x="42" y="45" width="36" height="25" fill="white" stroke="#059669" strokeWidth="1.5" />
                  <rect x="48" y="50" width="10" height="10" fill="#059669" />
                  <rect x="62" y="50" width="10" height="10" fill="#059669" />
                  <rect x="50" y="58" width="20" height="15" fill="#D4A574" stroke="#8B6914" strokeWidth="1" rx="1" />
                  <ellipse cx="92" cy="65" rx="5" ry="10" fill="#A7F3D0" transform="rotate(15 92 65)" />
                </svg>
              </div>

              <div className="w-px h-16 md:h-24 bg-gray-200 flex-shrink-0"></div>

              <div className="text-center flex-shrink-0 min-w-[100px]">
                <div className="text-2xl md:text-4xl font-bold text-amber-500 mb-1">50+</div>
                <div className="text-gray-600 font-medium text-xs md:text-sm mb-2 md:mb-3">Neighborhoods</div>
                <svg viewBox="0 0 120 80" className="w-16 md:w-24 h-12 md:h-16 mx-auto">
                  <ellipse cx="60" cy="75" rx="50" ry="5" fill="#FEF3C7" />
                  <g transform="translate(10, 50)">
                    <path d="M12 0 L0 10 L0 25 L24 25 L24 10 Z" fill="#059669" />
                    <rect x="3" y="12" width="18" height="13" fill="white" stroke="#059669" strokeWidth="1" />
                  </g>
                  <g transform="translate(35, 30)">
                    <rect x="0" y="0" width="50" height="35" rx="3" fill="#E8F5E9" stroke="#059669" strokeWidth="1.5" />
                    <line x1="0" y1="12" x2="50" y2="12" stroke="#A7F3D0" strokeWidth="0.5" />
                    <line x1="0" y1="24" x2="50" y2="24" stroke="#A7F3D0" strokeWidth="0.5" />
                    <line x1="17" y1="0" x2="17" y2="35" stroke="#A7F3D0" strokeWidth="0.5" />
                    <line x1="34" y1="0" x2="34" y2="35" stroke="#A7F3D0" strokeWidth="0.5" />
                  </g>
                  <g transform="translate(65, 20)">
                    <path d="M10 0 C4.5 0 0 4.5 0 10 C0 17.5 10 27 10 27 C10 27 20 17.5 20 10 C20 4.5 15.5 0 10 0 Z" fill="#F59E0B" />
                    <circle cx="10" cy="9" r="4" fill="white" />
                  </g>
                  <g transform="translate(86, 50)">
                    <path d="M12 0 L0 10 L0 25 L24 25 L24 10 Z" fill="#F59E0B" />
                    <rect x="3" y="12" width="18" height="13" fill="white" stroke="#F59E0B" strokeWidth="1" />
                  </g>
                </svg>
              </div>

              <div className="w-px h-16 md:h-24 bg-gray-200 flex-shrink-0"></div>

              <div className="text-center flex-shrink-0 min-w-[100px]">
                <div className="text-2xl md:text-4xl font-bold text-amber-500 mb-1">100%</div>
                <div className="text-gray-600 font-medium text-xs md:text-sm mb-2 md:mb-3">Local</div>
                <svg viewBox="0 0 120 80" className="w-16 md:w-24 h-12 md:h-16 mx-auto">
                  <ellipse cx="60" cy="40" rx="35" ry="25" fill="#FEF3C7" opacity="0.4" />
                  <ellipse cx="60" cy="75" rx="50" ry="5" fill="#E8F5E9" />
                  <g transform="translate(10, 45)">
                    <path d="M15 0 L0 12 L0 30 L30 30 L30 12 Z" fill="#059669" />
                    <rect x="4" y="14" width="22" height="16" fill="white" stroke="#059669" strokeWidth="1" />
                    <rect x="8" y="17" width="5" height="5" fill="#059669" />
                    <rect x="17" y="17" width="5" height="5" fill="#059669" />
                  </g>
                  <g transform="translate(45, 30)">
                    <path d="M8 18 Q20 8 32 12 L38 18 Q42 22 38 26 L26 34 Q18 38 10 34 L4 26 Q0 22 4 18 Z" fill="#D4A574" stroke="#8B6914" strokeWidth="1.5" />
                  </g>
                  <g transform="translate(80, 45)">
                    <path d="M15 0 L0 12 L0 30 L30 30 L30 12 Z" fill="#F59E0B" />
                    <rect x="4" y="14" width="22" height="16" fill="white" stroke="#F59E0B" strokeWidth="1" />
                    <rect x="8" y="17" width="5" height="5" fill="#F59E0B" />
                    <rect x="17" y="17" width="5" height="5" fill="#F59E0B" />
                  </g>
                  <path d="M40 72 Q60 62 80 72" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
                  <path d="M40 74 Q60 64 80 74" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Built for everyone</h2>
            <p className="text-lg text-gray-600">Whether you&apos;re buying or selling, DropYard has you covered</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-8 border border-emerald-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <ShoppingBag size={28} className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">For Buyers</h3>
              <ul className="space-y-4 mb-8">
                {[
                  "Shop locally from trusted neighbors",
                  "Fair, clear pricing—no haggling",
                  "No bidding wars",
                  "Simple, scheduled pickup times",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check size={20} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => goBuyerAuth("signup")}
                className="w-full bg-emerald-700 text-white py-4 rounded-full font-semibold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
              >
                Browse the Next Drop
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-white rounded-3xl p-8 border border-amber-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                <Package size={28} className="text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">For Sellers</h3>
              <ul className="space-y-4 mb-8">
                {[
                  "Declutter easily in one weekend",
                  "No endless messages or listings",
                  "Sell to neighbors, not strangers",
                  "Simple, fast payouts",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check size={20} className="text-amber-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => goSellerAuth("signup")}
                className="w-full bg-amber-500 text-white py-4 rounded-full font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
              >
                Become a Seller
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Two ways to Drop</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the Drop that fits your needs—from weekly neighborhood sales to dedicated moving events
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 relative">
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-6 h-full">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="border-r border-white/20"></div>
                    ))}
                  </div>
                  <div className="absolute inset-0 grid grid-rows-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="border-b border-white/20"></div>
                    ))}
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="bg-emerald-800/80 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>

                <div className="text-center relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Calendar size={24} className="text-white" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-1">Every</div>
                  <div className="text-emerald-200 text-lg">Weekend</div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Weekly Neighborhood Drop</h3>
                <p className="text-gray-600 text-sm mb-6">
                  The heart of DropYard. Your community&apos;s recurring yard sale, online. New items every weekend
                  from neighbors you trust.
                </p>

                <ul className="space-y-3 mb-6">
                  {[
                    { icon: Clock, text: "48-hour sale window (Sat-Sun)" },
                    { icon: MapPin, text: "Items from your neighborhood" },
                    { icon: Users, text: "5-50+ sellers per Drop" },
                    { icon: Package, text: "New inventory every week" },
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                      <feature.icon size={16} className="text-emerald-600 flex-shrink-0" />
                      {feature.text}
                    </li>
                  ))}
                </ul>

                <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                  <div className="text-center">
                    <div className="text-xs text-emerald-600 font-medium uppercase tracking-wide">For Sellers</div>
                    <div className="text-lg font-bold text-gray-900">Free to list</div>
                  </div>
                </div>

                <button
                  onClick={() => goSellerAuth("signup")}
                  className="w-full bg-emerald-700 text-white py-4 rounded-full font-semibold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
                >
                  Join This Week&apos;s Drop
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 relative">
                <div className="absolute top-4 right-4">
                  <span className="bg-orange-600/80 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Premium
                  </span>
                </div>

                <div className="text-center relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Truck size={24} className="text-white" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-1">Moving?</div>
                  <div className="text-orange-100 text-lg">We&apos;ve got you</div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Moving Sale Drop</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Relocating? Host your own dedicated Drop. Get featured placement, promotional support, and sell
                  everything before you go.
                </p>

                <ul className="space-y-3 mb-6">
                  {[
                    { icon: Sparkles, text: "Your own featured Drop event" },
                    { icon: Calendar, text: "You pick the weekend" },
                    { icon: Mail, text: "Promotional email to local buyers" },
                    { icon: Package, text: "Unlimited items, one flat fee" },
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                      <feature.icon size={16} className="text-amber-500 flex-shrink-0" />
                      {feature.text}
                    </li>
                  ))}
                </ul>

                <div className="bg-amber-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-amber-600 font-medium uppercase tracking-wide">Package</div>
                      <div className="text-lg font-bold text-gray-900">Flat fee</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-amber-600 font-medium uppercase tracking-wide">Starting at</div>
                      <div className="text-lg font-bold text-gray-900">$49</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => goMovingAuth("signup")}
                  className="w-full bg-amber-500 text-white py-4 rounded-full font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                >
                  Plan Your Moving Sale
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">How DropYard Works</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-2 items-start">
            {[1, 2, 3, 4].map((step) => (
              <div className="relative" key={`home-step-${step}`}>
                <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="absolute -top-3 left-6 bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    {step}
                  </div>
                  <div className="mb-4 mt-2">
                    <HowItWorksIllustration step={step} />
                  </div>
                  {step === 1 && (
                    <>
                      <h3 className="text-lg font-bold text-emerald-800 mb-2 text-center">Sellers submit items</h3>
                      <p className="text-gray-600 text-center text-sm">
                        Upload what you&apos;d like to sell or give away for free.
                      </p>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <h3 className="text-lg font-bold text-emerald-800 mb-2 text-center">We host the Drop</h3>
                      <p className="text-gray-600 text-center text-sm">Items go live for a limited time</p>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <h3 className="text-lg font-bold text-emerald-800 mb-2 text-center">Neighbors claim</h3>
                      <p className="text-gray-600 text-center text-sm">Buyers browse and reserve</p>
                    </>
                  )}
                  {step === 4 && (
                    <>
                      <h3 className="text-lg font-bold text-emerald-800 mb-2 text-center">Local pickup & payment</h3>
                      <p className="text-gray-600 text-center text-sm">Items move home to home</p>
                    </>
                  )}
                </div>
                {step < 4 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="bg-amber-500 rounded-full p-1">
                      <ChevronRight size={20} className="text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex lg:hidden justify-center mt-6 gap-2">
            {[1, 2, 3, 4].map((step, i) => (
              <div key={`home-step-indicator-${step}`} className="flex items-center">
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {step}
                </div>
                {i < 3 && <div className="w-8 h-0.5 bg-amber-500 mx-1"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Shop local deals
                <br />
                from real neighbors
              </h2>
              <div className="space-y-4">
                {[
                  { title: "Curated weekend drops", desc: "Fresh items every weekend, organized by neighborhood" },
                  { title: "Verified local sellers", desc: "Only real neighbors in your community" },
                  { title: "Easy claiming system", desc: "Reserve items instantly, pick up on your schedule" },
                  { title: "Safe local pickup", desc: "Meet at your neighbor's home during set windows" },
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={14} className="text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => goBuyerAuth("signup")}
                className="mt-8 bg-emerald-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-800 transition-colors flex items-center gap-2"
              >
                Start Browsing
                <ArrowRight size={18} />
              </button>
            </div>
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-green-700">Live Now</span>
                </div>
                <span className="text-sm text-gray-500">Kanata North</span>
              </div>
              <div className="space-y-3">
                {[
                  { title: "IKEA Kallax Shelf", price: "$45", original: "$120", emoji: "📦", discount: "-63%" },
                  { title: "Dyson V8 Vacuum", price: "$180", original: "$450", emoji: "🔌", discount: "-60%" },
                  { title: "Kids Balance Bike", price: "$35", original: "$90", emoji: "🚲", discount: "-61%" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                      {item.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-600">{item.price}</span>
                        <span className="text-xs text-gray-400 line-through">{item.original}</span>
                        <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">
                          {item.discount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 rounded-3xl overflow-hidden relative">
            <div className="absolute top-4 right-20 text-white/30 text-2xl">✦</div>
            <div className="absolute top-12 right-40 text-white/20 text-lg">✦</div>
            <div className="absolute bottom-20 right-32 text-white/25 text-xl">✦</div>
            <div className="absolute top-20 left-1/3 text-white/15 text-sm">✦</div>

            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1200 80" className="w-full h-12 text-amber-600/30">
                <path d="M0 40 Q300 80 600 40 T1200 40 V80 H0 Z" fill="currentColor" />
              </svg>
            </div>

            <div className="flex flex-col md:flex-row items-center p-8 md:p-10 lg:p-12 relative z-10">
              <div className="w-full md:w-1/2 lg:w-2/5 mb-6 md:mb-0 flex justify-center">
                <svg viewBox="0 0 350 220" className="w-full max-w-sm h-auto">
                  <circle cx="175" cy="110" r="90" fill="#FDE68A" opacity="0.3" />
                  <circle cx="175" cy="110" r="65" fill="#FEF3C7" opacity="0.4" />

                  <g transform="translate(30, 50)">
                    <rect x="18" y="0" width="10" height="120" fill="#6B7280" rx="3" />
                    <circle cx="12" cy="130" r="12" fill="#4B5563" stroke="#374151" strokeWidth="2" />
                    <circle cx="36" cy="130" r="12" fill="#4B5563" stroke="#374151" strokeWidth="2" />
                    <rect x="0" y="85" width="55" height="8" fill="#6B7280" rx="3" />
                  </g>

                  <g transform="translate(75, 45)">
                    <rect x="0" y="55" width="75" height="60" fill="#D4A574" stroke="#8B6914" strokeWidth="2" rx="4" />
                    <line x1="0" y1="70" x2="75" y2="70" stroke="#8B6914" strokeWidth="2" />
                    <path d="M30 70 L30 55 L45 55 L45 70" fill="none" stroke="#8B6914" strokeWidth="2" />
                    <rect x="12" y="15" width="55" height="45" fill="#E5C9A8" stroke="#8B6914" strokeWidth="2" rx="3" />
                    <line x1="12" y1="28" x2="67" y2="28" stroke="#8B6914" strokeWidth="1.5" />
                    <rect x="80" y="70" width="45" height="40" fill="#D4A574" stroke="#8B6914" strokeWidth="2" rx="3" />
                    <line x1="80" y1="80" x2="125" y2="80" stroke="#8B6914" strokeWidth="1.5" />
                  </g>

                  <g transform="translate(120, 15)">
                    <rect x="10" y="40" width="5" height="35" fill="#6B7280" />
                    <path d="M0 40 L12.5 5 L25 40 Z" fill="#059669" />
                    <ellipse cx="12.5" cy="40" rx="12" ry="3" fill="#047857" />
                  </g>

                  <g transform="translate(200, 95)">
                    <rect x="0" y="0" width="85" height="50" fill="#8B6914" rx="4" />
                    <rect x="4" y="4" width="77" height="42" fill="#D4A574" rx="3" />
                    <text x="42" y="22" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#8B6914">
                      MOVING
                    </text>
                    <text x="42" y="38" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#8B6914">
                      SALE
                    </text>
                    <rect x="35" y="50" width="14" height="35" fill="#8B6914" />
                  </g>

                  <circle cx="260" cy="170" r="18" fill="white" stroke="#374151" strokeWidth="2" />
                  <path d="M260 152 L253 165 L267 165 Z" fill="#374151" />
                  <path d="M245 175 L255 168 L255 182 Z" fill="#374151" />
                  <path d="M275 175 L265 168 L265 182 Z" fill="#374151" />

                  <g transform="translate(20, 145)">
                    <rect x="0" y="15" width="28" height="35" fill="#F59E0B" rx="3" />
                    <ellipse cx="14" cy="8" rx="16" ry="14" fill="#059669" />
                    <ellipse cx="8" cy="2" rx="8" ry="12" fill="#10B981" />
                    <ellipse cx="20" cy="4" rx="7" ry="10" fill="#34D399" />
                  </g>

                  <circle cx="310" cy="80" r="4" fill="white" opacity="0.5" />
                  <circle cx="55" cy="35" r="3" fill="white" opacity="0.4" />
                  <circle cx="290" cy="50" r="2" fill="white" opacity="0.3" />
                </svg>
              </div>

              <div className="w-full md:w-1/2 lg:w-3/5 text-center md:text-left md:pl-8 lg:pl-12">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-5 mx-auto md:mx-0">
                  <Truck size={28} className="text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">Planning a Moving Sale?</h3>
                <p className="text-white/90 text-lg mb-8 max-w-md">
                  Sell everything at once with our dedicated Moving Sale Drop.
                </p>
                <button
                  onClick={() => goMovingAuth("signup")}
                  className="bg-white/95 text-amber-600 px-10 py-4 rounded-full font-semibold hover:bg-white transition-colors inline-flex items-center gap-2 shadow-lg text-lg"
                >
                  Plan Your Moving Sale
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-b from-emerald-50/50 to-emerald-100/30 relative overflow-hidden">
        <div className="absolute top-20 left-10 text-emerald-300 text-2xl">✦</div>
        <div className="absolute top-40 right-20 text-amber-400 text-xl">✦</div>
        <div className="absolute bottom-32 left-1/4 text-emerald-400 text-lg">✦</div>
        <div className="absolute top-1/3 right-1/3 text-amber-300 text-sm">✦</div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 100" className="w-full h-20 text-emerald-100">
            <path d="M0 50 Q200 0 400 50 T800 50 T1200 50 V100 H0 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Loved by neighbors</h2>
          </div>

          <div className="flex items-center justify-center gap-1 mb-12">
            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
            <span className="text-emerald-500">✦</span>
            <span className="text-emerald-400">✦</span>
            <span className="text-emerald-500">✦</span>
            <span className="text-emerald-400">✦</span>
            <span className="text-emerald-500">✦</span>
            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="text-4xl text-emerald-200 font-serif leading-none">"</span>
                <div className="flex-1">
                  <p className="text-gray-700 mb-4">
                    &quot;Sold my old furniture in one weekend! So much easier than posting on Facebook.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden">
                      <svg viewBox="0 0 40 40" className="w-full h-full">
                        <circle cx="20" cy="15" r="8" fill="#D4A574" />
                        <path d="M10 13 Q15 8 20 10 Q25 8 30 13" fill="#8B6914" />
                        <ellipse cx="20" cy="32" rx="12" ry="10" fill="#059669" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Sarah M.</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        Kanata <MapPin size={12} className="text-emerald-500" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100"></div>

              <div className="flex gap-4">
                <span className="text-4xl text-emerald-200 font-serif leading-none">"</span>
                <div className="flex-1">
                  <p className="text-gray-700 mb-4">
                    &quot;Found amazing deals on kids&apos; stuff. Love that it&apos;s all local pickup.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden">
                      <svg viewBox="0 0 40 40" className="w-full h-full">
                        <circle cx="20" cy="15" r="8" fill="#8B6914" />
                        <ellipse cx="20" cy="11" rx="6" ry="4" fill="#4A3728" />
                        <ellipse cx="20" cy="32" rx="12" ry="10" fill="#059669" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Mike T.</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        Barrhaven <MapPin size={12} className="text-emerald-500" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100"></div>

              <div className="flex gap-4">
                <span className="text-4xl text-emerald-200 font-serif leading-none">"</span>
                <div className="flex-1">
                  <p className="text-gray-700 mb-4">
                    &quot;Our moving sale was a huge success. Sold almost everything!&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden">
                      <svg viewBox="0 0 40 40" className="w-full h-full">
                        <circle cx="14" cy="14" r="5" fill="#8B6914" />
                        <circle cx="26" cy="14" r="5" fill="#D4A574" />
                        <circle cx="20" cy="24" r="4" fill="#D4A574" />
                        <ellipse cx="14" cy="32" rx="6" ry="6" fill="#059669" />
                        <ellipse cx="26" cy="32" rx="6" ry="6" fill="#F59E0B" />
                        <ellipse cx="20" cy="34" rx="5" ry="5" fill="#EF4444" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">The Patel Family</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        Stittsville <MapPin size={12} className="text-emerald-500" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-emerald-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to join your neighborhood&apos;s next Drop?
          </h2>
          <p className="text-emerald-200 text-lg mb-8">Sign up now and start buying or selling this weekend</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => goBuyerAuth("signup")}
              className="bg-white text-emerald-700 px-8 py-4 rounded-full font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
            >
              Join as a Buyer
              <ShoppingBag size={18} />
            </button>
            <button
              onClick={() => goSellerAuth("signup")}
              className="bg-amber-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
            >
              Start Selling
              <Package size={18} />
            </button>
          </div>
        </div>
      </section>

      <Footer goBuyerAuth={goBuyerAuth} goSellerAuth={goSellerAuth} goMovingAuth={goMovingAuth} setPage={setPage} />
    </div>
  );
}

function BuyersPage({
  goBuyerAuth,
  goSellerAuth,
  goMovingAuth,
  setPage,
}: {
  goBuyerAuth: (mode?: string) => void;
  goSellerAuth: (mode?: string) => void;
  goMovingAuth: (mode?: string) => void;
  setPage: (p: string) => void;
}) {
  return (
    <div>
      <section className="min-h-[70vh] flex items-center bg-gradient-to-br from-emerald-50 via-white to-amber-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <ShoppingBag size={16} />
                For Buyers
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Shop locally.
                <span className="text-emerald-700"> Simply.</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Discover amazing deals from your neighbors through curated weekend Drops. Quality items at great
                prices, just around the corner.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => goBuyerAuth("signup")}
                  className="bg-emerald-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
                >
                  Join This Week&apos;s Drop
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => goBuyerAuth("login")}
                  className="border-2 border-emerald-700 text-emerald-700 px-6 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors"
                >
                  I Have an Account
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    Drop ends in 23:45:32
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { emoji: "🛋️", title: "Sectional Sofa", price: "$450", orig: "$1800" },
                    { emoji: "📱", title: "iPhone 13", price: "$320", orig: "$600" },
                    { emoji: "🚲", title: "Mountain Bike", price: "$180", orig: "$500" },
                    { emoji: "🎮", title: "PS5 Bundle", price: "$380", orig: "$550" },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3 hover:bg-emerald-50 transition-colors cursor-pointer">
                      <div className="text-3xl mb-2">{item.emoji}</div>
                      <p className="font-medium text-gray-900 text-sm truncate">{item.title}</p>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-emerald-600">{item.price}</span>
                        <span className="text-xs text-gray-400 line-through">{item.orig}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why buy on DropYard?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "💰",
                title: "Amazing Prices",
                desc: "Items priced 50-70% below retail. Your neighbors' quality stuff at yard sale prices.",
              },
              {
                icon: "📍",
                title: "Hyper-Local",
                desc: "Everything is in your neighborhood. No shipping, no waiting—just walk or drive over.",
              },
              {
                icon: "⭐",
                title: "Quality Items",
                desc: "Real neighbors selling real stuff. See seller ratings and item conditions upfront.",
              },
            ].map((benefit, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-emerald-50 transition-colors">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How buying works</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Browse", desc: "Explore items in your neighborhood during weekend Drops" },
              { step: "2", title: "Save & Claim", desc: "Save favorites and claim items you want to buy" },
              { step: "3", title: "Confirm Pickup", desc: "Choose a pickup window that works for you" },
              { step: "4", title: "Pick Up & Pay", desc: "Meet your neighbor and complete the transaction" },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => goBuyerAuth("signup")}
              className="bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-emerald-800 transition-colors inline-flex items-center gap-2"
            >
              Get Started
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <Footer goBuyerAuth={goBuyerAuth} goSellerAuth={goSellerAuth} goMovingAuth={goMovingAuth} setPage={setPage} />
    </div>
  );
}

function SellersPage({
  goBuyerAuth,
  goSellerAuth,
  goMovingAuth,
  setPage,
}: {
  goBuyerAuth: (mode?: string) => void;
  goSellerAuth: (mode?: string) => void;
  goMovingAuth: (mode?: string) => void;
  setPage: (p: string) => void;
}) {
  return (
    <div>
      <section className="min-h-[70vh] flex items-center bg-gradient-to-br from-amber-50 via-white to-emerald-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Package size={16} />
              For Sellers
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Sell easily to
              <span className="text-amber-600"> your neighbors.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Turn unused items into cash through simple, time-limited community Drops. No meetups with strangers—just
              neighbors helping neighbors.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => goSellerAuth("signup")}
                className="bg-amber-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
              >
                Become a Seller
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => goSellerAuth("login")}
                className="border-2 border-amber-500 text-amber-600 px-6 py-3 rounded-full font-semibold hover:bg-amber-50 transition-colors"
              >
                I Have an Account
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose how you want to sell</h2>
            <p className="text-lg text-gray-600">Two ways to sell based on your needs</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 md:p-8 border-2 border-emerald-200 hover:border-emerald-400 transition-colors">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Calendar size={28} className="text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Weekly Neighborhood Drop</h3>
              <p className="text-gray-600 mb-6">
                Sell a few items each week. Perfect for regular decluttering or selling items as you go.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "List 1-10 items per week",
                  "Items go live each weekend",
                  "Quick, easy sales",
                  "No commitment required",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check size={16} className="text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => goSellerAuth("signup")}
                className="w-full bg-emerald-600 text-white py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors"
              >
                Start Selling Weekly
              </button>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-3xl p-6 md:p-8 border-2 border-amber-200 hover:border-amber-400 transition-colors">
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center mb-6">
                <Truck size={28} className="text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Moving Sale Drop</h3>
              <p className="text-gray-600 mb-6">
                Sell everything at once when you&apos;re moving. Get featured placement and reach more buyers.
              </p>
              <ul className="space-y-3 mb-6">
                {["Unlimited items", "Featured placement in feeds", "Dedicated sale page", "Priority support"].map(
                  (item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check size={16} className="text-amber-500 flex-shrink-0" />
                      {item}
                    </li>
                  )
                )}
              </ul>
              <button
                onClick={() => goMovingAuth("signup")}
                className="w-full bg-amber-500 text-white py-3 rounded-full font-semibold hover:bg-amber-600 transition-colors"
              >
                Plan Your Moving Sale
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why sellers love DropYard</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: "⚡", title: "Sell Fast", desc: "Items sell quickly during weekend Drops" },
              { icon: "🏠", title: "Local Only", desc: "Buyers come to you—no shipping hassle" },
              { icon: "💵", title: "Keep More", desc: "No fees on your first 10 items each month" },
              { icon: "🛡️", title: "Safe & Easy", desc: "Verified neighbors, clear pickup windows" },
            ].map((benefit, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer goBuyerAuth={goBuyerAuth} goSellerAuth={goSellerAuth} goMovingAuth={goMovingAuth} setPage={setPage} />
    </div>
  );
}

function Footer({
  goBuyerAuth,
  goSellerAuth,
  goMovingAuth,
  setPage,
}: {
  goBuyerAuth: (mode?: string) => void;
  goSellerAuth: (mode?: string) => void;
  goMovingAuth: (mode?: string) => void;
  setPage: (p: string) => void;
}) {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <DropYardLogo size="default" />
              <DropYardWordmark className="text-xl" />
            </div>
            <p className="text-emerald-400 font-medium mb-2">From one home to another.</p>
            <p className="text-gray-400 text-sm">
              DropYard brings back the simplicity of yard sales—without the hassle of setting up in your driveway.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-emerald-400">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => setPage("howitworks")} className="text-gray-400 hover:text-white text-sm text-left transition-colors">
                How it works
              </button>
              <button onClick={() => setPage("buyers")} className="text-gray-400 hover:text-white text-sm text-left transition-colors">
                For Buyers
              </button>
              <button onClick={() => setPage("sellers")} className="text-gray-400 hover:text-white text-sm text-left transition-colors">
                For Sellers
              </button>
              <button className="text-gray-400 hover:text-white text-sm text-left transition-colors flex items-center gap-1.5">
                <HelpCircle size={14} />
                FAQ
              </button>
              <button className="text-gray-400 hover:text-white text-sm text-left transition-colors flex items-center gap-1.5">
                <FileText size={14} />
                Community Guidelines
              </button>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-emerald-400">Get Started</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => goBuyerAuth("signup")} className="text-gray-400 hover:text-white text-sm text-left transition-colors">
                Join the Next Drop
              </button>
              <button onClick={() => goSellerAuth("signup")} className="text-gray-400 hover:text-white text-sm text-left transition-colors">
                Become a Seller
              </button>
              <button onClick={() => goMovingAuth("signup")} className="text-gray-400 hover:text-white text-sm text-left transition-colors">
                Plan a Moving Sale
              </button>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-emerald-400">Account</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => goBuyerAuth("login")} className="text-gray-400 hover:text-white text-sm text-left transition-colors">
                Log in
              </button>
              <button onClick={() => goBuyerAuth("signup")} className="text-gray-400 hover:text-white text-sm text-left transition-colors">
                Sign up
              </button>
              <span className="text-gray-500 text-sm">Help Center</span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2025 DropYard. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function HowItWorksPage({
  goBuyerAuth,
  goSellerAuth,
  setPage,
}: {
  goBuyerAuth: (mode?: string) => void;
  goSellerAuth: (mode?: string) => void;
  setPage: (p: string) => void;
}) {
  return (
    <div className="pt-20">
      <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-50 via-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">A simple weekly rhythm to keep value local</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">
              <div className="grid grid-cols-5 md:grid-cols-12 bg-emerald-700 text-white">
                <div className="col-span-2 md:col-span-3 px-4 md:px-6 py-4 font-semibold text-sm md:text-base">Day</div>
                <div className="col-span-3 md:col-span-9 px-4 md:px-6 py-4 font-semibold text-sm md:text-base">
                  What Happens
                </div>
              </div>

              <div className="grid grid-cols-5 md:grid-cols-12 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="col-span-2 md:col-span-3 px-4 md:px-6 py-4 md:py-5 font-semibold text-gray-900 text-xs md:text-base flex items-center">
                  Monday–Wednesday
                </div>
                <div className="col-span-3 md:col-span-9 px-4 md:px-6 py-4 md:py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                      📦
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm md:text-base">Sellers upload items</div>
                      <div className="text-xs md:text-sm text-blue-700">Submission window</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-5 md:grid-cols-12 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="col-span-2 md:col-span-3 px-4 md:px-6 py-4 md:py-5 font-semibold text-gray-900 text-xs md:text-base flex items-center">
                  Thursday
                </div>
                <div className="col-span-3 md:col-span-9 px-4 md:px-6 py-4 md:py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                      👀
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm md:text-base">
                        Submission closes, items enter &quot;Preview&quot;
                      </div>
                      <div className="text-xs md:text-sm text-purple-700">Browse begins</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-5 md:grid-cols-12 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="col-span-2 md:col-span-3 px-4 md:px-6 py-4 md:py-5 font-semibold text-gray-900 text-xs md:text-base flex items-center">
                  Thursday–Friday
                </div>
                <div className="col-span-3 md:col-span-9 px-4 md:px-6 py-4 md:py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                      💜
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm md:text-base">
                        Buyers browse, save favorites, get alerts
                      </div>
                      <div className="text-xs md:text-sm text-purple-700">Preview mode</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-5 md:grid-cols-12 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-amber-50">
                <div className="col-span-2 md:col-span-3 px-4 md:px-6 py-4 md:py-5 font-semibold text-emerald-800 text-xs md:text-base flex items-center">
                  Saturday 8am
                </div>
                <div className="col-span-3 md:col-span-9 px-4 md:px-6 py-4 md:py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ring-2 ring-amber-300 ring-offset-2">
                      🔔
                    </div>
                    <div>
                      <div className="font-semibold text-emerald-800 text-base md:text-lg flex items-center gap-2">
                        DROP GOES LIVE—claiming opens
                        <span className="text-amber-500 animate-pulse">●</span>
                      </div>
                      <div className="text-xs md:text-sm text-emerald-700">The main event!</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-5 md:grid-cols-12 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="col-span-2 md:col-span-3 px-4 md:px-6 py-4 md:py-5 font-semibold text-gray-900 text-xs md:text-base flex items-center">
                  Saturday–Sunday
                </div>
                <div className="col-span-3 md:col-span-9 px-4 md:px-6 py-4 md:py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                      🛒
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm md:text-base">
                        48-hour claim & pickup window
                      </div>
                      <div className="text-xs md:text-sm text-emerald-700">Claim items, coordinate pickup</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-5 md:grid-cols-12 hover:bg-gray-50 transition-colors">
                <div className="col-span-2 md:col-span-3 px-4 md:px-6 py-4 md:py-5 font-semibold text-gray-900 text-xs md:text-base flex items-center">
                  Sunday 8pm
                </div>
                <div className="col-span-3 md:col-span-9 px-4 md:px-6 py-4 md:py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                      🔒
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm md:text-base">
                        Drop closes, unclaimed items return to sellers
                      </div>
                      <div className="text-xs md:text-sm text-gray-600">Reset for next week</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-1 md:gap-2 text-xs flex-wrap justify-center">
                <span className="px-2 md:px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full font-medium">Submit</span>
                <ChevronRight size={14} className="text-gray-300" />
                <span className="px-2 md:px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                  Preview
                </span>
                <ChevronRight size={14} className="text-gray-300" />
                <span className="px-2 md:px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full font-medium flex items-center gap-1">
                  <span className="text-amber-500">🔔</span> Live Drop
                </span>
                <ChevronRight size={14} className="text-gray-300" />
                <span className="px-2 md:px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full font-medium">Close</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to join the next Drop?</h2>
          <p className="text-lg text-gray-600 mb-10">
            Whether you&apos;re buying or selling, it only takes a minute to get started.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => goBuyerAuth("signup")}
              className="bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
            >
              Browse as Buyer
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => goSellerAuth("signup")}
              className="bg-amber-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
            >
              Become a Seller
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <DropYardLogo size="default" />
              <DropYardWordmark className="text-xl text-white" />
            </div>
            <div className="flex items-center gap-6 text-sm">
              <button onClick={() => setPage("home")} className="hover:text-white transition-colors">
                Home
              </button>
              <button onClick={() => setPage("buyers")} className="hover:text-white transition-colors">
                For Buyers
              </button>
              <button onClick={() => setPage("sellers")} className="hover:text-white transition-colors">
                For Sellers
              </button>
            </div>
            <div className="text-sm">© 2025 DropYard</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AuthFlow({
  userType,
  authMode,
  onComplete,
  onBack,
  userData,
  setUserData,
}: {
  userType: "buyer" | "seller" | "moving";
  authMode: "signup" | "login";
  onComplete: () => void;
  onBack: () => void;
  userData: {
    name: string;
    email: string;
    postalCode: string;
    neighborhood: string;
    zone: null | { name: string; drops: number; items: number; distance: string };
    interests: string[];
  };
  setUserData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      postalCode: string;
      neighborhood: string;
      zone: null | { name: string; drops: number; items: number; distance: string };
      interests: string[];
    }>
  >;
}) {
  const [step, setStep] = useState(authMode);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const config = {
    buyer: {
      bg: "bg-emerald-600",
      bgHover: "hover:bg-emerald-700",
      bgLight: "bg-emerald-100",
      text: "text-emerald-600",
      border: "border-emerald-500",
      icon: ShoppingBag,
      title: "Buyer",
      tagline: "Browse neighborhood Drops",
    },
    seller: {
      bg: "bg-emerald-600",
      bgHover: "hover:bg-emerald-700",
      bgLight: "bg-emerald-100",
      text: "text-emerald-600",
      border: "border-emerald-500",
      icon: Package,
      title: "Seller",
      tagline: "Sell to your neighbors",
    },
    moving: {
      bg: "bg-amber-500",
      bgHover: "hover:bg-amber-600",
      bgLight: "bg-amber-100",
      text: "text-amber-600",
      border: "border-amber-500",
      icon: Truck,
      title: "Moving Sale",
      tagline: "Sell everything at once",
    },
  }[userType];

  const handlePostalCode = (val: string) => {
    const formatted = val.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 7);
    const zone = detectZone(formatted);
    setUserData((prev) => ({ ...prev, postalCode: formatted, zone, neighborhood: zone?.name || "" }));
  };

  const handleLogin = () => {
    setUserData((prev) => ({ ...prev, name: "Demo User", neighborhood: "Kanata North" }));
    onComplete();
  };

  const handleSignup = () => setStep("onboarding");

  if (step === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl max-w-md w-full border border-gray-100">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm transition-colors">
            <ChevronLeft size={18} />
            Back to website
          </button>

          <div className="text-center mb-8">
            <div className={`w-16 h-16 ${config.bgLight} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <config.icon size={32} className={config.text} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-600 text-sm mt-1">Sign in to your {config.title} account</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button className={`text-sm ${config.text} font-medium hover:underline`}>Forgot password?</button>
            </div>

            <button onClick={handleLogin} className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all ${config.bg} ${config.bgHover}`}>
              Sign In
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Apple</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don&apos;t have an account?{" "}
            <button onClick={() => setStep("signup")} className={`${config.text} font-semibold hover:underline`}>
              Sign up
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (step === "signup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl max-w-md w-full border border-gray-100">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm transition-colors">
            <ChevronLeft size={18} />
            Back to website
          </button>

          <div className="text-center mb-8">
            <div className={`w-16 h-16 ${config.bgLight} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <config.icon size={32} className={config.text} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="text-gray-600 text-sm mt-1">Join DropYard as a {config.title}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (8+ characters)"
                  className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mt-0.5" />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the <span className={`${config.text} font-medium cursor-pointer`}>Terms of Service</span>{" "}
                and <span className={`${config.text} font-medium cursor-pointer`}>Privacy Policy</span>
              </label>
            </div>

            <button
              onClick={handleSignup}
              disabled={!userData.name || !userData.email || !password}
              className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all ${
                userData.name && userData.email && password ? `${config.bg} ${config.bgHover}` : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or sign up with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Apple</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <button onClick={() => setStep("login")} className={`${config.text} font-semibold hover:underline`}>
              Log in
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bg}`}>
              <config.icon size={20} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 block">{config.title} Setup</span>
              <span className="text-xs text-gray-500">{config.tagline}</span>
            </div>
          </div>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Step {onboardingStep + 1} of 3
          </span>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full ${config.bg} rounded-full transition-all duration-500`} style={{ width: `${((onboardingStep + 1) / 3) * 100}%` }} />
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {onboardingStep === 0 && (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Where are you located?</h2>
              <p className="text-gray-600">We&apos;ll show you Drops and items in your neighborhood</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                <div className="relative">
                  <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={userData.postalCode || ""}
                    onChange={(e) => handlePostalCode(e.target.value)}
                    placeholder="K2K 1A1"
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl uppercase text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">Enter your postal code to auto-detect your neighborhood</p>
              </div>

              {userData.zone && userData.postalCode?.length >= 3 && (
                <div className={`${config.bgLight} rounded-xl p-5 border-2 ${config.border}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle size={20} className={config.text} />
                    <span className={`font-semibold ${config.text}`}>Neighborhood detected!</span>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{userData.zone.name}</h3>
                      <span className={`text-sm font-medium ${config.text} bg-white px-3 py-1 rounded-full border ${config.border}`}>
                        {userData.zone.distance}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-gray-600 text-sm">
                          <strong className="text-gray-900">{userData.zone.drops}</strong> active drops
                        </span>
                      </div>
                      <div className="text-gray-600 text-sm">
                        <strong className="text-gray-900">{userData.zone.items}</strong> items available
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Neighborhood Name</label>
                <input
                  type="text"
                  value={userData.neighborhood || ""}
                  onChange={(e) => setUserData((prev) => ({ ...prev, neighborhood: e.target.value }))}
                  placeholder="Auto-detected from postal code"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {onboardingStep === 1 && (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {userType === "buyer" ? "What are you looking for?" : "What will you be selling?"}
              </h2>
              <p className="text-gray-600">
                {userType === "buyer"
                  ? "Select categories to get personalized recommendations"
                  : "This helps us match you with the right buyers"}
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {[
                { id: "furniture", icon: "🪑", label: "Furniture" },
                { id: "electronics", icon: "📱", label: "Electronics" },
                { id: "kitchen", icon: "🍳", label: "Kitchen" },
                { id: "kids", icon: "👶", label: "Kids & Baby" },
                { id: "clothing", icon: "👕", label: "Clothing" },
                { id: "sports", icon: "⚽", label: "Sports" },
                { id: "decor", icon: "🖼️", label: "Home Decor" },
                { id: "tools", icon: "🔧", label: "Tools" },
                { id: "garden", icon: "🌱", label: "Garden" },
                { id: "books", icon: "📚", label: "Books" },
                { id: "auto", icon: "🚗", label: "Auto" },
                { id: "other", icon: "📦", label: "Other" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    setUserData((prev) => ({
                      ...prev,
                      interests: prev.interests?.includes(cat.id)
                        ? prev.interests.filter((i) => i !== cat.id)
                        : [...(prev.interests || []), cat.id],
                    }))
                  }
                  className={`p-4 rounded-xl border-2 text-center transition-all hover:scale-105 ${
                    userData.interests?.includes(cat.id) ? `${config.border} ${config.bgLight}` : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <span className="text-2xl block mb-1">{cat.icon}</span>
                  <p className="font-medium text-gray-900 text-xs">{cat.label}</p>
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              {userData.interests?.length || 0} selected • You can change this later
            </p>
          </div>
        )}

        {onboardingStep === 2 && (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className={`${config.bgLight} rounded-2xl p-8 text-center`}>
              <div className={`w-20 h-20 ${config.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                <Sparkles size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">You&apos;re all set!</h2>
              <p className="text-xl text-gray-900 mb-2">Welcome, {userData.name}! 👋</p>
              <p className="text-gray-600 mb-6">
                You&apos;re ready to {userType === "buyer" ? "start shopping" : "start selling"} in{" "}
                <strong>{userData.neighborhood || "your area"}</strong>
              </p>

              <div className="bg-white rounded-xl p-4 text-left max-w-sm mx-auto shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">What&apos;s next?</h3>
                <ul className="space-y-2">
                  {userType === "buyer" ? (
                    <>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <Check size={16} className={config.text} /> Browse items in this week&apos;s Drop
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <Check size={16} className={config.text} /> Save favorites to your list
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <Check size={16} className={config.text} /> Claim items and schedule pickup
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <Check size={16} className={config.text} /> Add your first items to sell
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <Check size={16} className={config.text} /> Set your pickup availability
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <Check size={16} className={config.text} /> Items go live this weekend!
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8">
          {onboardingStep > 0 ? (
            <button onClick={() => setOnboardingStep(onboardingStep - 1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
              <ChevronLeft size={20} />
              Back
            </button>
          ) : (
            <button onClick={() => setStep("signup")} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
              <ChevronLeft size={20} />
              Back
            </button>
          )}

          {onboardingStep < 2 ? (
            <button
              onClick={() => setOnboardingStep(onboardingStep + 1)}
              disabled={onboardingStep === 0 && !userData.postalCode}
              className={`px-8 py-3 rounded-full font-semibold text-white transition-all flex items-center gap-2 ${
                (onboardingStep === 0 && userData.postalCode) || onboardingStep > 0
                  ? `${config.bg} ${config.bgHover}`
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Continue
              <ChevronRight size={20} />
            </button>
          ) : (
            <button onClick={onComplete} className={`px-8 py-3 rounded-full font-semibold text-white flex items-center gap-2 ${config.bg} ${config.bgHover} shadow-lg`}>
              <Sparkles size={18} />
              Get Started
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function SuccessScreen({
  userType,
  userData,
  onContinue,
}: {
  userType: "buyer" | "seller" | "moving";
  userData: { name: string; neighborhood: string };
  onContinue: () => void;
}) {
  const config = {
    buyer: { bg: "bg-emerald-600", text: "text-emerald-600", icon: ShoppingBag },
    seller: { bg: "bg-emerald-600", text: "text-emerald-600", icon: Package },
    moving: { bg: "bg-amber-500", text: "text-amber-600", icon: Truck },
  }[userType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl max-w-md w-full text-center border border-gray-100">
        <div className={`w-20 h-20 ${config.bg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
          <CheckCircle size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to DropYard!</h1>
        <p className="text-gray-600 mb-8">Your account has been created successfully, {userData.name}!</p>

        <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left">
          <div className="flex items-center gap-3 mb-3">
            <MapPin size={18} className={config.text} />
            <span className="font-medium text-gray-900">{userData.neighborhood || "Your Area"}</span>
          </div>
          <p className="text-sm text-gray-600">
            {userType === "buyer"
              ? "You can now browse items in this week's neighborhood Drop!"
              : "You can now list items for this week's Drop!"}
          </p>
        </div>

        <button onClick={onContinue} className={`w-full py-4 rounded-xl font-semibold text-white ${config.bg} flex items-center justify-center gap-2`}>
          {userType === "buyer" ? "Start Browsing" : "Add Your First Item"}
          <ArrowRight size={18} />
        </button>

        <p className="text-sm text-gray-500 mt-6">
          This demo returns to the homepage. In the real app, you&apos;d go to your dashboard.
        </p>
      </div>
    </div>
  );
}
