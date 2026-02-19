"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { DropYardLogo, DropYardWordmark } from "@/app/page";

export function GlobalHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  const navLink = (href: string, label: string) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          active ? "text-emerald-600 bg-white shadow-sm" : "text-gray-600 hover:text-emerald-600 hover:bg-white hover:shadow-sm"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl shadow-sm border-b border-amber-100/60">
      <div className="relative max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <DropYardLogo size="default" />
          <DropYardWordmark className="text-xl" />
        </Link>
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 bg-gray-50/80 rounded-full px-2 py-1.5 border border-gray-100 shadow-inner">
          {navLink("/how-it-works", "How it works")}
          {navLink("/for-buyers", "For Buyers")}
          {navLink("/for-sellers", "For Sellers")}
        </div>
        <div className="hidden md:flex shrink-0">
          <Link
            href="/join"
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            Join the Next Drop
          </Link>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-2">
          <Link href="/how-it-works" onClick={() => setMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-gray-50 font-medium">
            How it works
          </Link>
          <Link href="/for-buyers" onClick={() => setMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-gray-50 font-medium">
            For Buyers
          </Link>
          <Link href="/for-sellers" onClick={() => setMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-gray-50 font-medium">
            For Sellers
          </Link>
          <Link
            href="/join"
            onClick={() => setMenuOpen(false)}
            className="block w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 rounded-full font-semibold text-center mt-2"
          >
            Join the Next Drop
          </Link>
        </div>
      )}
    </nav>
  );
}
