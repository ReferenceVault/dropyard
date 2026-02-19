"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DollarSign, MapPin, Star, Search, Bookmark, Calendar, Truck, Sparkles, ChevronRight } from "lucide-react";

const FEATURED_ITEMS = [
  { emoji: "🛋️", name: "Sectional Sofa", price: 450, original: 1800 },
  { emoji: "📱", name: "iPhone 13", price: 320, original: 600 },
  { emoji: "🚲", name: "Mountain Bike", price: 180, original: 500 },
  { emoji: "🎮", name: "PS5 Bundle", price: 380, original: 550 },
];

const BENEFITS = [
  {
    icon: DollarSign,
    title: "Amazing Prices",
    desc: "Items priced 50-70% below retail. Your neighbors' quality stuff at yard sale prices.",
  },
  {
    icon: MapPin,
    title: "Hyper-Local",
    desc: "Everything is in your neighborhood. No shipping, no waiting—just walk or drive over.",
  },
  {
    icon: Star,
    title: "Quality Items",
    desc: "Real neighbors selling real stuff. See seller ratings and item conditions upfront.",
  },
];

const STEPS = [
  { num: 1, icon: Search, title: "Browse", desc: "Explore items in your neighborhood during weekend Drops" },
  { num: 2, icon: Bookmark, title: "Save & Claim", desc: "Save favorites and claim items you want to buy" },
  { num: 3, icon: Calendar, title: "Confirm Pickup", desc: "Choose a pickup window that works for you" },
  { num: 4, icon: Truck, title: "Pick Up & Pay", desc: "Meet your neighbor and complete the transaction" },
];

function Countdown() {
  const [time, setTime] = useState({ h: 23, m: 45, s: 32 });

  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) {
          s = 59;
          m--;
          if (m < 0) {
            m = 59;
            h--;
            if (h < 0) return { h: 23, m: 59, s: 59 };
          }
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    <span className="font-mono font-bold text-emerald-600 tabular-nums bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
      {pad(time.h)}:{pad(time.m)}:{pad(time.s)}
    </span>
  );
}

function getDiscount(price: number, original: number) {
  return Math.round(((original - price) / original) * 100);
}

export default function ForBuyersPage() {
  return (
    <div className="min-h-full flex flex-col">
      {/* Hero - Magical gradient with depth */}
      <section className="relative pt-6 pb-10 px-4 md:px-[5%] lg:px-[10%] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50/60 to-emerald-50" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-200/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-amber-200/60 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
            <Sparkles size={16} className="text-amber-500" />
            Local deals, real neighbors
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
            For <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Buyers</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-semibold mb-3">
            Shop locally. Simply.
          </p>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto text-lg">
            Discover amazing deals from your neighbors through curated weekend Drops. Quality items at great prices, just around the corner.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/join?mode=signup"
              className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              Join This Week&apos;s Drop
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/join?mode=signin"
              className="inline-flex items-center justify-center border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-700 px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:-translate-y-0.5"
            >
              I Have an Account
            </Link>
          </div>

          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2 border border-emerald-100 shadow-sm">
            <span className="text-sm text-gray-600">Drop ends in</span>
            <Countdown />
          </div>
        </div>
      </section>

      {/* Featured Items - Card magic */}
      <section className="py-10 px-4 md:px-[5%] lg:px-[10%] bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">This week</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">This Week&apos;s Picks</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_ITEMS.map((item, i) => {
              const discount = getDiscount(item.price, item.original);
              return (
                <Link
                  key={item.name}
                  href="/join?mode=signup"
                  className="group block"
                >
                  <div
                    className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-200 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="absolute top-4 right-4 px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg">
                      -{discount}%
                    </div>
                    <div className="text-5xl mb-5 transition-transform duration-300 group-hover:scale-110">{item.emoji}</div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg group-hover:text-emerald-700 transition-colors">{item.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-emerald-600">${item.price}</span>
                      <span className="text-sm text-gray-400 line-through">${item.original}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why buy - Glassmorphism cards */}
      <section className="py-12 px-4 md:px-[5%] lg:px-[10%] bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">The perks</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why buy on DropYard?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <b.icon size={32} className="text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-xl">{b.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How buying works - Polished step cards */}
      <section className="py-12 px-4 md:px-[5%] lg:px-[10%] bg-gradient-to-b from-gray-50/80 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">Simple steps</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How buying works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.num} className="group relative">
                <div className="h-full bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-200 transition-all duration-300 flex flex-col">
                  {/* Icon with step number overlay */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                        <step.icon size={28} className="text-amber-600" />
                      </div>
                      <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow">
                        {step.num}
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-emerald-300">
                    <ChevronRight size={22} strokeWidth={2.5} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Rich gradient */}
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to find your next deal?</h2>
          <p className="text-emerald-100 text-lg mb-8">Join your neighborhood&apos;s next Drop and discover amazing local finds.</p>
          <Link
            href="/join?mode=signup"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 px-10 py-4 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Get Started
            <ChevronRight size={22} />
          </Link>
        </div>
      </section>
    </div>
  );
}
