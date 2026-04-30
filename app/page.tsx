"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import DynamicDropCard from "@/components/previews/DynamicDropCard";
import SearchHeroRedesign from "@/components/previews/SearchHeroRedesign";
import { motion } from "framer-motion";
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
  CalendarDays,
  MapPinned,
  BadgeDollarSign,
  TimerReset,
  MessageCircleQuestion,
  CheckCircle2,
  Zap,
  Clock3,
  AlertTriangle,
  Ban,
  Grid2x2,
  LampFloor,
  Smartphone,
  CookingPot,
  Baby,
  Shirt,
  Dumbbell,
  Wrench,
  HelpCircle,
  FileText,
  ShieldCheck,
  X,
  Bell,
  Heart,
  Search,
  ChevronDown,
  TrendingUp,
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
    large: { container: "h-20 w-auto" },
  };
  const s = sizes[size] || sizes.default;

  return (
    <div className={`${s.container} relative flex items-center justify-center`}>
      <img src="/Logo.png" alt="DropYard logo" className="h-full w-auto object-contain scale-150" />
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
  { name: "All Items",   items: 156, icon: Grid2x2,    href: "#", image: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&w=900&q=80", gradient: "from-emerald-50/95 via-white to-green-100/95",  iconWrap: "bg-emerald-500/10 text-emerald-700 ring-emerald-200", border: "border-emerald-200/80", title: "text-emerald-900", badge: "Popular", featured: true  },
  { name: "Furniture",   items: 34,  icon: LampFloor,  href: "#", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80", gradient: "from-orange-50/95 via-white to-amber-100/95",   iconWrap: "bg-orange-500/10 text-orange-700 ring-orange-200",   border: "border-orange-200/80", title: "text-orange-900"  },
  { name: "Electronics", items: 28,  icon: Smartphone, href: "#", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80", gradient: "from-blue-50/95 via-white to-indigo-100/95",    iconWrap: "bg-blue-500/10 text-blue-700 ring-blue-200",         border: "border-blue-200/80",   title: "text-blue-900"   },
  { name: "Kitchen",     items: 22,  icon: CookingPot, href: "#", image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80", gradient: "from-amber-50/95 via-white to-yellow-100/95",  iconWrap: "bg-amber-500/10 text-amber-700 ring-amber-200",       border: "border-amber-200/80",  title: "text-amber-900"  },
  { name: "Kids & Baby", items: 31,  icon: Baby,       href: "#", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80", gradient: "from-pink-50/95 via-white to-rose-100/95",     iconWrap: "bg-pink-500/10 text-pink-700 ring-pink-200",          border: "border-pink-200/80",   title: "text-pink-900"   },
  { name: "Clothing",    items: 18,  icon: Shirt,      href: "#", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80", gradient: "from-violet-50/95 via-white to-purple-100/95", iconWrap: "bg-violet-500/10 text-violet-700 ring-violet-200",    border: "border-violet-200/80", title: "text-violet-900" },
  { name: "Sports",      items: 12,  icon: Dumbbell,   href: "#", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80", gradient: "from-lime-50/95 via-white to-green-100/95",    iconWrap: "bg-lime-500/10 text-green-700 ring-green-200",        border: "border-green-200/80",  title: "text-green-900"  },
  { name: "Tools",       items: 11,  icon: Wrench,     href: "#", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80", gradient: "from-slate-50/95 via-white to-gray-100/95",    iconWrap: "bg-slate-500/10 text-slate-700 ring-slate-200",       border: "border-slate-200/80",  title: "text-slate-900"  },
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
// CATEGORY CARD + SECTION
// ============================================================================
function CategoryCard({ category, onNavigate }: { category: typeof CATEGORIES[0]; onNavigate: () => void }) {
  const Icon = category.icon;
  return (
    <motion.button
      variants={{ hidden: { opacity: 0, y: 24, scale: 0.97 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.985 }}
      onClick={onNavigate}
      className={`group relative overflow-hidden rounded-[30px] border ${category.border} bg-gradient-to-br ${category.gradient} shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:shadow-[0_22px_55px_rgba(15,23,42,0.14)] text-left ${category.featured ? "ring-2 ring-emerald-200/70" : ""}`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/40 blur-2xl opacity-0 transition duration-500 group-hover:opacity-100" />
      </div>
      <div className="relative p-3 pb-0">
        <div className="relative h-40 overflow-hidden rounded-[24px] sm:h-44">
          <motion.img
            src={category.image}
            alt={category.name}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-slate-900/5 to-white/0" />
          {category.featured && (
            <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700 shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              {category.badge}
            </div>
          )}
          <motion.div
            whileHover={{ scale: 1.08, rotate: -4 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className={`absolute bottom-3 left-3 flex h-12 w-12 items-center justify-center rounded-2xl ring-1 backdrop-blur-md ${category.iconWrap} shadow-lg sm:h-14 sm:w-14`}
          >
            <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.1} />
          </motion.div>
        </div>
      </div>
      <div className="relative p-5 pt-4 sm:p-6 sm:pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className={`text-lg font-bold tracking-tight sm:text-xl ${category.title}`}>{category.name}</h3>
            <p className="mt-2 text-sm font-medium text-slate-500 sm:text-[15px]">{category.items} items available</p>
          </div>
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/85 text-slate-500 shadow-sm ring-1 ring-black/5 transition group-hover:text-slate-800">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function CategorySection({ onNavigate }: { onNavigate: () => void }) {
  return (
    <section className="relative overflow-hidden bg-[#f7faf8] py-8 md:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-8 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute right-[-120px] top-12 h-72 w-72 rounded-full bg-orange-100/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-lime-100/30 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/85 px-3.5 py-1.5 text-sm font-medium text-emerald-700 shadow-sm ring-1 ring-emerald-100 backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Shop by category
            </div>
            <h2 className="text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">Browse by Category</h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Explore curated categories and discover great local finds faster on DropYard.
            </p>
          </div>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNavigate}
            className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
          >
            View All <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.div>
        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5"
        >
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.name} category={cat} onNavigate={onNavigate} />
          ))}
        </motion.div>
      </div>
    </section>
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
  { name: "Kanata", interested: 84, trend: "+12 this week" },
  { name: "Orléans", interested: 67, trend: "+9 this week" },
  { name: "Nepean", interested: 53, trend: "+7 this week" },
  { name: "Stittsville", interested: 41, trend: "+5 this week" },
  { name: "Gloucester", interested: 38, trend: "+4 this week" },
  { name: "Westboro", interested: 29, trend: "+3 this week" },
];
const MAX_HOOD_INTEREST = Math.max(...COMING_SOON_HOODS.map((n) => n.interested));

function WaitlistCard({ area, isSelected, onSelect }: {
  area: typeof COMING_SOON_HOODS[0];
  isSelected: boolean;
  onSelect: (name: string) => void;
}) {
  const pct = Math.max(18, Math.round((area.interested / MAX_HOOD_INTEREST) * 100));
  return (
    <motion.button
      type="button"
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onSelect(area.name)}
      className={`group relative overflow-hidden rounded-[28px] border p-5 text-left transition-all duration-300 sm:p-6 ${
        isSelected
          ? "border-amber-300 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-[0_18px_45px_rgba(245,158,11,0.16)]"
          : "border-slate-200/80 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:border-amber-200 hover:shadow-[0_18px_38px_rgba(15,23,42,0.10)]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition-opacity duration-300 ${isSelected ? "bg-amber-200/45 opacity-100" : "bg-slate-100 opacity-0 group-hover:opacity-100"}`} />
      </div>
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">{area.name}</h3>
            <p className="mt-1 text-base text-slate-500">{area.interested} people interested</p>
          </div>
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 transition-all ${
            isSelected
              ? "bg-amber-500 text-white ring-amber-300"
              : "bg-slate-50 text-slate-400 ring-slate-200 group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:ring-amber-200"
          }`}>
            {isSelected ? <Check className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-slate-500">Demand level</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">
              <TrendingUp className="h-3.5 w-3.5" />
              {area.trend}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={`h-full rounded-full ${isSelected ? "bg-gradient-to-r from-amber-400 to-orange-500" : "bg-gradient-to-r from-amber-300 to-amber-500"}`}
            />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function NeighbourhoodWaitlistSection() {
  const [selectedArea, setSelectedArea] = useState("Kanata");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const selected = COMING_SOON_HOODS.find((n) => n.name === selectedArea);

  return (
    <section className="relative overflow-hidden bg-[#f8faf8] py-8 md:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-14 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute right-[-8%] bottom-10 h-72 w-72 rounded-full bg-emerald-100/35 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm">
            <MapPin className="h-4 w-4" />
            Expanding across Ottawa
          </div>
          <h2 className="text-balance text-4xl font-bold tracking-[-0.045em] text-slate-950 sm:text-5xl">
            Not in Barrhaven? <span className="text-amber-600">We&apos;re coming to you.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Join the waitlist for your neighbourhood and be first to know when a local Drop goes live near you.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 xl:grid-cols-[1.45fr_0.9fr] xl:items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[34px] border border-slate-200/80 bg-white/80 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-5 lg:p-6"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-emerald-50/70 to-transparent" />
              <div className="absolute -left-10 top-12 h-44 w-44 rounded-full bg-emerald-100/35 blur-3xl" />
              <div className="absolute right-0 top-16 h-52 w-52 rounded-full bg-amber-100/30 blur-3xl" />
            </div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } } }}
              className="relative grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3"
            >
              {COMING_SOON_HOODS.map((area) => (
                <WaitlistCard
                  key={area.name}
                  area={area}
                  isSelected={selectedArea === area.name}
                  onSelect={setSelectedArea}
                />
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="sticky top-8 overflow-hidden rounded-[34px] border border-amber-200/70 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 shadow-[0_18px_50px_rgba(245,158,11,0.14)] sm:p-7"
          >
            <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-amber-200/35 blur-3xl" />
            <div className="relative">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-sm ring-1 ring-amber-200">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold tracking-[-0.03em] text-slate-950">
                Notify me for {selected?.name}
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Join the waitlist and be first to know when DropYard launches in your neighbourhood.
              </p>
              <div className="mt-6 rounded-2xl border border-amber-200 bg-white/85 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Current interest</p>
                    <p className="mt-1 text-2xl font-bold text-slate-950">{selected?.interested} people</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700">
                    <TrendingUp className="h-4 w-4" />
                    {selected?.trend}
                  </span>
                </div>
              </div>
              {!submitted ? (
                <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }}>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">Email address</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-300 focus:ring-4 focus:ring-amber-100"
                    />
                  </label>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-base font-semibold text-white transition hover:bg-slate-800"
                  >
                    Notify Me
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                  <CheckCircle className="mx-auto mb-2 h-7 w-7 text-emerald-500" />
                  <p className="font-semibold text-slate-900">You&apos;re on the {selected?.name} waitlist!</p>
                  <p className="mt-1 text-sm text-slate-600">We&apos;ll email you at {email} when the {selected?.name} Drop goes live.</p>
                </div>
              )}
              <p className="mt-4 text-sm leading-6 text-slate-500">
                You&apos;ll only get launch updates for <span className="font-semibold text-slate-700">{selected?.name}</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// HOW IT WORKS ILLUSTRATIONS
// ============================================================================
// SPLIT NARRATIVE SECTION
// ============================================================================
const OLD_WAY = [
  { title: "Ghosted again and again",               description: "Too many conversations go nowhere after the first message.", icon: Ban },
  { title: '"Is this still available?" on repeat',  description: "Endless low-intent messages slow everything down.",          icon: MessageCircleQuestion },
  { title: "Scam risk and uncertainty",             description: "Buyers and sellers often deal with strangers and mixed signals.", icon: AlertTriangle },
  { title: "Stale listings that never expire",      description: "What looks available is often already gone.",                icon: Clock3 },
];
const DROPYARD_WAY = [
  { title: "Claim during live Drops",           description: "Real-time intent replaces empty promises and endless back-and-forth.", icon: Zap },
  { title: "If it's listed, it's available",    description: "Live Drop structure removes the guesswork and the DM chase.",          icon: CheckCircle2 },
  { title: "Neighbourhood-verified sellers",    description: "Built for local trust, accountability, and safer exchanges.",           icon: ShieldCheck },
  { title: "Auto-expiring listings",            description: "Fresh inventory only. No clutter. No dead listings hanging around.",    icon: TimerReset },
];

function NarrativeItem({ entry, tone }: { entry: typeof OLD_WAY[0]; tone: "old" | "new" }) {
  const Icon = entry.icon;
  const styles = tone === "old"
    ? { wrap: "border-white/70 bg-white/70", icon: "bg-rose-50 text-rose-500 ring-rose-100", desc: "text-slate-500" }
    : { wrap: "border-emerald-100/80 bg-white/78", icon: "bg-emerald-50 text-emerald-600 ring-emerald-100", desc: "text-slate-600" };
  return (
    <div className={`group flex h-full gap-4 rounded-2xl border p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(15,23,42,0.09)] sm:p-5 ${styles.wrap}`}>
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ${styles.icon}`}>
        <Icon className="h-5 w-5" strokeWidth={2.1} />
      </div>
      <div>
        <h4 className="text-base font-semibold leading-6 text-slate-900">{entry.title}</h4>
        <p className={`mt-1 text-sm leading-6 ${styles.desc}`}>{entry.description}</p>
      </div>
    </div>
  );
}

function SplitNarrativeSection() {
  return (
    <section className="relative overflow-hidden bg-[#f8faf8] py-8 md:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-24 h-80 w-80 rounded-full bg-rose-100/50 blur-3xl" />
        <div className="absolute right-[-6%] top-16 h-96 w-96 rounded-full bg-emerald-100/55 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/85 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4" />
            A better local marketplace
          </div>
          <h2 className="text-balance text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Buying and selling locally shouldn&apos;t feel like a gamble.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            DropYard replaces chaos with structure — real intent, cleaner listings,
            and a neighbourhood-first marketplace experience.
          </p>
        </motion.div>

        <div className="relative overflow-hidden rounded-[36px] border border-slate-200/70 bg-white/65 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.07)] backdrop-blur-sm sm:p-6 lg:p-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-br from-rose-50/75 via-white/20 to-transparent" />
            <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-bl from-emerald-50/80 via-white/20 to-transparent" />
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-slate-200 to-transparent lg:block" />
            <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-rose-100/45 blur-3xl" />
            <div className="absolute -right-10 top-10 h-36 w-36 rounded-full bg-emerald-100/45 blur-3xl" />
          </div>

          {/* Column headers */}
          <div className="relative mb-6 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-5">
            <div className="rounded-[28px] border border-rose-100/80 bg-gradient-to-br from-rose-50 via-white to-orange-50 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-rose-500 shadow-sm ring-1 ring-rose-100">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">The old way</p>
                  <p className="mt-1 text-sm text-slate-500">Friction, uncertainty, and too much wasted time.</p>
                </div>
              </div>
            </div>
            <div className="hidden items-center justify-center lg:flex">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
                <ArrowRight className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="rounded-[28px] border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-lime-50 p-5 shadow-[0_16px_40px_rgba(16,185,129,0.08)] sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">The DropYard way</p>
                  <p className="mt-1 text-sm text-slate-600">Structured, trust-first, and designed for real local exchange.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison rows */}
          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
            className="relative space-y-4"
          >
            {OLD_WAY.map((entry, index) => (
              <motion.div
                key={entry.title}
                variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
                className="relative grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:gap-5"
              >
                <NarrativeItem entry={entry} tone="old" />
                <div className="hidden items-center justify-center lg:flex">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                    <ArrowRight className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>
                <NarrativeItem entry={DROPYARD_WAY[index]} tone="new" />
                {index < OLD_WAY.length - 1 && (
                  <div className="pointer-events-none absolute left-1/2 top-full hidden h-5 w-px -translate-x-1/2 bg-gradient-to-b from-slate-200 to-transparent lg:block" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-10 max-w-4xl text-center"
        >
          <p className="text-xl font-medium italic tracking-[-0.02em] text-slate-700 sm:text-2xl">
            &quot;DropYard isn&apos;t trying to be a better version of the old model. It&apos;s built to work differently from the start.&quot;
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// COMMUNITY METRICS SECTION
// ============================================================================
const COMMUNITY_STATS = [
  { value: "Fresh", label: "Every weekend", icon: CalendarDays, accent: "text-emerald-700", iconBg: "bg-emerald-50", border: "border-emerald-100", glow: "from-emerald-100/80 to-green-50/40" },
  { value: "0%",    label: "Strangers",     icon: ShieldCheck,     accent: "text-amber-600",  iconBg: "bg-amber-50",   border: "border-amber-100",   glow: "from-amber-100/80 to-orange-50/40" },
  { value: "100%",  label: "Local",         icon: MapPinned,       accent: "text-emerald-700", iconBg: "bg-lime-50",    border: "border-lime-100",    glow: "from-lime-100/80 to-green-50/40" },
  { value: "$0",    label: "To list",       icon: BadgeDollarSign, accent: "text-emerald-700", iconBg: "bg-emerald-50", border: "border-emerald-100", glow: "from-emerald-100/80 to-yellow-50/40" },
];

function CommunityMetricsSection() {
  return (
    <section className="relative overflow-hidden bg-[#f8faf8] py-8 md:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-14 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute right-[-8%] bottom-8 h-72 w-72 rounded-full bg-amber-100/35 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/90 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Community-first marketplace
          </div>
          <h2 className="text-balance text-4xl font-bold tracking-[-0.045em] text-slate-950 sm:text-5xl">
            Built for communities, <span className="text-emerald-700">not crowds.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            DropYard brings back the simplicity of yard sales without the hassle —
            no ghosting, fewer risks, and a cleaner local buying experience.
          </p>
        </motion.div>

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {COMMUNITY_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -6 }}
                className={`group relative overflow-hidden rounded-[28px] border ${stat.border} bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)] sm:p-7`}
              >
                <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${stat.glow} opacity-70`} />
                <div className="relative flex h-full flex-col">
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${stat.iconBg} ring-1 ring-black/5`}>
                    <Icon className={`h-7 w-7 ${stat.accent}`} strokeWidth={2.1} />
                  </div>
                  <div className="space-y-2">
                    <h3 className={`text-4xl font-bold tracking-[-0.04em] ${stat.accent}`}>{stat.value}</h3>
                    <p className="text-lg font-medium text-slate-700">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mt-10 flex justify-center"
        >
          <a
            href="/how-it-works"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
          >
            Explore how DropYard works
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
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
        className="py-8 md:py-12 font-sans bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-amber-400 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-emerald-400 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-300 blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 w-full relative z-10">
          <div className="text-center mb-14">
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

          <div className="hidden lg:block relative max-w-3xl lg:max-w-4xl mx-auto">
            <div className="absolute top-[100px] left-[8%] right-[8%] h-0.5 overflow-hidden z-0">
              <div className={`h-full bg-amber-400/50 step-line ${visible ? "animate" : ""}`}></div>
            </div>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`absolute top-[97px] w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50 step-dot ${visible ? "animate" : ""}`}
                style={{ left: `${14 + i * 25}%`, animationDelay: `${0.6 + i * 0.25}s` }}
              ></div>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-w-3xl lg:max-w-4xl mx-auto">
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
                {step.num === 3 && (
                  <div className="flex items-center justify-center gap-1.5 mt-2 py-1.5 px-3 rounded-lg mx-auto w-fit" style={{ backgroundColor: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.25)" }}>
                    <span className="text-amber-300 text-xs font-semibold">The Shelf is always open</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div
            className={`mt-8 py-4 px-5 rounded-2xl flex items-center justify-center gap-3 flex-wrap max-w-3xl lg:max-w-4xl mx-auto header-anim ${visible ? "animate" : ""}`}
            style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", animationDelay: "1s" }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <span style={{ fontSize: 18 }}>📚</span>
            </div>
            <p className="text-white/70 text-sm flex-1" style={{ minWidth: 260 }}>
              <span className="text-white font-bold">Missed the Drop?</span>{" "}
              Items are always available on the Shelf — browse and claim anytime between Drops.
            </p>
            <button
              className="flex items-center gap-1.5 py-2 px-4 rounded-lg text-white text-xs font-bold flex-shrink-0 transition-transform hover:scale-105"
              style={{ backgroundColor: "#F08A00" }}
            >
              Browse the Shelf
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================
const BRAND_GREEN = "#059669";
const BRAND_ORANGE = "#f59e0b";

const HERO_NEIGHBORHOODS = [
  { name: "Barrhaven", status: "live" },
  { name: "Kanata", status: "coming_soon" },
  { name: "Nepean", status: "coming_soon" },
  { name: "Orléans", status: "coming_soon" },
  { name: "Stittsville", status: "coming_soon" },
];

const HERO_QUICK_FILTERS = ["Furniture", "Electronics", "Kids & Baby", "Kitchen", "Sports", "Clothing"];

function HeroSearchIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function HeroMapPinIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z" /><circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}
function HeroChevronDownIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function HeroSection({ goBuyerAuth }: { goBuyerAuth: (mode?: "signup" | "login") => void }) {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src="/images/hero-bg.jpg" alt="Neighbourhood yard sale" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-white/20" />
      </div>

      <div className="relative w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT — Text */}
          <div>
            {/* Live badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-300 animate-ping opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
              </span>
              Now live in Barrhaven
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.08] sm:text-6xl lg:text-7xl">
              Barrhaven<br />
              neighbourhood<br />
              <span className="text-emerald-700 whitespace-nowrap">yardsale — Online.</span>
            </h1>

            <p className="mt-5 text-xl text-gray-600 max-w-md leading-relaxed whitespace-nowrap">
              Buy and sell locally through curated weekend Drops.
            </p>
            <p className="mt-1 text-emerald-700 font-semibold text-lg">From one home to another.™</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => goBuyerAuth("signup")}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-7 py-4 text-base font-bold text-white shadow-lg hover:bg-emerald-800 transition-all hover:-translate-y-0.5"
              >
                Browse the Barrhaven Drop <ArrowRight size={18} />
              </button>
              <button
                onClick={() => goBuyerAuth("signup")}
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-4 text-base font-bold text-white shadow-lg hover:bg-amber-600 transition-all hover:-translate-y-0.5"
              >
                Sell with DropYard <ArrowRight size={18} />
              </button>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Already have an account?{" "}
              <button onClick={() => goBuyerAuth("login")} className="text-emerald-700 font-semibold hover:underline">
                Log in
              </button>
            </p>
          </div>

          {/* RIGHT — Dynamic Drop card */}
          <div className="hidden lg:block scale-[1.21] origin-top-right -translate-y-10 translate-x-6">
            <DynamicDropCard />
          </div>

        </div>
      </div>
    </section>
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
      <HeroSection goBuyerAuth={goBuyerAuth} />

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
      <SearchHeroRedesign />

      {/* Browse by Category */}
      <CategorySection onNavigate={() => goBuyerAuth("signup")} />

      {/* Coming Soon — Neighbourhood Waitlist */}
      <NeighbourhoodWaitlistSection />


      {/* Community Metrics Section */}
      <CommunityMetricsSection />

      {/* Split Narrative Section */}
      <SplitNarrativeSection />



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
