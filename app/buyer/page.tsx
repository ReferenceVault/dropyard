"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DropYardLogo, DropYardWordmark } from "../page";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MapPin,
  MessageSquare,
  ImagePlus,
  Plus,
  ChevronRight,
  Check,
  Upload,
  DollarSign,
  User,
} from "lucide-react";

type Tab = "overview" | "items" | "claims" | "pickups" | "messages" | "list" | "onboarding";

const CONDITIONS = ["Like New", "Excellent", "Good", "Fair"] as const;
const CATEGORIES = ["Furniture", "Electronics", "Sports", "Home", "Clothing", "Books", "Other"];

export default function BuyerDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [condition, setCondition] = useState("Excellent");

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "items", label: "My Items", icon: Package },
    { id: "claims", label: "Claims", icon: ShoppingBag },
    { id: "pickups", label: "Pickups", icon: MapPin },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "list", label: "List Item", icon: Plus },
    { id: "onboarding", label: "Onboarding", icon: Check },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <DropYardLogo size="default" />
            <DropYardWordmark className="text-xl" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Seller Mode
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-white font-bold">
              JD
            </div>
          </div>
        </div>
      </header>

      <div className="pt-0 pl-0 flex flex-col lg:flex-row lg:gap-6 min-h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0 pt-0 pl-0 w-full lg:w-64">
            <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 space-y-0.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === tab.id
                      ? "bg-emerald-50 text-emerald-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                  <ChevronRight size={16} className={`ml-auto ${activeTab === tab.id ? "opacity-100" : "opacity-0"}`} />
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 pt-0 pl-0 pr-4 pb-4 lg:pr-6 lg:pb-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Items Listed", value: "12", icon: Package, bg: "bg-emerald-100", text: "text-emerald-600" },
                    { label: "Items Claimed", value: "8", icon: ShoppingBag, bg: "bg-amber-100", text: "text-amber-600" },
                    { label: "Total Revenue", value: "$1,240", icon: DollarSign, bg: "bg-teal-100", text: "text-teal-600" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                        <stat.icon size={24} className={stat.text} />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700">
                      <Plus size={18} />
                      List New Item
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl font-medium hover:bg-gray-50">
                      <ShoppingBag size={18} />
                      View Claims
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "onboarding" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-amber-50">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Seller Onboarding</h2>
                  <p className="text-gray-600">Get set up to sell in a few simple steps</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    { step: 1, title: "Account creation", desc: "Create your seller account", done: true },
                    { step: 2, title: "Address / postal code verification", desc: "Verify your neighborhood", done: true },
                    { step: 3, title: "Pickup availability setup", desc: "Set when buyers can pick up", done: true },
                    { step: 4, title: "Drop type selection", desc: "Weekly or Moving Sale", done: false },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-4 p-6 hover:bg-gray-50/50">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                          item.done ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {item.done ? <Check size={24} /> : item.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                      {item.done ? (
                        <span className="text-emerald-600 text-sm font-medium">Done</span>
                      ) : (
                        <button className="px-4 py-2 bg-amber-500 text-white rounded-xl font-medium text-sm hover:bg-amber-600">
                          Complete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "items" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">My Items</h2>
                  <p className="text-gray-600 text-sm">All your submitted items with status</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    { name: "Sectional Sofa", status: "Live", price: 450, emoji: "🛋️" },
                    { name: "iPhone 13", status: "Claimed", price: 320, emoji: "📱" },
                    { name: "Mountain Bike", status: "Draft", price: 180, emoji: "🚲" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-6 hover:bg-gray-50/50 transition-colors">
                      <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
                        {item.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                        <p className="text-emerald-600 font-medium">${item.price}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "Live" ? "bg-emerald-100 text-emerald-700" : item.status === "Claimed" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.status}
                      </span>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "claims" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Incoming Claims</h2>
                  <p className="text-gray-600 text-sm">Confirm or reject buyer claims</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    { item: "Sectional Sofa", buyer: "Sarah M.", time: "2 hours ago" },
                    { item: "Vintage Lamp", buyer: "Mike T.", time: "1 day ago" },
                  ].map((claim, i) => (
                    <div key={i} className="flex items-center gap-4 p-6 hover:bg-gray-50/50">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <User size={24} className="text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{claim.item}</h3>
                        <p className="text-sm text-gray-600">{claim.buyer} · {claim.time}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium text-sm hover:bg-emerald-700">
                          Confirm
                        </button>
                        <button className="px-4 py-2 border border-gray-200 rounded-xl font-medium text-sm hover:bg-gray-50">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "pickups" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Scheduled Pickups</h2>
                  <p className="text-gray-600 text-sm">Buyer details and pickup windows</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    { item: "iPhone 13", buyer: "Alex K.", slot: "Sat 2pm–4pm", address: "123 Oak St" },
                    { item: "Mountain Bike", buyer: "Jordan L.", slot: "Sun 10am–12pm", address: "456 Pine Ave" },
                  ].map((p, i) => (
                    <div key={i} className="flex items-center gap-4 p-6 hover:bg-gray-50/50">
                      <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                        <MapPin size={24} className="text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{p.item}</h3>
                        <p className="text-sm text-gray-600">{p.buyer} · {p.slot}</p>
                        <p className="text-xs text-gray-500 mt-1">{p.address}</p>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "messages" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Buyer Communications</h2>
                  <p className="text-gray-600 text-sm">Chat with buyers about items</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    { name: "Sarah M.", preview: "Is the sofa still available?", time: "2h" },
                    { name: "Mike T.", preview: "Can I pick up tomorrow?", time: "1d" },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center gap-4 p-6 hover:bg-gray-50/50 cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={24} className="text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">{m.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{m.preview}</p>
                      </div>
                      <span className="text-xs text-gray-400">{m.time}</span>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "list" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-amber-50">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">List a New Item</h2>
                  <p className="text-gray-600 text-sm">Photo upload, details, category & price</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Photo upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photos (multiple images)</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors cursor-pointer">
                      <Upload size={40} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600 font-medium">Drop images here or click to upload</p>
                    </div>
                  </div>
                  {/* Title & description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Vintage Wooden Coffee Table"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Describe your item..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                    />
                  </div>
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500">
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  {/* Condition */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                    <div className="flex flex-wrap gap-2">
                      {CONDITIONS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setCondition(c)}
                          className={`px-4 py-2 rounded-xl font-medium transition-all ${
                            condition === c
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Price */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                      <input
                        type="number"
                        placeholder="99"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Original price (optional, for discount)</label>
                      <input
                        type="number"
                        placeholder="199"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <button className="w-full py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                    <ImagePlus size={20} />
                    Publish Item
                  </button>
                </div>
              </div>
            )}
          </main>
      </div>
    </div>
  );
}
