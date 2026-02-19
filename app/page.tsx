"use client";

import React, { useEffect, useState } from "react";
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
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
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
      <SocialSidebar position="left" />
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
      <section
        className="relative min-h-[89vh] flex items-start pt-0 pb-0 md:pt-0 md:pb-0"
        style={{
          backgroundImage: "url('/images/hero_background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-6 py-2 rounded-full text-sm md:text-base font-semibold mb-8 shadow-sm">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Now live in your neighborhood
              </div>
              <h1 className="font-brand text-[1.65rem] md:text-[2.475rem] lg:text-[3.3rem] font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                Your community&apos;s
                <span className="block text-emerald-600">yard sale-online.</span>
              </h1>
              <p className="font-brand text-base md:text-lg lg:text-xl text-slate-600 mb-10 max-w-2xl">
                Buy and sell locally through curated weekend Drops.
                <span className="block text-emerald-600 font-semibold mt-3">From one home to another.</span>
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

            <div className="flex items-center justify-center lg:justify-end h-full">
              <div className="w-full max-w-xl lg:max-w-2xl">
                <div className="h-80 md:h-[30rem] lg:h-[36rem]">
                  <img
                    src="/hero_right.png"
                    alt="DropYard hero"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-emerald-800 text-white py-4 -mt-8 md:-mt-12 relative z-10">
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

      <section className="pt-8 pb-10 md:pt-10 md:pb-14 bg-gradient-to-br from-emerald-50 via-white to-amber-50">
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

      <section className="pt-6 pb-10 md:pt-12 md:pb-24 bg-gradient-to-b from-amber-50 via-white to-emerald-50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Built for everyone</h2>
            <p className="text-lg text-emerald-700">Whether you&apos;re buying or selling, <span className="font-semibold">DropYard</span> has you covered</p>
          </div>
        </div>
      </section>

      {/* For Buyers Section */}
      <section className="-mt-20 pt-0 pb-10 md:-mt-24 md:pt-0 md:pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <div className="relative">
                <div className="relative mb-4 md:mb-8">
                  <figure className="relative z-10">
                    <img src="/images/img1.png" alt="" className="w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg h-auto max-h-[12.8rem] sm:max-h-[14.4rem] md:max-h-[16rem] lg:max-h-[19.2rem] rounded-lg shadow-lg object-cover" />
                  </figure>
                </div>
                <div className="relative -mt-8 sm:-mt-12 md:-mt-16 ml-4 sm:ml-8 md:ml-16">
                  <figure className="relative z-20">
                    <img src="/images/img2.png" alt="" className="w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg h-auto max-h-[12.8rem] sm:max-h-[14.4rem] md:max-h-[16rem] lg:max-h-[19.2rem] rounded-lg shadow-lg object-cover" />
                  </figure>
                </div>
                <div className="absolute top-1/4 right-2 sm:right-4 transform -translate-y-1/2 z-30 animate-spin" style={{ animationDuration: '30s' }}>
                  <img src="/images/contact-us-img.svg" alt="" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" />
                </div>
              </div>
            </div>
            
            <div className="-mt-4 md:-mt-6">
              <div className="mb-8 text-center md:text-left">
                <h3 className="text-lg text-emerald-600 mb-2">For Buyers</h3>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop locally from trusted neighbors</h2>
                <p className="text-emerald-700 text-lg">Whether you&apos;re buying or selling, <span className="font-semibold">DropYard</span> has you covered</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-6 text-center md:text-left">
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                      <ShoppingBag size={28} className="text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Fair, clear pricing</h3>
                    <p className="text-gray-600">No haggling, no bidding wars—just simple, scheduled pickup times.</p>
                  </div>
                  <div>
                    <button
                      onClick={() => goBuyerAuth("signup")}
                      className="w-full bg-emerald-700 text-white py-3 px-6 rounded-full font-semibold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
                    >
                      Browse the Next Drop
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="mb-6 text-center md:text-left">
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                      <User size={28} className="text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">Shop locally</h3>
                      <p className="text-gray-600">From neighbors</p>
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <ul className="space-y-2 inline-block md:block">
                      <li className="flex items-center gap-2 justify-center md:justify-start">
                        <Check size={16} className="text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-700">Shop locally from trusted neighbors</span>
                      </li>
                      <li className="flex items-center gap-2 justify-center md:justify-start">
                        <Check size={16} className="text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-700">Fair, clear pricing—no haggling</span>
                      </li>
                      <li className="flex items-center gap-2 justify-center md:justify-start">
                        <Check size={16} className="text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-700">No bidding wars</span>
                      </li>
                      <li className="flex items-center gap-2 justify-center md:justify-start">
                        <Check size={16} className="text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-700">Simple, scheduled pickup times</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Sellers Section */}
      <section className="-mt-8 pt-12 pb-8 md:-mt-10 md:pt-14 md:pb-12 bg-gradient-to-br from-amber-50 via-amber-50/80 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-1 lg:order-1 -mt-4 md:-mt-6">
              <div className="mb-8 text-center md:text-left">
                <h3 className="text-lg text-amber-600 mb-2">For Sellers</h3>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Declutter easily in one weekend</h2>
                <p className="text-emerald-700 text-lg">Whether you&apos;re buying or selling, <span className="font-semibold">DropYard</span> has you covered</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-6 text-center md:text-left">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                      <Package size={28} className="text-amber-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Simple, fast payouts</h3>
                    <p className="text-gray-600">No endless messages or listings—sell to neighbors, not strangers.</p>
                  </div>
                  <div>
                    <button
                      onClick={() => goSellerAuth("signup")}
                      className="w-full bg-amber-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                    >
                      Become a Seller
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="mb-6 text-center md:text-left">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                      <User size={28} className="text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">Sell easily</h3>
                      <p className="text-gray-600">To neighbors</p>
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <ul className="space-y-2 inline-block md:block">
                      <li className="flex items-center gap-2 justify-center md:justify-start">
                        <Check size={16} className="text-amber-500 flex-shrink-0" />
                        <span className="text-gray-700">Declutter easily in one weekend</span>
                      </li>
                      <li className="flex items-center gap-2 justify-center md:justify-start">
                        <Check size={16} className="text-amber-500 flex-shrink-0" />
                        <span className="text-gray-700">No endless messages or listings</span>
                      </li>
                      <li className="flex items-center gap-2 justify-center md:justify-start">
                        <Check size={16} className="text-amber-500 flex-shrink-0" />
                        <span className="text-gray-700">Sell to neighbors, not strangers</span>
                      </li>
                      <li className="flex items-center gap-2 justify-center md:justify-start">
                        <Check size={16} className="text-amber-500 flex-shrink-0" />
                        <span className="text-gray-700">Simple, fast payouts</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative order-2 lg:order-2">
              <div className="relative">
                <div className="relative mb-4 md:mb-8 ml-4 sm:ml-8 md:ml-16">
                  <figure className="relative z-10">
                    <img src="/images/img1.png" alt="" className="w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg h-auto max-h-[12.8rem] sm:max-h-[14.4rem] md:max-h-[16rem] lg:max-h-[19.2rem] rounded-lg shadow-lg object-cover" />
                  </figure>
                </div>
                <div className="relative -mt-8 sm:-mt-12 md:-mt-16 ml-0">
                  <figure className="relative z-20">
                    <img src="/images/img2.png" alt="" className="w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg h-auto max-h-[12.8rem] sm:max-h-[14.4rem] md:max-h-[16rem] lg:max-h-[19.2rem] rounded-lg shadow-lg object-cover" />
                  </figure>
                  <div className="absolute top-1/2 right-0 sm:right-2 md:right-4 transform -translate-y-1/2 z-30 animate-spin" style={{ animationDuration: '30s' }}>
                    <img src="/images/contact-us-img.svg" alt="" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" />
                  </div>
                </div>
              </div>
            </div>
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

      <section className="py-6 md:py-10 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">How DropYard Works</h2>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute left-0 right-0 top-18">
              <div className="mx-8 h-1 bg-emerald-200"></div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
              {[1, 2, 3, 4].map((step) => (
                <div className="flex flex-col items-center text-center px-2" key={`home-step-${step}`}>
                <div className="relative flex flex-col items-center">
                  <div className="w-27 h-27 md:w-35 md:h-35 rounded-full bg-amber-200/90 flex items-center justify-center shadow-md mb-6">
                    <div className="w-42 h-52 md:w-50 md:h-62 flex items-center justify-center">
                      <HowItWorksIllustration step={step} />
                    </div>
                  </div>
                </div>
                {step === 1 && (
                  <>
                    <h3 className="text-lg md:text-xl font-bold text-emerald-800 mb-2">Sellers submit items</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Upload what you&apos;d like to sell or give away for free.
                    </p>
                  </>
                )}
                {step === 2 && (
                  <>
                    <h3 className="text-lg md:text-xl font-bold text-emerald-800 mb-2">We host the Drop</h3>
                    <p className="text-gray-600 text-sm md:text-base">Items go live for a limited time</p>
                  </>
                )}
                {step === 3 && (
                  <>
                    <h3 className="text-lg md:text-xl font-bold text-emerald-800 mb-2">Neighbors claim</h3>
                    <p className="text-gray-600 text-sm md:text-base">Buyers browse and reserve</p>
                  </>
                )}
                {step === 4 && (
                  <>
                    <h3 className="text-lg md:text-xl font-bold text-emerald-800 mb-2">Local pickup & payment</h3>
                    <p className="text-gray-600 text-sm md:text-base">Items move home to home</p>
                  </>
                )}
              </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 md:py-10 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/40 via-transparent to-amber-50/30 pointer-events-none" />
        <div className="absolute top-8 right-[15%] text-emerald-200/60 text-xl">✦</div>
        <div className="absolute bottom-12 left-[10%] text-amber-200/50 text-lg">✦</div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                <span className="text-emerald-700">Shop local deals</span>
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
                      <p className="text-sm text-emerald-800/80">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => goBuyerAuth("signup")}
                className="mt-8 bg-emerald-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-800 hover:shadow-lg hover:shadow-emerald-200/50 transition-all duration-300 flex items-center gap-2"
              >
                Start Browsing
                <ArrowRight size={18} />
              </button>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-lg shadow-emerald-100/50">
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
                  <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
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

      <section className="pt-2 pb-8 md:pt-4 md:pb-12 bg-white">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-10">
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
          </div>
          <div>
            <h4 className="font-bold mb-4 text-emerald-400 text-sm uppercase tracking-wider">Quick Links</h4>
            <div className="flex flex-col gap-3">
              <button onClick={() => setPage("howitworks")} className="text-slate-300 hover:text-emerald-300 text-sm text-left transition-colors">
                How it works
              </button>
              <button onClick={() => setPage("buyers")} className="text-slate-300 hover:text-emerald-300 text-sm text-left transition-colors">For Buyers</button>
              <button onClick={() => setPage("sellers")} className="text-slate-300 hover:text-emerald-300 text-sm text-left transition-colors">For Sellers</button>
              <button className="text-slate-300 hover:text-emerald-300 text-sm text-left transition-colors flex items-center gap-2">
                <HelpCircle size={14} className="text-emerald-500/70 flex-shrink-0" />
                FAQ
              </button>
              <button className="text-slate-300 hover:text-emerald-300 text-sm text-left transition-colors flex items-center gap-2">
                <FileText size={14} className="text-amber-500/70 flex-shrink-0" />
                Community Guidelines
              </button>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-amber-400 text-sm uppercase tracking-wider">Get Started</h4>
            <div className="flex flex-col gap-3">
              <button onClick={() => goBuyerAuth("signup")} className="text-slate-300 hover:text-emerald-300 text-sm text-left transition-colors">Join the Next Drop</button>
              <button onClick={() => goSellerAuth("signup")} className="text-slate-300 hover:text-emerald-300 text-sm text-left transition-colors">Become a Seller</button>
              <button onClick={() => goMovingAuth("signup")} className="text-slate-300 hover:text-amber-300 text-sm text-left transition-colors">Plan a Moving Sale</button>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-emerald-400 text-sm uppercase tracking-wider">Account</h4>
            <div className="flex flex-col gap-3">
              <button onClick={() => goBuyerAuth("login")} className="text-slate-300 hover:text-white text-sm text-left transition-colors">Log in</button>
              <button onClick={() => goBuyerAuth("signup")} className="text-slate-300 hover:text-white text-sm text-left transition-colors">Sign up</button>
              <span className="text-slate-500 text-sm">Help Center</span>
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
function SocialSidebar({ position = "left" }: { position?: "left" | "right" }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (position === "left") {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [position]);

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const isRight = position === "right";
  const positionClasses = isRight ? "right-0 rounded-l-xl" : "left-0 rounded-r-xl";
  const animationClasses = isRight ? "translate-x-0" : isVisible ? "translate-x-0" : "-translate-x-full";

  return (
    <div
      className={`fixed ${positionClasses} top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-1 bg-white shadow-lg overflow-hidden transition-transform duration-700 ease-out ${animationClasses}`}
    >
      <div className="bg-emerald-700 text-white px-3 py-2 text-xs font-medium text-center">
        <span className="writing-mode-vertical block" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
          Connect
        </span>
      </div>
      {socialLinks.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 text-emerald-700/60 hover:text-amber-500 hover:bg-amber-50 transition-colors duration-300"
            aria-label={social.label}
          >
            <Icon className="w-5 h-5" />
          </a>
        );
      })}
    </div>
  );
}
