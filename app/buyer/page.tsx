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
  LogOut,
  Compass,
  Search,
  Heart,
  X,
} from "lucide-react";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";
import { DropCycleProvider, useDropCycle } from "@/context/DropCycleContext";
import { CATEGORIES } from "@/lib/constants";
import { formatDropDate, formatDropTime } from "@/lib/dropCycle";
import { MOCK_ITEMS, type MockItem } from "@/lib/mockData";

// Seller tabs
type SellerTab =
  | "overview"
  | "items"
  | "claims"
  | "pickups"
  | "messages"
  | "list"
  | "onboarding";
// Buyer tabs
type BuyerTab =
  | "discover"
  | "browse"
  | "saved"
  | "claims"
  | "messages";

function BuyerDashboardContent() {
  const {
    phase,
    canSellersList,
    canBuyersBrowse,
    canBuyersClaim,
    phaseLabel,
    phaseDescription,
    nextEventAt,
    nextEventLabel,
    countdownLabel,
    currentDropDate,
    simulatedDate,
    setSimulatedDate,
  } = useDropCycle();
  const {
    mode,
    setMode,
    sellerOnboardingComplete,
    setSellerOnboardingComplete,
    buyerOnboardingComplete,
    setBuyerOnboardingComplete,
    dropType,
    movingSaleDate,
    promoEmailOptIn,
    setDropType,
    setMovingSaleDate,
    setPromoEmailOptIn,
    watchlist,
    buyerClaims,
    toggleWatchlist,
    addBuyerClaim,
  } = useDashboard();

  const [activeSellerTab, setActiveSellerTab] =
    useState<SellerTab>("overview");
  const [activeBuyerTab, setActiveBuyerTab] = useState<BuyerTab>("discover");
  const [condition, setCondition] = useState("Excellent");
  const [selectedItem, setSelectedItem] = useState<MockItem | null>(null);
  const [selectedPickupSlot, setSelectedPickupSlot] = useState<string | null>(null);
  const [browseCategory, setBrowseCategory] = useState<string>("");
  const [browseSearch, setBrowseSearch] = useState("");
  const [buyerOnboardingStep, setBuyerOnboardingStep] = useState(1);
  const [postalCode, setPostalCode] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [notifyClaims, setNotifyClaims] = useState(true);
  const [notifyNewItems, setNotifyNewItems] = useState(true);

  const sellerTabs: { id: SellerTab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "items", label: "My Items", icon: Package },
    { id: "claims", label: "Incoming Claims", icon: ShoppingBag },
    { id: "pickups", label: "Pickups", icon: MapPin },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "list", label: "List Item", icon: Plus },
    { id: "onboarding", label: "Onboarding", icon: Check },
  ];

  const buyerTabs: { id: BuyerTab; label: string; icon: React.ElementType }[] = [
    { id: "discover", label: "Discover", icon: Compass },
    { id: "browse", label: "Browse", icon: Search },
    { id: "saved", label: "Saved", icon: Heart },
    { id: "claims", label: "Claims", icon: ShoppingBag },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ];

  const navTabs = mode === "seller" ? sellerTabs : buyerTabs;
  const setActiveTab = mode === "seller" ? setActiveSellerTab : setActiveBuyerTab;
  const activeTab = mode === "seller" ? activeSellerTab : activeBuyerTab;

  // Weekly sellers can only list during SUBMISSION; Moving Sale can list anytime
  const canListItem =
    sellerOnboardingComplete && (canSellersList || dropType === "moving");
  const toggleInterest = (cat: string) => {
    setSelectedInterests((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };
  const filteredItems = MOCK_ITEMS.filter((item) => {
    const matchCat = !browseCategory || item.category === browseCategory;
    const matchSearch =
      !browseSearch ||
      item.title.toLowerCase().includes(browseSearch.toLowerCase());
    return matchCat && matchSearch;
  });
  const savedItems = MOCK_ITEMS.filter((i) => watchlist.includes(i.id));

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top bar with mode toggle */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <DropYardLogo size="default" />
            <DropYardWordmark className="text-xl" />
          </Link>
          <div className="flex items-center gap-3">
            <select
              title="Simulate Drop phase (demo)"
              value={simulatedDate ? phase : "__live__"}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "__live__") {
                  setSimulatedDate(null);
                  return;
                }
                const dates: Record<string, string> = {
                  SUBMISSION: "2026-02-16T12:00:00",
                  PREVIEW: "2026-02-20T12:00:00",
                  LIVE: "2026-02-21T10:00:00",
                  CLOSED: "2026-02-22T21:00:00",
                };
                setSimulatedDate(new Date(dates[v] ?? dates.SUBMISSION));
              }}
              className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-600"
            >
              <option value="__live__">Live</option>
              <option value="SUBMISSION">Sim: Submission</option>
              <option value="PREVIEW">Sim: Preview</option>
              <option value="LIVE">Sim: Live</option>
              <option value="CLOSED">Sim: Closed</option>
            </select>
            <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-gray-50 p-0.5">
              <button
                onClick={() => setMode("seller")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === "seller"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Seller
              </button>
              <button
                onClick={() => setMode("buyer")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === "buyer"
                    ? "bg-white text-amber-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Buyer
              </button>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-white font-bold">
              JD
            </div>
          </div>
        </div>
      </header>

      {/* Drop cycle phase banner */}
      <div
        className={`px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 ${
          phase === "LIVE"
            ? "bg-emerald-600 text-white"
            : phase === "PREVIEW"
              ? "bg-amber-500 text-white"
              : phase === "SUBMISSION"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-gray-100 text-gray-700"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold">{phaseLabel}</span>
          <span className="text-sm opacity-90">{phaseDescription}</span>
          <span className="text-xs opacity-75">
            Drop: {formatDropDate(currentDropDate)} 8am–Sun 8pm
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm font-mono">
          <span>{nextEventLabel}</span>
          <span
            className={`px-2 py-0.5 rounded ${
              phase === "LIVE" ? "bg-white/20" : "bg-black/10"
            }`}
          >
            {countdownLabel}
          </span>
        </div>
      </div>

      <div className="pt-0 pl-0 flex flex-col lg:flex-row lg:gap-6 min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0 pt-0 pl-0 w-full lg:w-64 flex flex-col lg:self-stretch">
          <nav className="flex flex-col flex-1 min-h-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
            <div className="space-y-0.5 flex-shrink-0">
              {navTabs.map((tab) => {
                const listDisabled =
                  mode === "seller" && tab.id === "list" && !canListItem;
                const disabled = listDisabled;
                return (
                  <button
                    key={tab.id}
                    onClick={() =>
                      !disabled && setActiveTab(tab.id as SellerTab & BuyerTab)
                    }
                    disabled={disabled}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      disabled
                        ? "opacity-50 cursor-not-allowed text-gray-400"
                        : activeTab === tab.id
                          ? mode === "seller"
                            ? "bg-emerald-50 text-emerald-700 font-medium"
                            : "bg-amber-50 text-amber-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon size={20} />
                    {tab.label}
                    {tab.id === "list" && !canListItem && (
                      <span className="ml-auto text-xs text-amber-600">
                        {!sellerOnboardingComplete
                          ? "Complete onboarding"
                          : dropType === "weekly"
                            ? "Opens Mon"
                            : "Complete onboarding"}
                      </span>
                    )}
                    <ChevronRight
                      size={16}
                      className={`ml-auto ${activeTab === tab.id ? "opacity-100" : "opacity-0"}`}
                    />
                  </button>
                );
              })}
            </div>
            <div className="flex-1 min-h-4" />
            <div className="flex-shrink-0 pt-2 mt-2 border-t border-gray-100">
              <Link
                href="/join"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-gray-600 hover:bg-gray-50 transition-all"
              >
                <LogOut size={20} />
                Sign out
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 pt-0 pl-0 pr-4 pb-4 lg:pr-6 lg:pb-6">
          {/* ========== BUYER MODE ========== */}
          {mode === "buyer" && (
            <>
              {activeBuyerTab === "discover" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Discover</h2>
                  {!canBuyersBrowse && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                      <p className="font-medium text-amber-800">
                        {phase === "SUBMISSION"
                          ? "Preview opens Thursday — browse and save items then."
                          : "Drop closed. Next preview opens Thursday."}
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        {nextEventLabel} · {countdownLabel}
                      </p>
                    </div>
                  )}
                  {canBuyersBrowse && !buyerOnboardingComplete && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                      <h3 className="font-bold text-gray-900 mb-2">
                        Complete your buyer setup
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Tell us your neighborhood and preferences to get personalized results.
                      </p>
                      {buyerOnboardingStep === 1 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Postal code
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. K1A 0B1"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                            maxLength={7}
                            className="w-full max-w-xs px-4 py-3 border border-gray-200 rounded-xl"
                          />
                          <button
                            onClick={() => setBuyerOnboardingStep(2)}
                            disabled={postalCode.length < 3}
                            className="mt-3 px-4 py-2 bg-amber-500 text-white rounded-xl font-medium text-sm hover:bg-amber-600 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      )}
                      {buyerOnboardingStep === 2 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preferred categories
                          </label>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {CATEGORIES.map((c) => (
                              <button
                                key={c}
                                onClick={() => toggleInterest(c)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium ${
                                  selectedInterests.includes(c)
                                    ? "bg-amber-500 text-white"
                                    : "bg-white border border-gray-200 text-gray-600"
                                }`}
                              >
                                {c}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setBuyerOnboardingStep(3)}
                            className="px-4 py-2 bg-amber-500 text-white rounded-xl font-medium text-sm hover:bg-amber-600"
                          >
                            Next
                          </button>
                        </div>
                      )}
                      {buyerOnboardingStep === 3 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notification preferences
                          </label>
                          <div className="space-y-3 mb-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notifyClaims}
                                onChange={() => setNotifyClaims(!notifyClaims)}
                                className="rounded border-gray-300 text-amber-500"
                              />
                              <span>Claim status updates</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notifyNewItems}
                                onChange={() => setNotifyNewItems(!notifyNewItems)}
                                className="rounded border-gray-300 text-amber-500"
                              />
                              <span>New items in my neighborhood</span>
                            </label>
                          </div>
                          <button
                            onClick={() => setBuyerOnboardingComplete(true)}
                            className="px-4 py-2 bg-amber-500 text-white rounded-xl font-medium text-sm hover:bg-amber-600"
                          >
                            Finish
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  {canBuyersBrowse && (
                  <>
                  <section>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Within Walking Distance
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {MOCK_ITEMS.filter((i) => i.walkingDistance).map((item) => (
                        <ItemCard
                          key={item.id}
                          item={item}
                          isSaved={watchlist.includes(item.id)}
                          onSave={() => toggleWatchlist(item.id)}
                          onView={() => setSelectedItem(item)}
                        />
                      ))}
                    </div>
                  </section>
                  <section>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Just Added
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {MOCK_ITEMS.slice(0, 4).map((item) => (
                        <ItemCard
                          key={item.id}
                          item={item}
                          isSaved={watchlist.includes(item.id)}
                          onSave={() => toggleWatchlist(item.id)}
                          onView={() => setSelectedItem(item)}
                        />
                      ))}
                    </div>
                  </section>
                  <section>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Trending
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {MOCK_ITEMS.filter((i) => i.trending).map((item) => (
                        <ItemCard
                          key={item.id}
                          item={item}
                          isSaved={watchlist.includes(item.id)}
                          onSave={() => toggleWatchlist(item.id)}
                          onView={() => setSelectedItem(item)}
                        />
                      ))}
                    </div>
                  </section>
                  </>
                  )}
                </div>
              )}

              {activeBuyerTab === "browse" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Browse</h2>
                  {!canBuyersBrowse ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                      <p className="font-medium text-amber-800">
                        {phase === "SUBMISSION"
                          ? "Preview opens Thursday — browse and save then."
                          : "Drop closed. Next preview opens Thursday."}
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        {nextEventLabel} · {countdownLabel}
                      </p>
                    </div>
                  ) : (
                  <>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search items..."
                        value={browseSearch}
                        onChange={(e) => setBrowseSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <select
                      value={browseCategory}
                      onChange={(e) => setBrowseCategory(e.target.value)}
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 min-w-[160px]"
                    >
                      <option value="">All categories</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        isSaved={watchlist.includes(item.id)}
                        onSave={() => toggleWatchlist(item.id)}
                        onView={() => setSelectedItem(item)}
                      />
                    ))}
                  </div>
                  </>
                  )}
                </div>
              )}

              {activeBuyerTab === "saved" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Saved</h2>
                  {!canBuyersBrowse ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                      <p className="font-medium text-amber-800">
                        Browse opens Thursday — save items during Preview.
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        {nextEventLabel} · {countdownLabel}
                      </p>
                    </div>
                  ) : savedItems.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
                      <Heart size={48} className="mx-auto mb-3 text-gray-300" />
                      <p>No saved items yet. Browse and tap the heart to save.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedItems.map((item) => (
                        <ItemCard
                          key={item.id}
                          item={item}
                          isSaved
                          onSave={() => toggleWatchlist(item.id)}
                          onView={() => setSelectedItem(item)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeBuyerTab === "claims" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                      Your Claims
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Items you&apos;ve claimed and pickup status
                    </p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {buyerClaims.map((claim) => (
                      <div
                        key={claim.id}
                        className="flex items-center gap-4 p-6 hover:bg-gray-50/50"
                      >
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                          <ShoppingBag size={24} className="text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {claim.itemName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {claim.sellerName} · {claim.requestedAt}
                          </p>
                          {claim.pickupSlot && (
                            <p className="text-xs text-amber-600 mt-1">
                              {claim.pickupSlot}
                              {claim.pickupAddress && ` · ${claim.pickupAddress}`}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            claim.status === "Picked Up"
                              ? "bg-emerald-100 text-emerald-700"
                              : claim.status === "Confirmed"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {claim.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeBuyerTab === "messages" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                      Messages
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Conversations with sellers
                    </p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {[
                      {
                        name: "Jane D.",
                        preview: "Your claim for Sectional Sofa was confirmed.",
                        time: "2h",
                      },
                      {
                        name: "Mike T.",
                        preview: "Pickup address sent. See you Saturday!",
                        time: "1d",
                      },
                    ].map((m, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-6 hover:bg-gray-50/50 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User size={24} className="text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900">{m.name}</h3>
                          <p className="text-sm text-gray-600 truncate">
                            {m.preview}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">{m.time}</span>
                        <ChevronRight size={20} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ========== SELLER MODE ========== */}
          {mode === "seller" && (
            <>
              {activeSellerTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        label: "Items Listed",
                        value: "12",
                        icon: Package,
                        bg: "bg-emerald-100",
                        text: "text-emerald-600",
                      },
                      {
                        label: "Incoming Claims",
                        value: "2",
                        icon: ShoppingBag,
                        bg: "bg-amber-100",
                        text: "text-amber-600",
                      },
                      {
                        label: "Total Revenue",
                        value: "$1,240",
                        icon: DollarSign,
                        bg: "bg-teal-100",
                        text: "text-teal-600",
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div
                          className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}
                        >
                          <stat.icon size={24} className={stat.text} />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">
                      Quick Actions
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() =>
                          canListItem
                            ? setActiveSellerTab("list")
                            : setActiveSellerTab("onboarding")
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
                      >
                        <Plus size={18} />
                        List New Item
                      </button>
                      <button
                        onClick={() => setActiveSellerTab("claims")}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl font-medium hover:bg-gray-50"
                      >
                        <ShoppingBag size={18} />
                        View Incoming Claims
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSellerTab === "onboarding" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-amber-50">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Seller Onboarding
                    </h2>
                    <p className="text-gray-600">
                      Required before listing items. Complete all steps.
                    </p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {[
                      {
                        step: 1,
                        title: "Account creation",
                        desc: "Create your account with email/password",
                        done: true,
                      },
                      {
                        step: 2,
                        title: "Postal code verification",
                        desc: "Verify your neighborhood for matching",
                        done: true,
                      },
                      {
                        step: 3,
                        title: "Pickup availability setup",
                        desc: "Set when buyers can pick up",
                        done: true,
                      },
                      {
                        step: 4,
                        title: "Drop type selection",
                        desc: "Weekly or Moving Sale (Premium)",
                        done: sellerOnboardingComplete,
                      },
                    ].map((item) => (
                      <div
                        key={item.step}
                        className="flex flex-col gap-4 p-6 hover:bg-gray-50/50"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${
                              item.done
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-amber-100 text-amber-600"
                            }`}
                          >
                            {item.done ? (
                              <Check size={24} />
                            ) : (
                              item.step
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                          {item.done ? (
                            <span className="text-emerald-600 text-sm font-medium">
                              Done {dropType === "moving" && `· Moving Sale ${movingSaleDate ? movingSaleDate : ""}`}
                            </span>
                          ) : (
                            <span className="text-amber-600 text-sm font-medium">In progress</span>
                          )}
                        </div>
                        {!item.done && item.step === 4 && (
                          <div className="ml-16 space-y-4 border-l-2 border-amber-200 pl-6">
                            <div className="flex gap-3">
                              <button
                                onClick={() => setDropType("weekly")}
                                className={`flex-1 px-4 py-3 rounded-xl border-2 text-left font-medium transition-all ${
                                  dropType === "weekly"
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                                }`}
                              >
                                <span className="block font-semibold">Weekly Drop</span>
                                <span className="text-xs opacity-80">Standard weekend sales</span>
                              </button>
                              <button
                                onClick={() => setDropType("moving")}
                                className={`flex-1 px-4 py-3 rounded-xl border-2 text-left font-medium transition-all ${
                                  dropType === "moving"
                                    ? "border-amber-500 bg-amber-50 text-amber-700"
                                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                                }`}
                              >
                                <span className="block font-semibold flex items-center gap-1">
                                  Moving Sale <span className="text-xs bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">Premium</span>
                                </span>
                                <span className="text-xs opacity-80">Featured, custom date, unlimited</span>
                              </button>
                            </div>
                            {dropType === "moving" && (
                              <>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Custom weekend date
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Mar 22-23 or Mar 29-30"
                                    value={movingSaleDate}
                                    onChange={(e) => setMovingSaleDate(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                  />
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={promoEmailOptIn}
                                    onChange={(e) => setPromoEmailOptIn(e.target.checked)}
                                    className="rounded border-gray-300 text-amber-500"
                                  />
                                  <span className="text-sm">
                                    Send promotional email to nearby subscribers
                                  </span>
                                </label>
                                <div className="text-xs text-amber-700 bg-amber-50 rounded-lg p-3 space-y-1">
                                  <p className="font-medium">Moving Sale benefits:</p>
                                  <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                                    <li>Featured placement on homepage</li>
                                    <li>Unlimited item listings</li>
                                    <li>Dedicated Moving Sale badge</li>
                                    <li>Extended visibility period</li>
                                  </ul>
                                </div>
                              </>
                            )}
                            <button
                              onClick={() => setSellerOnboardingComplete(true)}
                              className="px-4 py-2 bg-amber-500 text-white rounded-xl font-medium text-sm hover:bg-amber-600"
                            >
                              Complete
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSellerTab === "items" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                      My Items
                    </h2>
                    <p className="text-gray-600 text-sm">
                      All your submitted items with status
                    </p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {[
                      { name: "Sectional Sofa", status: "Live", price: 450, emoji: "🛋️", movingSale: false },
                      { name: "iPhone 13", status: "Claimed", price: 320, emoji: "📱", movingSale: false },
                      { name: "Queen Bed Frame", status: "Live", price: 150, emoji: "🛏️", movingSale: true, saleDate: "Mar 22-23" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-6 hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="relative w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
                          {item.emoji}
                          {item.movingSale && (
                            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded">
                              MS
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {item.name}
                            </h3>
                            {item.movingSale && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                                Moving Sale
                              </span>
                            )}
                          </div>
                          <p className="text-emerald-600 font-medium">
                            ${item.price}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === "Live"
                              ? "bg-emerald-100 text-emerald-700"
                              : item.status === "Claimed"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-100 text-gray-600"
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

              {activeSellerTab === "claims" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                      Incoming Claims
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Confirm or reject buyer claims on your items
                    </p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {[
                      {
                        item: "Sectional Sofa",
                        buyer: "Sarah M.",
                        time: "2 hours ago",
                      },
                      {
                        item: "Vintage Lamp",
                        buyer: "Mike T.",
                        time: "1 day ago",
                      },
                    ].map((claim, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-6 hover:bg-gray-50/50"
                      >
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                          <User size={24} className="text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {claim.item}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {claim.buyer} · {claim.time}
                          </p>
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

              {activeSellerTab === "pickups" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                      Scheduled Pickups
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Buyer details and pickup windows
                    </p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {[
                      {
                        item: "iPhone 13",
                        buyer: "Alex K.",
                        slot: "Sat 2pm–4pm",
                        address: "123 Oak St",
                      },
                      {
                        item: "Mountain Bike",
                        buyer: "Jordan L.",
                        slot: "Sun 10am–12pm",
                        address: "456 Pine Ave",
                      },
                    ].map((p, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-6 hover:bg-gray-50/50"
                      >
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                          <MapPin size={24} className="text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {p.item}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {p.buyer} · {p.slot}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {p.address}
                          </p>
                        </div>
                        <ChevronRight size={20} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSellerTab === "messages" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                      Buyer Communications
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Chat with buyers about items
                    </p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {[
                      {
                        name: "Sarah M.",
                        preview: "Is the sofa still available?",
                        time: "2h",
                      },
                      {
                        name: "Mike T.",
                        preview: "Can I pick up tomorrow?",
                        time: "1d",
                      },
                    ].map((m, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-6 hover:bg-gray-50/50 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User size={24} className="text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900">
                            {m.name}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {m.preview}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">{m.time}</span>
                        <ChevronRight size={20} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSellerTab === "list" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {!canListItem ? (
                    <div className="p-12 text-center">
                      {!sellerOnboardingComplete ? (
                        <>
                          <p className="text-gray-600 mb-4">
                            Complete seller onboarding to list items.
                          </p>
                          <button
                            onClick={() => setActiveSellerTab("onboarding")}
                            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
                          >
                            Go to Onboarding
                          </button>
                        </>
                      ) : (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 inline-block">
                          <p className="font-medium text-emerald-800 mb-2">
                            Weekly Drop submission opens Monday
                          </p>
                          <p className="text-sm text-emerald-700">
                            {nextEventLabel} · {countdownLabel}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-amber-50">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                          List a New Item
                        </h2>
                        <p className="text-gray-600 text-sm">
                          Photo upload, details, category & price
                        </p>
                      </div>
                      <div className="p-6 space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Photos (multiple images)
                          </label>
                          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors cursor-pointer">
                            <Upload
                              size={40}
                              className="mx-auto text-gray-400 mb-2"
                            />
                            <p className="text-gray-600 font-medium">
                              Drop images here or click to upload
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Vintage Wooden Coffee Table"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Describe your item..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500">
                            {CATEGORIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Condition
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {["Like New", "Excellent", "Good", "Fair"].map(
                              (c) => (
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
                              )
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Price ($)
                            </label>
                            <input
                              type="number"
                              placeholder="99"
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Original price (optional)
                            </label>
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
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Item detail modal (claiming flow) */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          selectedSlot={selectedPickupSlot}
          onSelectSlot={setSelectedPickupSlot}
          canClaim={canBuyersClaim}
          nextEventLabel={nextEventLabel}
          countdownLabel={countdownLabel}
          onClaim={() => {
            addBuyerClaim({
              itemId: selectedItem.id,
              itemName: selectedItem.title,
              sellerName: selectedItem.sellerName,
              price: selectedItem.price,
              status: "Pending",
              pickupSlot: selectedPickupSlot || undefined,
              pickupAddress: undefined,
            });
            setSelectedItem(null);
            setSelectedPickupSlot(null);
            setActiveBuyerTab("claims");
          }}
          onClose={() => {
            setSelectedItem(null);
            setSelectedPickupSlot(null);
          }}
        />
      )}
    </div>
  );
}

function ItemCard({
  item,
  isSaved,
  onSave,
  onView,
}: {
  item: MockItem;
  isSaved: boolean;
  onSave: () => void;
  onView: () => void;
}) {
  return (
    <div
      onClick={onView}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="relative">
        <div className="aspect-square bg-gray-100 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
          {item.emoji}
        </div>
        {item.movingSale && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg shadow-sm">
            Moving Sale
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
              {item.saleDate && item.movingSale && (
                <span className="text-xs text-amber-600 font-medium">{item.saleDate}</span>
              )}
            </div>
            <p className="text-emerald-600 font-medium">${item.price}</p>
            <p className="text-xs text-gray-500 mt-1">
              {item.distance} · {item.sellerName}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100"
          >
            <Heart
              size={20}
              className={isSaved ? "fill-amber-500 text-amber-500" : "text-gray-400"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

function ItemDetailModal({
  item,
  selectedSlot,
  onSelectSlot,
  canClaim,
  nextEventLabel,
  countdownLabel,
  onClaim,
  onClose,
}: {
  item: MockItem;
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
  canClaim: boolean;
  nextEventLabel: string;
  countdownLabel: string;
  onClaim: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{item.title}</h2>
              {item.movingSale && (
                <span className="inline-block mt-1 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg">
                  Moving Sale {item.saleDate && `· ${item.saleDate}`}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>
          <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-6xl mb-4">
            {item.emoji}
          </div>
          <p className="text-gray-600 mb-2">{item.description}</p>
          <div className="flex gap-2 text-sm text-gray-500 mb-4">
            <span>{item.condition}</span>
            <span>·</span>
            <span>{item.category}</span>
            <span>·</span>
            <span>{item.distance} away</span>
          </div>
          <p className="text-lg font-bold text-emerald-600 mb-4">
            ${item.price}
            {item.originalPrice && (
              <span className="text-sm font-normal text-gray-400 line-through ml-2">
                ${item.originalPrice}
              </span>
            )}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            Seller: <span className="font-medium">{item.sellerName}</span>
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select pickup time slot
            </label>
            <div className="flex flex-wrap gap-2">
              {item.pickupSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => onSelectSlot(slot)}
                  disabled={!canClaim}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                    selectedSlot === slot
                      ? "bg-amber-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  } ${!canClaim ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
          {!canClaim ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <p className="font-medium text-amber-800">
                Claiming opens when Drop goes live
              </p>
              <p className="text-sm text-amber-700 mt-1">
                {nextEventLabel} · {countdownLabel}
              </p>
            </div>
          ) : (
          <button
            onClick={onClaim}
            disabled={!selectedSlot}
            className="w-full py-4 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Claim Request
          </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BuyerDashboardPage() {
  return (
    <DashboardProvider>
      <DropCycleProvider>
        <BuyerDashboardContent />
      </DropCycleProvider>
    </DashboardProvider>
  );
}
