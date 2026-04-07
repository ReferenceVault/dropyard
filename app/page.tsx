"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  ShieldCheck,
  X,
  Bell,
  Heart,
  Search,
  ChevronDown,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
} from "lucide-react";

// ============================================================================
// CUSTOM LOGO COMPONENT
// ============================================================================
export function DropYardLogo({ size = "default" }: { size?: "small" | "default" | "large" }) {
  const sizes = {
    small: { container: "w-8 h-8" },
    default: { container: "w-10 h-10" },
    large: { container: "w-14 h-14" },
  };
  const s = sizes[size] || sizes.default;

  return (
    <div className={`${s.container} relative flex items-center justify-center`}>
      <img src="/logo.jpeg" alt="DropYard logo" className="w-full h-full object-contain" />
    </div>
  );
}

export function DropYardWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-brand font-bold ${className}`}>
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState("home");

  useEffect(() => {
    const p = searchParams?.get("page");
    if (p === "howitworks") {
      router.replace("/how-it-works");
      return;
    }
    if (p === "sellers") {
      router.replace("/for-sellers");
      return;
    }
    if (p === "buyers") setPage("buyers");
  }, [searchParams, router]);

  const goBuyerAuth = (mode: "signup" | "login" = "signup") => {
    router.push(`/join?mode=${mode === "login" ? "signin" : "signup"}`);
  };
  const goSellerAuth = () => router.push("/join?mode=signup");
  const goMovingAuth = () => router.push("/join?mode=signup");

  return (
    <>
      <Website
        page={page}
        setPage={setPage}
        goBuyerAuth={goBuyerAuth}
        goSellerAuth={goSellerAuth}
        goMovingAuth={goMovingAuth}
      />
    </>
  );
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
  goBuyerAuth: (mode?: "signup" | "login") => void;
  goSellerAuth: (mode?: "signup" | "login") => void;
  goMovingAuth: (mode?: "signup" | "login") => void;
}) {
  return (
    <div className="min-h-full font-sans bg-white">
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
// FEATURED ITEMS DATA
// ============================================================================
const NEIGHBORHOODS = [
  { id: "kanata-north", name: "Kanata North", drops: 3, items: 156 },
  { id: "barrhaven", name: "Barrhaven", drops: 4, items: 203 },
  { id: "orleans", name: "Orleans", drops: 3, items: 124 },
  { id: "nepean", name: "Nepean", drops: 4, items: 176 },
  { id: "westboro", name: "Westboro", drops: 4, items: 198 },
  { id: "stittsville", name: "Stittsville", drops: 2, items: 87 },
];

const CATEGORIES = [
  { id: "all", name: "All Items", icon: "🏠", count: 156, color: "emerald" },
  { id: "furniture", name: "Furniture", icon: "🪑", count: 34, color: "amber" },
  { id: "electronics", name: "Electronics", icon: "📱", count: 28, color: "blue" },
  { id: "kitchen", name: "Kitchen", icon: "🍳", count: 22, color: "orange" },
  { id: "kids", name: "Kids & Baby", icon: "👶", count: 31, color: "pink" },
  { id: "clothing", name: "Clothing", icon: "👕", count: 18, color: "purple" },
  { id: "sports", name: "Sports", icon: "⚽", count: 12, color: "green" },
  { id: "tools", name: "Tools", icon: "🔧", count: 11, color: "gray" },
];

const FEATURED_ITEMS = [
  { id: 1, title: "IKEA Kallax Shelf Unit", price: 45, originalPrice: 120, image: "📦", category: "Furniture", seller: "Patel Family", neighborhood: "Kanata North", distance: "2.3 km", saves: 12, condition: "Like New" },
  { id: 2, title: "Dyson V8 Cordless Vacuum", price: 180, originalPrice: 450, image: "🔌", category: "Electronics", seller: "Chen Family", neighborhood: "Barrhaven", distance: "4.1 km", saves: 28, condition: "Good" },
  { id: 3, title: "Kids Balance Bike (Blue)", price: 35, originalPrice: 90, image: "🚲", category: "Kids & Baby", seller: "Johnson Family", neighborhood: "Orleans", distance: "6.2 km", saves: 8, condition: "Good" },
  { id: 4, title: "KitchenAid Stand Mixer", price: 120, originalPrice: 350, image: "🍳", category: "Kitchen", seller: "Williams Family", neighborhood: "Westboro", distance: "3.5 km", saves: 45, condition: "Excellent" },
];

// ============================================================================
// ITEM CARD
// ============================================================================
function ItemCard({ item }: { item: typeof FEATURED_ITEMS[0] }) {
  const [saved, setSaved] = useState(false);
  const discount = Math.round((1 - item.price / item.originalPrice) * 100);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-emerald-200 transition-all duration-300 group">
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-44 flex items-center justify-center">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{item.image}</span>
        <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">-{discount}%</div>
        <button
          onClick={() => setSaved(!saved)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center ${saved ? "bg-rose-500 text-white" : "bg-white/90 text-gray-400 hover:text-rose-500"}`}
        >
          <Heart size={16} fill={saved ? "currentColor" : "none"} />
        </button>
        <div className="absolute bottom-3 left-3 bg-white/90 text-xs font-medium px-2 py-1 rounded-full text-gray-700">{item.condition}</div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span className="bg-gray-100 px-2 py-0.5 rounded-full">{item.category}</span>
          <span className="flex items-center gap-1"><MapPin size={12} />{item.distance}</span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-700">{item.title}</h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center"><User size={12} className="text-emerald-600" /></div>
          <span className="text-xs text-gray-600">{item.seller}</span>
          <span className="text-xs text-gray-400">• {item.neighborhood}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-emerald-600">${item.price}</span>
            <span className="text-sm text-gray-400 line-through ml-2">${item.originalPrice}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400"><Heart size={12} />{item.saves}</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SEARCH BAR
// ============================================================================
function SearchBar() {
  const [query, setQuery] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 flex flex-col md:flex-row gap-2">
      <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search items..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
        />
      </div>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 min-w-[180px]"
        >
          <MapPin size={18} className="text-emerald-600" />
          <span className="text-gray-700 text-sm">{selectedNeighborhood || "All Neighborhoods"}</span>
          <ChevronDown size={16} className="text-gray-400 ml-auto" />
        </button>
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
            <button
              onClick={() => { setSelectedNeighborhood(""); setShowDropdown(false); }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
            >
              All Neighborhoods
            </button>
            {NEIGHBORHOODS.map((n) => (
              <button
                key={n.id}
                onClick={() => { setSelectedNeighborhood(n.name); setShowDropdown(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
              >
                <span>{n.name}</span>
                <span className="text-xs text-gray-400">{n.items} items</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 flex items-center justify-center gap-2">
        <Search size={18} /><span className="hidden sm:inline">Search</span>
      </button>
    </div>
  );
}

// ============================================================================
// CATEGORY CARD
// ============================================================================
function CategoryCard({ category, onClick }: { category: typeof CATEGORIES[0]; onClick: () => void }) {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700",
    amber: "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700",
    blue: "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700",
    orange: "bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700",
    pink: "bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-700",
    purple: "bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700",
    green: "bg-green-50 hover:bg-green-100 border-green-200 text-green-700",
    gray: "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700",
  };
  return (
    <button onClick={onClick} className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-md ${colors[category.color]}`}>
      <span className="text-3xl block mb-2">{category.icon}</span>
      <span className="font-semibold text-sm block">{category.name}</span>
      <span className="text-xs opacity-70">{category.count} items</span>
    </button>
  );
}

// ============================================================================
// DROP COUNTDOWN
// ============================================================================
function DropCountdown() {
  const [time, setTime] = useState({ hours: 23, minutes: 45, seconds: 32 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 47; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-1.5 font-mono text-sm">
      <span className="bg-emerald-900/60 px-1.5 py-0.5 rounded text-white font-bold">{pad(time.hours)}</span>
      <span className="text-emerald-300 font-bold">:</span>
      <span className="bg-emerald-900/60 px-1.5 py-0.5 rounded text-white font-bold">{pad(time.minutes)}</span>
      <span className="text-emerald-300 font-bold">:</span>
      <span className="bg-emerald-900/60 px-1.5 py-0.5 rounded text-white font-bold">{pad(time.seconds)}</span>
    </div>
  );
}

const COMING_SOON_HOODS = [
  { name: "Kanata", interest: 84 },
  { name: "Orléans", interest: 67 },
  { name: "Nepean", interest: 53 },
  { name: "Stittsville", interest: 41 },
  { name: "Gloucester", interest: 38 },
  { name: "Westboro", interest: 29 },
];

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
// HOW IT WORKS SECTION (animated)
// ============================================================================
function HowItWorksSection() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const steps = [
    { num: 1, img: "/images/step1.jpg", alt: "Sellers submit items" },
    { num: 2, img: "/images/step2.jpg", alt: "We host the Drop" },
    { num: 3, img: "/images/step3.jpg", alt: "Neighbours claim" },
    { num: 4, img: "/images/step4.jpg", alt: "Local pickup & payment" },
  ];

  return (
    <>
      <style>{`
        @keyframes slideInFromLeft {
          0% { opacity: 0; transform: translateX(-60px) scale(0.95); }
          60% { opacity: 1; transform: translateX(8px) scale(1.01); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes growLine {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0); }
          70% { transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
        .step-card { opacity: 0; }
        .step-card.animate { animation: slideInFromLeft 0.6s ease-out forwards; }
        .step-line { width: 0%; }
        .step-line.animate { animation: growLine 1.2s ease-out 0.3s forwards; }
        .step-dot { opacity: 0; transform: scale(0); }
        .step-dot.animate { animation: popIn 0.3s ease-out forwards; }
        .header-anim { opacity: 0; }
        .header-anim.animate { animation: fadeInUp 0.5s ease-out forwards; }
      `}</style>

      <section
        ref={sectionRef}
        className="pt-6 pb-8 md:pt-12 md:pb-10 font-sans bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-amber-400 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-emerald-400 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-300 blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 w-full relative z-10">
          <div className="text-center mb-6">
            <h2 className={`text-3xl md:text-4xl font-bold text-white mb-3 header-anim ${visible ? "animate" : ""}`}>
              How DropYard Works
            </h2>
            <p
              className={`text-emerald-200 text-lg max-w-xl mx-auto header-anim ${visible ? "animate" : ""}`}
              style={{ animationDelay: "0.15s" }}
            >
              Four simple steps from listing to pickup
            </p>
          </div>

          <div className="hidden lg:block relative max-w-xl lg:max-w-2xl mx-auto">
            <div className="absolute top-[100px] left-[8%] right-[8%] h-0.5 overflow-hidden z-0">
              <div className={`h-full bg-amber-400/50 step-line ${visible ? "animate" : ""}`}></div>
            </div>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`absolute top-[97px] w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50 step-dot ${visible ? "animate" : ""}`}
                style={{ left: `${27 + i * 23}%`, animationDelay: `${0.6 + i * 0.25}s` }}
              ></div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-xl lg:max-w-2xl mx-auto">
            {steps.map((step) => (
              <div
                key={step.num}
                className={`group step-card ${visible ? "animate" : ""}`}
                style={{ animationDelay: `${(step.num - 1) * 0.2}s` }}
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 relative">
                  <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow-md">
                    {step.num}
                  </div>
                  <div className="flex items-center justify-center p-1">
                    <img src={step.img} alt={step.alt} className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
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
  goBuyerAuth: (mode?: "signup" | "login") => void;
  goSellerAuth: (mode?: "signup" | "login") => void;
  goMovingAuth: (mode?: "signup" | "login") => void;
}) {
  const testimonials = [
    {
      id: 1,
      name: "Sarah M.",
      location: "Kanata",
      image: "https://i.pravatar.cc/150?img=44",
      rating: 5,
      text: "Sold my old furniture in one weekend! So much easier than posting on Facebook.",
    },
    {
      id: 2,
      name: "Mike T.",
      location: "Barrhaven",
      image: "https://i.pravatar.cc/150?img=12",
      rating: 5,
      text: "Found amazing deals on kids' stuff. Love that it's all local pickup.",
    },
    {
      id: 3,
      name: "The Patel Family",
      location: "Stittsville",
      image: "https://i.pravatar.cc/150?img=5",
      rating: 5,
      text: "Our moving sale was a huge success. Sold almost everything!",
    },
  ];

  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistHood, setWaitlistHood] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const handleWaitlistSubmit = () => {
    if (waitlistEmail && waitlistHood) setWaitlistSubmitted(true);
  };


  const nextTestimonial = () => {
    setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getCirclePosition = (index: number) => {
    const total = testimonials.length;
    const angle = (index - activeTestimonialIndex) * (360 / total) - 90;
    const radius = 157;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius + 36;
    return { x, y };
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[580px] md:min-h-[640px] flex items-start overflow-hidden">
        {/* Photo Background */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-bg.jpg"
            alt="Neighbourhood yard sale"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 pt-12 pb-10 md:pt-16 md:pb-16">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
              {/* Left copy */}
              <div className="lg:col-span-3">
                <div className="inline-flex items-center gap-2 bg-emerald-700 text-white pl-3 pr-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300"></span>
                  </span>
                  Now live in Barrhaven
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                  Barrhaven neighbourhood
                  <span className="block text-emerald-700">yardsale — Online.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-700 mb-3 max-w-xl">
                  Buy and sell locally through curated weekend Drops.
                </p>
                <p className="text-emerald-700 font-medium text-base md:text-lg mb-8">
                  From one home to another.™
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <button
                    onClick={() => goBuyerAuth("signup")}
                    className="bg-emerald-700 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-emerald-800 shadow-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    Browse the Barrhaven Drop <ArrowRight size={18} />
                  </button>
                  <button
                    onClick={() => goSellerAuth("signup")}
                    className="bg-amber-500 border-2 border-amber-500 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-amber-600 hover:border-amber-600 flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    Sell with DropYard <ChevronRight size={18} />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button onClick={() => goBuyerAuth("login")} className="text-emerald-700 font-medium ml-1 hover:underline">
                    Log in
                  </button>
                </p>
              </div>

              {/* Right: Live Drop card */}
              <div className="lg:col-span-2 hidden lg:block">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="bg-emerald-700 px-5 py-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
                        </span>
                        <span className="text-emerald-200 text-xs font-semibold uppercase tracking-wider">Live Now</span>
                      </div>
                      <p className="text-white font-bold text-lg">Barrhaven Launch Drop</p>
                    </div>
                    <DropCountdown />
                  </div>

                  <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                    <div className="px-4 py-3 text-center">
                      <p className="text-xl font-bold text-gray-900">150+</p>
                      <p className="text-xs text-gray-500">Items</p>
                    </div>
                    <div className="px-4 py-3 text-center">
                      <p className="text-xl font-bold text-emerald-600">42</p>
                      <p className="text-xs text-gray-500">Claimed</p>
                    </div>
                    <div className="px-4 py-3 text-center">
                      <p className="text-xl font-bold text-amber-500">24</p>
                      <p className="text-xs text-gray-500">Sellers</p>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    {[
                      { emoji: "🪑", title: "IKEA Kallax Shelf", price: "$45", status: "available" },
                      { emoji: "🔌", title: "Dyson V8 Vacuum", price: "$180", status: "claimed" },
                      { emoji: "🍳", title: "KitchenAid Mixer", price: "$120", status: "available" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-colors cursor-pointer">
                        <span className="text-2xl w-10 text-center">{item.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{item.title}</p>
                          <p className="text-emerald-600 font-bold text-sm">{item.price}</p>
                        </div>
                        {item.status === "available" ? (
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">Available</span>
                        ) : (
                          <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full">Claimed</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="px-4 pb-4">
                    <button
                      onClick={() => goBuyerAuth("signup")}
                      className="w-full bg-emerald-700 text-white py-3 rounded-xl font-semibold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      Browse All 150+ Items <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-emerald-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-4 md:gap-12">
          {[
            { icon: MapPin, text: "Local pickup · Barrhaven only" },
            { icon: Users, text: "Real neighbours" },
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

      {/* Featured This Week */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured This Week</h2>
              <p className="text-gray-600 mt-1">Hand-picked deals from your neighbors</p>
            </div>
            <button
              onClick={() => goBuyerAuth("signup")}
              className="hidden md:flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700"
            >
              View All <ChevronRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_ITEMS.map((item) => <ItemCard key={item.id} item={item} />)}
          </div>
          <div className="text-center mt-10">
            <button
              onClick={() => goBuyerAuth("signup")}
              className="bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 inline-flex items-center gap-2"
            >
              Browse All Items <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Search Items Section */}
      <section className="py-6 md:py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Find what you&apos;re looking for</h2>
            <p className="text-gray-600">Search 156+ items available in this weekend&apos;s Drop</p>
          </div>
          <SearchBar />
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {["Furniture", "Electronics", "Kids & Baby", "Kitchen", "Sports"].map((tag, i) => (
              <button
                key={i}
                onClick={() => goBuyerAuth("signup")}
                className="px-4 py-2 bg-gray-100 hover:bg-emerald-100 hover:text-emerald-700 rounded-full text-sm font-medium text-gray-600 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-6 md:py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Browse by Category</h2>
              <p className="text-gray-600 mt-1">Find exactly what you&apos;re looking for</p>
            </div>
            <button
              onClick={() => goBuyerAuth("signup")}
              className="hidden md:flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700"
            >
              View All <ChevronRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map((cat) => (
              <CategoryCard key={cat.id} category={cat} onClick={() => goBuyerAuth("signup")} />
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon — Neighbourhood Waitlist */}
      <section className="py-8 md:py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <MapPin size={15} />
              Expanding across Ottawa
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Not in Barrhaven? We&apos;re coming to you.
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Join the waitlist for your neighbourhood and be the first to know when your Drop goes live.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
            {COMING_SOON_HOODS.map((hood) => (
              <button
                key={hood.name}
                onClick={() => { setWaitlistHood(hood.name); setWaitlistSubmitted(false); }}
                className={`relative p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                  waitlistHood === hood.name
                    ? "border-emerald-500 bg-emerald-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className={`font-semibold ${waitlistHood === hood.name ? "text-emerald-700" : "text-gray-900"}`}>
                    {hood.name}
                  </p>
                  {waitlistHood === hood.name && <CheckCircle size={16} className="text-emerald-500" />}
                </div>
                <p className="text-xs text-gray-500">{hood.interest} people interested</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-amber-400 h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min((hood.interest / 100) * 100, 100)}%` }}
                  />
                </div>
              </button>
            ))}
          </div>

          {!waitlistSubmitted ? (
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={handleWaitlistSubmit}
                  disabled={!waitlistEmail || !waitlistHood}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
                    waitlistEmail && waitlistHood
                      ? "bg-emerald-700 text-white hover:bg-emerald-800"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Bell size={16} />
                  Notify Me
                </button>
              </div>
              {!waitlistHood && (
                <p className="text-xs text-gray-400 mt-2 text-center">Select your neighbourhood above, then enter your email</p>
              )}
              {waitlistHood && !waitlistEmail && (
                <p className="text-xs text-emerald-600 mt-2 text-center">Great — enter your email to join the {waitlistHood} waitlist</p>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <CheckCircle size={28} className="text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-gray-900 mb-1">You&apos;re on the {waitlistHood} waitlist!</p>
                <p className="text-sm text-gray-600">We&apos;ll email you at {waitlistEmail} when the {waitlistHood} Drop goes live.</p>
              </div>
            </div>
          )}
        </div>
      </section>


      {/* Built for Communities Section */}
      <section className="pt-6 pb-8 md:pt-12 md:pb-10 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-medium mb-5">
              <MapPin size={14} />
              Launching in Barrhaven
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for communities, <span className="text-emerald-700">not crowds.</span>
            </h2>
            <p className="text-lg text-gray-700 mb-2">
              DropYard brings back the simplicity of yard sales—without the hassle.
            </p>
            <p className="text-gray-600 text-sm md:text-base">
              No more ghosting, no more scams, no more strangers at your door.
              Just neighbours buying and selling like neighbours do.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <img
              src="/images/stats-card.jpg"
              alt="Fresh every weekend · 0% Strangers · 100% Local · $0 To list"
              className="w-full rounded-2xl shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Why Not Marketplace Section */}
      <section className="pt-6 pb-8 md:pt-12 md:pb-10 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Tired of <span className="text-gray-400 line-through">Facebook Marketplace</span> and <span className="text-gray-400 line-through">Kijiji</span>?
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              We built DropYard because buying and selling locally shouldn&apos;t feel like a gamble.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Pain points */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">The old way</p>
              <div className="space-y-4">
                {[
                  { text: "Ghosted 10–17 times before a sale", source: "FB Marketplace sellers" },
                  { text: '"Is this still available?" on repeat', source: "Kijiji reviews" },
                  { text: "34% of listings potentially scams", source: "TSB Bank, 2024" },
                  { text: "30% spike in peer-to-peer robberies", source: "Ottawa Police, 2023" },
                  { text: "Stale listings that never expire", source: "Both platforms" },
                ].map((pain, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <X size={16} className="text-red-400" />
                    </div>
                    <div>
                      <p className="text-gray-700 text-sm font-medium">{pain.text}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{pain.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DropYard solutions */}
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-5">The DropYard way</p>
              <div className="space-y-4">
                {[
                  { text: "Claim during a live Drop — real intent, not empty promises", icon: Clock },
                  { text: "If it's in the Drop, it's available. No DMs needed.", icon: Check },
                  { text: "Neighbourhood-verified sellers you can trust", icon: ShieldCheck },
                  { text: "Neighbours, not strangers — community accountability", icon: Users },
                  { text: "Everything auto-expires at Drop close. Always fresh.", icon: Clock },
                ].map((solution, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <solution.icon size={16} className="text-emerald-600" />
                    </div>
                    <p className="text-gray-800 text-sm font-medium">{solution.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 italic">
              &quot;DropYard does not need to be better than Facebook Marketplace or Kijiji. It needs to be structurally different — and it is.&quot;
            </p>
          </div>
        </div>
      </section>



      <section className="-mt-4 pt-4 pb-8 sm:-mt-6 sm:pt-6 sm:pb-10 md:-mt-6 md:pt-8 md:pb-12 lg:pt-10 lg:pb-16 bg-gradient-to-br from-emerald-50 via-amber-50/70 to-emerald-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">Two ways to Drop</h2>
            <p className="text-base sm:text-lg text-emerald-700 max-w-2xl mx-auto px-2">
              Choose the Drop that fits your needs—from weekly neighborhood sales to dedicated moving events
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-emerald-200/40 border border-emerald-100 hover:-translate-y-1 transition-all duration-300">
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-4 sm:p-5 relative">
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-4 sm:grid-cols-6 h-full">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="border-r border-white/20"></div>
                    ))}
                  </div>
                  <div className="absolute inset-0 grid grid-rows-3 sm:grid-rows-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="border-b border-white/20"></div>
                    ))}
                  </div>
                </div>

                <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                  <span className="bg-emerald-800/80 text-white text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 rounded-full">
                    Most Popular
                  </span>
                </div>

                <div className="text-center relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar size={16} className="sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">Every <span className="text-emerald-200 text-lg sm:text-xl md:text-2xl font-semibold">Weekend</span></div>
                </div>
              </div>

              <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-b from-white to-emerald-50/30">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Weekly Neighborhood Drop</h3>
                <p className="text-emerald-800/90 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
                  The heart of DropYard. Your community&apos;s recurring yard sale, online. New items every weekend
                  from neighbors you trust.
                </p>

                <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {[
                    { icon: Clock, text: "48-hour sale window (Sat-Sun)" },
                    { icon: MapPin, text: "Items from your neighborhood" },
                    { icon: Users, text: "5-50+ sellers per Drop" },
                    { icon: Package, text: "New inventory every week" },
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                      <feature.icon size={14} className="sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0" />
                      <span className="break-words">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="text-center">
                    <div className="text-[10px] sm:text-xs text-emerald-600 font-medium uppercase tracking-wide">For Sellers</div>
                    <div className="text-base sm:text-lg font-bold text-gray-900">Free to list</div>
                  </div>
                </div>

                <button
                  onClick={() => goSellerAuth("signup")}
                  className="w-full bg-emerald-700 text-white py-3 sm:py-4 rounded-full text-sm sm:text-base font-semibold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
                >
                  Join This Week&apos;s Drop
                  <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-amber-200/40 border border-amber-100 hover:-translate-y-1 transition-all duration-300">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-4 sm:p-5 relative">
                <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                  <span className="bg-orange-600/80 text-white text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 rounded-full">
                    Premium
                  </span>
                </div>

                <div className="text-center relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck size={16} className="sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">Moving? <span className="text-orange-100 text-lg sm:text-xl md:text-2xl font-semibold">We&apos;ve got you</span></div>
                </div>
              </div>

              <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-b from-white to-amber-50/30">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Moving Sale Drop</h3>
                <p className="text-amber-900/90 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
                  Relocating? Host your own dedicated Drop. Get featured placement, promotional support, and sell
                  everything before you go.
                </p>

                <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {[
                    { icon: Sparkles, text: "Your own featured Drop event" },
                    { icon: Calendar, text: "You pick the weekend" },
                    { icon: Mail, text: "Promotional email to local buyers" },
                    { icon: Package, text: "Unlimited items, one flat fee" },
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                      <feature.icon size={14} className="sm:w-4 sm:h-4 text-amber-500 flex-shrink-0" />
                      <span className="break-words">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-amber-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                    <div>
                      <div className="text-[10px] sm:text-xs text-amber-600 font-medium uppercase tracking-wide">Package</div>
                      <div className="text-base sm:text-lg font-bold text-gray-900">Flat fee</div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] sm:text-xs text-amber-600 font-medium uppercase tracking-wide">Starting at</div>
                      <div className="text-base sm:text-lg font-bold text-gray-900">$49</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => goMovingAuth("signup")}
                  className="w-full bg-amber-500 text-white py-3 sm:py-4 rounded-full text-sm sm:text-base font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                >
                  Plan Your Moving Sale
                  <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HowItWorksSection />


      <section className="font-sans overflow-hidden">
        <div className="relative" style={{ height: 'clamp(220px, 30vw, 380px)' }}>
          <img src="/images/moving-sale-banner.jpg" alt="Moving Sale" className="absolute inset-0 w-full h-full object-cover object-left" />
          <div className="absolute top-0 bottom-0 flex items-center" style={{ left: '42%', right: '0' }}>
            <div className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-full overflow-hidden">
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center mb-2 md:mb-3">
                <Truck className="text-white w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="text-base sm:text-xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 md:mb-3 leading-tight">
                Planning a Moving Sale?
              </h3>
              <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-3 md:mb-5 leading-snug">
                Sell everything at once with our<br className="hidden sm:inline" /> dedicated Moving Sale Drop.
              </p>
              <button
                onClick={() => goMovingAuth("signup")}
                className="bg-white/95 text-amber-600 px-3 sm:px-5 md:px-7 py-1.5 sm:py-2.5 md:py-3 rounded-full font-semibold hover:bg-white transition-colors inline-flex items-center gap-1.5 sm:gap-2 shadow-lg text-xs sm:text-sm md:text-base lg:text-lg whitespace-nowrap"
              >
                Plan Your Moving Sale
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 md:py-10 bg-gradient-to-br from-emerald-50 via-amber-50/40 to-emerald-50 relative overflow-hidden">
        <div className="absolute top-8 left-8 text-emerald-300/80 text-xl">✦</div>
        <div className="absolute top-12 right-16 text-amber-400/80 text-lg">✦</div>
        <div className="absolute bottom-16 left-1/4 text-emerald-400/70 text-base">✦</div>
        <div className="absolute top-1/3 right-1/3 text-amber-300/70 text-sm">✦</div>
        <div className="absolute bottom-8 right-1/4 text-emerald-300/60 text-lg">✦</div>
        <div className="absolute top-1/2 left-12 text-amber-400/50 text-sm">✦</div>

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Loved by neighbors</h2>
            <p className="text-gray-600 text-sm md:text-base mt-1">Real stories from real communities</p>
          </div>

          <div className="relative min-h-[320px] flex items-center justify-center">
            <div className="hidden lg:block absolute inset-0">
              {testimonials.map((testimonial, index) => {
                const pos = getCirclePosition(index);
                const isActive = index === activeTestimonialIndex;
                return (
                  <div
                    key={testimonial.id}
                    className="absolute left-1/2 top-1/2 cursor-pointer"
                    style={{
                      transform: `translate(${pos.x - 22}px, ${pos.y - 22}px) scale(${isActive ? 1.3 : 0.9})`,
                      zIndex: isActive ? 20 : 10,
                      transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onClick={() => setActiveTestimonialIndex(index)}
                  >
                    <div
                      className={`relative w-11 h-11 rounded-full overflow-hidden border-[3px] transition-all duration-300 ${
                        isActive
                          ? "border-emerald-600 shadow-xl shadow-emerald-500/20"
                          : "border-white shadow-lg hover:border-amber-300"
                      }`}
                    >
                      <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative z-30 max-w-lg mx-auto mt-4">
              <div className="bg-white rounded-2xl shadow-2xl shadow-emerald-100/50 px-6 pt-8 pb-5 text-center">
                <p className="text-sm lg:text-base text-gray-700 leading-relaxed mb-3.5 italic">
                  &ldquo;{testimonials[activeTestimonialIndex].text}&rdquo;
                </p>
                <h3 className="text-base font-bold text-gray-900 mb-0.5">
                  {testimonials[activeTestimonialIndex].name}
                </h3>
                <p className="text-emerald-700 text-xs mb-1.5">
                  {testimonials[activeTestimonialIndex].location}
                </p>
                <div className="flex items-center justify-center gap-1 text-amber-400 text-sm">
                  {Array.from({ length: testimonials[activeTestimonialIndex].rating }).map((_, i) => (
                    <span key={`star-${i}`}>★</span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  onClick={prevTestimonial}
                  className="w-9 h-9 rounded-full border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-9 h-9 rounded-full border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-emerald-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to join your neighborhood&apos;s next Drop?
          </h2>
          <p className="text-emerald-200 text-lg mb-6">Sign up now and start buying or selling this weekend</p>
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
    </div>
  );
}

function BuyersPage({
  goBuyerAuth,
  goSellerAuth,
  goMovingAuth,
  setPage,
}: {
  goBuyerAuth: (mode?: "signup" | "login") => void;
  goSellerAuth: (mode?: "signup" | "login") => void;
  goMovingAuth: (mode?: "signup" | "login") => void;
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
    </div>
  );
}

export function SellersPage({
  goBuyerAuth,
  goSellerAuth,
  goMovingAuth,
  setPage,
}: {
  goBuyerAuth: (mode?: "signup" | "login") => void;
  goSellerAuth: (mode?: "signup" | "login") => void;
  goMovingAuth: (mode?: "signup" | "login") => void;
  setPage: (p: string) => void;
}) {
  return (
    <div className="min-h-full flex flex-col">
      {/* Hero - Magical gradient */}
      <section className="relative pt-6 pb-10 px-4 md:px-[5%] lg:px-[10%] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50/60 to-emerald-50" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-amber-300/25 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-200/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-amber-200/60 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
            <Sparkles size={16} className="text-amber-500" />
            Turn clutter into cash
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Sell easily to <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">your neighbors.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Turn unused items into cash through simple, time-limited community Drops. No meetups with strangers—just
            neighbors helping neighbors.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => goSellerAuth("signup")}
              className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              Become a Seller
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => goSellerAuth("login")}
              className="inline-flex items-center justify-center border-2 border-amber-500 text-amber-600 hover:bg-amber-50 hover:border-amber-600 px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:-translate-y-0.5"
            >
              I Have an Account
            </button>
          </div>
        </div>
      </section>

      {/* Choose how you want to sell */}
      <section className="py-12 px-4 md:px-[5%] lg:px-[10%] bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block text-amber-600 font-semibold text-sm uppercase tracking-wider mb-2">Two options</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Choose how you want to sell</h2>
            <p className="text-gray-600">Pick the option that fits your needs</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="group bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-200 shadow-lg hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-400 transition-all duration-300 hover:-translate-y-1 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                  <Calendar size={30} className="text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Weekly Neighborhood Drop</h3>
                <p className="text-gray-600 mb-6">
                  Sell a few items each week. Perfect for regular decluttering or selling items as you go.
                </p>
                <ul className="space-y-3 mb-6">
                  {["List 1-10 items per week", "Items go live each weekend", "Quick, easy sales", "No commitment required"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check size={18} className="text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => goSellerAuth("signup")}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-semibold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
                >
                  Start Selling Weekly
                </button>
              </div>
            </div>

            <div className="group bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-lg hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-400 transition-all duration-300 hover:-translate-y-1 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
                  <Truck size={30} className="text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Moving Sale Drop</h3>
                <p className="text-gray-600 mb-6">
                  Sell everything at once when you&apos;re moving. Get featured placement and reach more buyers.
                </p>
                <ul className="space-y-3 mb-6">
                  {["Unlimited items", "Featured placement in feeds", "Dedicated sale page", "Priority support"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check size={18} className="text-amber-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => goMovingAuth("signup")}
                  className="w-full bg-amber-500 text-white py-4 rounded-2xl font-semibold hover:bg-amber-600 transition-all shadow-md hover:shadow-lg"
                >
                  Plan Your Moving Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why sellers love DropYard */}
      <section className="py-12 px-4 md:px-[5%] lg:px-[10%] bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block text-amber-600 font-semibold text-sm uppercase tracking-wider mb-2">The perks</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why sellers love DropYard</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "⚡", title: "Sell Fast", desc: "Items sell quickly during weekend Drops" },
              { icon: "🏠", title: "Local Only", desc: "Buyers come to you—no shipping hassle" },
              { icon: "💵", title: "Keep More", desc: "No fees on your first 10 items each month" },
              { icon: "🛡️", title: "Safe & Easy", desc: "Verified neighbors, clear pickup windows" },
            ].map((benefit, i) => (
              <div
                key={i}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">{benefit.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to start selling?</h2>
          <p className="text-amber-100 text-lg mb-8">Join DropYard and turn your unused items into cash.</p>
          <button
            onClick={() => goSellerAuth("signup")}
            className="inline-flex items-center justify-center gap-2 bg-white text-amber-600 px-10 py-4 rounded-2xl font-bold hover:bg-amber-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Get Started
            <ChevronRight size={22} />
          </button>
        </div>
      </section>
    </div>
  );
}

export function Footer({
  goBuyerAuth,
  goSellerAuth,
  goMovingAuth,
  setPage,
}: {
  goBuyerAuth: (mode?: "signup" | "login") => void;
  goSellerAuth: (mode?: "signup" | "login") => void;
  goMovingAuth: (mode?: "signup" | "login") => void;
  setPage: (p: string) => void;
}) {
  return (
    <footer className="relative bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white pt-14 pb-6 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-500" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <DropYardLogo size="default" />
              <span className="text-xl font-bold">
                <span className="text-emerald-400">Drop</span>
                <span className="text-amber-400">Yard</span>
              </span>
            </div>
            <p className="text-emerald-300 font-semibold mb-2 text-sm uppercase tracking-wider">From one home to another.</p>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xs">
              DropYard brings back the simplicity of yard sales—without the hassle of setting up in your driveway.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: Instagram, label: "Instagram", hover: "hover:bg-pink-500" },
                { icon: Facebook, label: "Facebook", hover: "hover:bg-blue-600" },
                { icon: Twitter, label: "Twitter / X", hover: "hover:bg-sky-500" },
                { icon: Youtube, label: "YouTube", hover: "hover:bg-red-600" },
                { icon: Linkedin, label: "LinkedIn", hover: "hover:bg-blue-700" },
              ].map(({ icon: Icon, label, hover }) => (
                <button
                  key={label}
                  aria-label={label}
                  className={`w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200 ${hover}`}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-emerald-400 text-sm uppercase tracking-wider">Discover</h4>
            <div className="flex flex-col gap-3">
              <button onClick={() => setPage("howitworks")} className="text-slate-300 hover:text-emerald-300 text-sm text-left transition-colors">How it Works</button>
              <button onClick={() => setPage("buyers")} className="text-slate-300 hover:text-emerald-300 text-sm text-left transition-colors">Browse Items</button>
              <button onClick={() => setPage("buyers")} className="text-slate-300 hover:text-emerald-300 text-sm text-left transition-colors">For Buyers</button>
              <button onClick={() => setPage("sellers")} className="text-slate-300 hover:text-emerald-300 text-sm text-left transition-colors">For Sellers</button>
              <button onClick={() => setPage("howitworks")} className="text-slate-300 hover:text-emerald-300 text-sm text-left transition-colors">Active Drops</button>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-amber-400 text-sm uppercase tracking-wider">For Sellers</h4>
            <div className="flex flex-col gap-3">
              <button onClick={() => goSellerAuth("signup")} className="text-slate-300 hover:text-amber-300 text-sm text-left transition-colors">Weekly Drop</button>
              <button onClick={() => goMovingAuth("signup")} className="text-slate-300 hover:text-amber-300 text-sm text-left transition-colors">Moving Sale</button>
              <button className="text-slate-300 hover:text-amber-300 text-sm text-left transition-colors">Seller FAQ</button>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-emerald-400 text-sm uppercase tracking-wider">Company</h4>
            <div className="flex flex-col gap-3">
              <button onClick={() => setPage("about")} className="text-slate-300 hover:text-emerald-300 text-sm text-left transition-colors">About Us</button>
              <button onClick={() => setPage("contact")} className="text-slate-300 hover:text-emerald-300 text-sm text-left transition-colors">Contact Us</button>
              <button className="text-slate-300 hover:text-emerald-300 text-sm text-left transition-colors">FAQ</button>
              <button className="text-slate-300 hover:text-emerald-300 text-sm text-left transition-colors">Guidelines</button>
              <button className="text-slate-300 hover:text-emerald-300 text-sm text-left transition-colors">Privacy Policy</button>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-emerald-400 text-sm uppercase tracking-wider">Join Free</h4>
            <div className="flex flex-col gap-3">
              <button onClick={() => goBuyerAuth("signup")} className="text-slate-300 hover:text-white text-sm text-left transition-colors">Sign up</button>
              <button onClick={() => goBuyerAuth("login")} className="text-slate-300 hover:text-white text-sm text-left transition-colors">Log in</button>
              <button className="text-slate-300 hover:text-white text-sm text-left transition-colors">Help Center</button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">© 2025 DropYard. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm">
            <span className="text-slate-400 hover:text-emerald-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-slate-400 hover:text-amber-300 cursor-pointer transition-colors">Terms of Service</span>
            <span className="text-slate-400 hover:text-emerald-300 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function HowItWorksPage({
  goBuyerAuth,
  goSellerAuth,
  setPage,
}: {
  goBuyerAuth: (mode?: "signup" | "login") => void;
  goSellerAuth: (mode?: "signup" | "login") => void;
  setPage: (p: string) => void;
}) {
  return (
    <div>
      <section className="pt-6 md:pt-8 pb-8 md:pb-12 bg-gradient-to-br from-emerald-50 via-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">A simple weekly rhythm to keep value local</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 ring-1 ring-black/5 hover:shadow-2xl transition-shadow duration-300">
              {/* Header */}
              <div className="grid grid-cols-5 md:grid-cols-12 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white">
                <div className="col-span-2 md:col-span-3 px-4 md:px-6 py-4 font-semibold text-sm md:text-base tracking-wide uppercase">Day</div>
                <div className="col-span-3 md:col-span-9 px-4 md:px-6 py-4 font-semibold text-sm md:text-base tracking-wide uppercase">
                  What Happens
                </div>
              </div>

              {/* Row 1 - Monday-Wednesday */}
              <div className="grid grid-cols-5 md:grid-cols-12 border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-200 group border-l-4 border-l-blue-400">
                <div className="col-span-2 md:col-span-3 px-4 md:px-6 py-4 md:py-5 font-semibold text-gray-900 text-xs md:text-base flex items-center group-hover:text-blue-800 transition-colors">
                  Monday–Wednesday
                </div>
                <div className="col-span-3 md:col-span-9 px-4 md:px-6 py-4 md:py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-sm">
                      📦
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm md:text-base">Sellers upload items</div>
                      <div className="text-xs md:text-sm text-blue-700 font-medium">Submission window</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2 - Thursday */}
              <div className="grid grid-cols-5 md:grid-cols-12 border-b border-gray-100 hover:bg-purple-50/50 transition-all duration-200 group border-l-4 border-l-purple-400">
                <div className="col-span-2 md:col-span-3 px-4 md:px-6 py-4 md:py-5 font-semibold text-gray-900 text-xs md:text-base flex items-center group-hover:text-purple-800 transition-colors">
                  Thursday
                </div>
                <div className="col-span-3 md:col-span-9 px-4 md:px-6 py-4 md:py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-sm">
                      👀
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm md:text-base">
                        Submission closes, items enter &quot;Preview&quot;
                      </div>
                      <div className="text-xs md:text-sm text-purple-700 font-medium">Browse begins</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3 - Thursday-Friday */}
              <div className="grid grid-cols-5 md:grid-cols-12 border-b border-gray-100 hover:bg-purple-50/50 transition-all duration-200 group border-l-4 border-l-purple-400">
                <div className="col-span-2 md:col-span-3 px-4 md:px-6 py-4 md:py-5 font-semibold text-gray-900 text-xs md:text-base flex items-center group-hover:text-purple-800 transition-colors">
                  Thursday–Friday
                </div>
                <div className="col-span-3 md:col-span-9 px-4 md:px-6 py-4 md:py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-sm">
                      💜
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm md:text-base">
                        Buyers browse, save favorites, get alerts
                      </div>
                      <div className="text-xs md:text-sm text-purple-700 font-medium">Preview mode</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4 - Saturday 8am - THE MAIN EVENT */}
              <div className="grid grid-cols-5 md:grid-cols-12 border-b border-gray-100 bg-gradient-to-r from-emerald-50 via-amber-50/80 to-emerald-50 border-l-4 border-l-amber-500 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-200/10 to-emerald-200/10" />
                <div className="col-span-2 md:col-span-3 px-4 md:px-6 py-4 md:py-5 font-bold text-emerald-800 text-xs md:text-base flex items-center relative z-10">
                  Saturday 8am
                </div>
                <div className="col-span-3 md:col-span-9 px-4 md:px-6 py-4 md:py-5 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-200 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ring-2 ring-amber-400 ring-offset-2 shadow-md animate-pulse">
                      🔔
                    </div>
                    <div>
                      <div className="font-bold text-emerald-800 text-base md:text-lg flex items-center gap-2">
                        DROP GOES LIVE—claiming opens
                        <span className="inline-flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                      </div>
                      <div className="text-xs md:text-sm text-emerald-700 font-semibold">The main event!</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 5 - Saturday-Sunday */}
              <div className="grid grid-cols-5 md:grid-cols-12 border-b border-gray-100 hover:bg-emerald-50/50 transition-all duration-200 group border-l-4 border-l-emerald-500">
                <div className="col-span-2 md:col-span-3 px-4 md:px-6 py-4 md:py-5 font-semibold text-gray-900 text-xs md:text-base flex items-center group-hover:text-emerald-800 transition-colors">
                  Saturday–Sunday
                </div>
                <div className="col-span-3 md:col-span-9 px-4 md:px-6 py-4 md:py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-sm">
                      🛒
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm md:text-base">
                        48-hour claim & pickup window
                      </div>
                      <div className="text-xs md:text-sm text-emerald-700 font-medium">Claim items, coordinate pickup</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 6 - Sunday 8pm */}
              <div className="grid grid-cols-5 md:grid-cols-12 hover:bg-gray-50 transition-all duration-200 group border-l-4 border-l-gray-300">
                <div className="col-span-2 md:col-span-3 px-4 md:px-6 py-4 md:py-5 font-semibold text-gray-900 text-xs md:text-base flex items-center group-hover:text-gray-700 transition-colors">
                  Sunday 8pm
                </div>
                <div className="col-span-3 md:col-span-9 px-4 md:px-6 py-4 md:py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-sm">
                      🔒
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm md:text-base">
                        Drop closes, unclaimed items return to sellers
                      </div>
                      <div className="text-xs md:text-sm text-gray-600 font-medium">Reset for next week</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2 md:gap-3 text-xs flex-wrap justify-center">
                <span className="px-3 md:px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium hover:bg-blue-200 transition-colors cursor-default">Submit</span>
                <ChevronRight size={16} className="text-blue-300" />
                <span className="px-3 md:px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-medium hover:bg-purple-200 transition-colors cursor-default">
                  Preview
                </span>
                <ChevronRight size={16} className="text-purple-300" />
                <span className="px-3 md:px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-medium flex items-center gap-1.5 hover:bg-emerald-200 transition-colors cursor-default border border-emerald-200">
                  <span className="text-amber-500">🔔</span> Live Drop
                </span>
                <ChevronRight size={16} className="text-gray-300" />
                <span className="px-3 md:px-4 py-2 bg-gray-100 text-gray-600 rounded-full font-medium hover:bg-gray-200 transition-colors cursor-default">Close</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 bg-white">
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
    </div>
  );
}

// AuthFlow and SuccessScreen removed - auth is handled by /join page

// ============================================================================
// SOCIAL SIDEBAR
// ============================================================================
