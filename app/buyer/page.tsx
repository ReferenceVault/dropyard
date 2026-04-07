"use client";

import React, { useState, useEffect } from "react";
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
  ChevronLeft,
  Check,
  Upload,
  DollarSign,
  User,
  LogOut,
  Compass,
  Search,
  Heart,
  X,
  Truck,
  Home,
  Building2,
  Church,
  Users,
  Calendar,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  Shield,
  Info,
  FileText,
  CheckCircle,
  Circle,
  Gift,
  Briefcase,
  Sparkles,
  Eye,
  Loader2,
  History,
  TrendingDown,
} from "lucide-react";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";
import { DropCycleProvider, useDropCycle } from "@/context/DropCycleContext";
import { useAuth } from "@/context/AuthContext";
import { apiRequest, uploadItemPhoto } from "@/lib/api";

// ── API item type (matches backend response) ──────────────────
interface ApiItem {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  condition: string;
  status: string;
  zone: string;
  photos: string[];
  isMovingSale: boolean;
  seller?: { id: string; name: string; neighborhood?: string };
  _count?: { watchlist: number; claims: number };
  createdAt: string;
}

// Category / condition label → DB enum value
const CATEGORY_MAP: Record<string, string> = {
  Furniture: "FURNITURE", Electronics: "ELECTRONICS", Sports: "SPORTS",
  Home: "HOME", Clothing: "CLOTHING", Books: "BOOKS", Other: "OTHER",
};
const CONDITION_MAP: Record<string, string> = {
  "Like New": "LIKE_NEW", Excellent: "EXCELLENT", Good: "GOOD", Fair: "FAIR",
};
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
  | "moving-sale"
  | "history";
// Buyer tabs
type BuyerTab =
  | "discover"
  | "browse"
  | "saved"
  | "claims"
  | "messages"
  | "history";

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
  const { user, signout, accessToken, refreshUser } = useAuth();
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

  // Seed mode + onboarding flags from authenticated user
  useEffect(() => {
    if (!user) return;
    const isSeller = user.role === "SELLER" || user.role === "BOTH";
    setMode(isSeller ? "seller" : "buyer");
    setSellerOnboardingComplete(user.sellerOnboardingDone);
    setBuyerOnboardingComplete(user.buyerOnboardingDone);
    // Moving Sale sellers can list anytime — not gated by weekly drop phase
    if (user.role === "BOTH") setDropType("moving");
  }, [user, setMode, setSellerOnboardingComplete, setBuyerOnboardingComplete, setDropType]);
  const [activeBuyerTab, setActiveBuyerTab] = useState<BuyerTab>("discover");
  const [condition, setCondition] = useState("Excellent");
  const [selectedItem, setSelectedItem] = useState<MockItem | null>(null);
  const [selectedPickupSlot, setSelectedPickupSlot] = useState<string | null>(null);
  const [browseCategory, setBrowseCategory] = useState<string>("");
  const [browseSearch, setBrowseSearch] = useState("");
  const [buyerOnboardingStep, setBuyerOnboardingStep] = useState(1);
  const [postalCode, setPostalCode] = useState("");
  const [onboardingSubmitting, setOnboardingSubmitting] = useState(false);
  const [onboardingError, setOnboardingError] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [notifyClaims, setNotifyClaims] = useState(true);
  const [notifyNewItems, setNotifyNewItems] = useState(true);

  // ── Moving Sale application status ───────────────────────────
  const [movingSaleApp, setMovingSaleApp] = useState<{ status: string; preferredWeekend: string; approvedWeekend?: string; createdAt: string } | null>(null);
  const [checkStatusLoading, setCheckStatusLoading] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  // ── Item view/edit panel ──────────────────────────────────────
  const [itemPanel, setItemPanel] = useState<ApiItem | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null);
  const [editPhotoKey, setEditPhotoKey] = useState<string | null>(null);
  const [editPhotoUploading, setEditPhotoUploading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // ── Claim modal state ─────────────────────────────────────────
  type ClaimModalItem = { id: string; title: string; price: number };
  const [claimModalItem, setClaimModalItem] = useState<ClaimModalItem | null>(null);
  const [claimPickupSlot, setClaimPickupSlot] = useState("");
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimError, setClaimError] = useState("");
  const [claimedItemIds, setClaimedItemIds] = useState<Set<string>>(new Set());

  // ── Buyer's own claims ────────────────────────────────────────
  type BuyerClaim = {
    id: string;
    status: string;
    pickupSlot: string;
    createdAt: string;
    item: { id: string; title: string; price: number; photos: string[] };
    seller: { id: string; name: string; neighborhood: string | null };
  };
  const [myBuyerClaims, setMyBuyerClaims] = useState<BuyerClaim[]>([]);

  useEffect(() => {
    if (mode !== "buyer" || !accessToken) return;
    apiRequest<{ claims: BuyerClaim[] }>("/api/claims/mine", { token: accessToken })
      .then(({ claims }) => {
        setMyBuyerClaims(claims);
        setClaimedItemIds(new Set(claims.filter(c => c.status === "PENDING" || c.status === "CONFIRMED").map(c => c.item.id)));
      })
      .catch(() => {});
  }, [mode, accessToken]);

  // ── Incoming claims (seller) ──────────────────────────────────
  type IncomingClaim = {
    id: string;
    status: string;
    pickupSlot: string;
    createdAt: string;
    item: { id: string; title: string; price: number; photos: string[] };
    buyer: { id: string; name: string; email: string };
  };
  const [incomingClaims, setIncomingClaims] = useState<IncomingClaim[]>([]);
  const [claimsLoading, setClaimsLoading] = useState(false);

  useEffect(() => {
    if (mode !== "seller" || !accessToken) return;
    setClaimsLoading(true);
    apiRequest<{ claims: IncomingClaim[] }>("/api/claims/incoming", { token: accessToken })
      .then(({ claims }) => setIncomingClaims(claims))
      .catch(() => {})
      .finally(() => setClaimsLoading(false));
  }, [mode, accessToken]);

  useEffect(() => {
    if (mode !== "seller" || !accessToken) return;
    if (user?.role !== "BOTH") return;
    apiRequest<{ movingSale: typeof movingSaleApp }>("/api/moving-sale/mine", { token: accessToken })
      .then(({ movingSale }) => setMovingSaleApp(movingSale))
      .catch(() => {});
  }, [mode, accessToken, user?.role]);

  // ── Real items state ──────────────────────────────────────────
  const [sellerItems, setSellerItems] = useState<ApiItem[]>([]);
  const [sellerItemsLoading, setSellerItemsLoading] = useState(false);
  const [browseItems, setBrowseItems] = useState<ApiItem[]>([]);
  const [browseLoading, setBrowseLoading] = useState(false);

  // ── Watchlist (real API) ──────────────────────────────────────
  const [savedItems, setSavedItems] = useState<ApiItem[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (mode !== "buyer" || !accessToken) return;
    apiRequest<{ items: ApiItem[] }>("/api/watchlist")
      .then(({ items }) => {
        setSavedItems(items);
        setSavedIds(new Set(items.map(i => i.id)));
      })
      .catch(() => {});
  }, [mode, accessToken]);

  const toggleWatchlistReal = async (item: ApiItem) => {
    const isSaved = savedIds.has(item.id);
    if (isSaved) {
      setSavedIds(ids => { const n = new Set(ids); n.delete(item.id); return n; });
      setSavedItems(items => items.filter(i => i.id !== item.id));
      await apiRequest(`/api/watchlist/${item.id}`, { method: "DELETE" }).catch(() => {});
    } else {
      setSavedIds(ids => new Set([...ids, item.id]));
      setSavedItems(items => [item, ...items]);
      await apiRequest(`/api/watchlist/${item.id}`, { method: "POST" }).catch(() => {});
    }
  };

  // ── List item form state ─────────────────────────────────────
  const [listTitle, setListTitle] = useState("");
  const [listDescription, setListDescription] = useState("");
  const [listCategory, setListCategory] = useState("Furniture");
  const [listPrice, setListPrice] = useState("");
  const [listOriginalPrice, setListOriginalPrice] = useState("");
  const [listSubmitting, setListSubmitting] = useState(false);
  const [listError, setListError] = useState("");
  const [listPhotoKeys, setListPhotoKeys] = useState<string[]>([]);
  const [listPhotoPreviews, setListPhotoPreviews] = useState<string[]>([]);
  const [listPhotoUploading, setListPhotoUploading] = useState(false);
  const [photoInputKey, setPhotoInputKey] = useState(0);

  // Fetch seller's items
  useEffect(() => {
    if (mode !== "seller" || !accessToken) return;
    setSellerItemsLoading(true);
    apiRequest<{ items: ApiItem[] }>("/api/items/mine", { token: accessToken })
      .then(({ items }) => setSellerItems(items))
      .catch(() => {})
      .finally(() => setSellerItemsLoading(false));
  }, [mode, accessToken, activeSellerTab]);

  // Fetch browse items
  useEffect(() => {
    if (mode !== "buyer") return;
    setBrowseLoading(true);
    const params = new URLSearchParams();
    if (browseCategory) params.set("category", CATEGORY_MAP[browseCategory] || browseCategory);
    if (browseSearch) params.set("search", browseSearch);
    apiRequest<{ items: ApiItem[] }>(`/api/items?${params}`)
      .then(({ items }) => setBrowseItems(items))
      .catch(() => {})
      .finally(() => setBrowseLoading(false));
  }, [mode, browseCategory, browseSearch]);

  const handleListItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    setListError("");
    setListSubmitting(true);
    try {
      if (listPhotoPreviews.length > 0 && listPhotoKeys.length !== listPhotoPreviews.length) {
        throw new Error("Please wait for photos to finish uploading.");
      }

      await apiRequest("/api/items", {
        method: "POST",
        token: accessToken,
        body: JSON.stringify({
          title: listTitle,
          description: listDescription,
          category: CATEGORY_MAP[listCategory] || "OTHER",
          condition: CONDITION_MAP[condition] || "GOOD",
          price: parseFloat(listPrice),
          originalPrice: listOriginalPrice ? parseFloat(listOriginalPrice) : undefined,
          photos: listPhotoKeys.length > 0 ? listPhotoKeys : undefined,
          isMovingSale: false,
        }),
      });
      // Reset form and go to My Items
      setListTitle(""); setListDescription(""); setListPrice(""); setListOriginalPrice("");
      listPhotoPreviews.forEach((u) => URL.revokeObjectURL(u));
      setListPhotoPreviews([]);
      setListPhotoKeys([]);
      setPhotoInputKey((k) => k + 1);
      setActiveSellerTab("items");
    } catch (err: unknown) {
      setListError(err instanceof Error ? err.message : "Failed to list item");
    } finally {
      setListSubmitting(false);
    }
  };

  const sellerTabs: { id: SellerTab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "items", label: "My Items", icon: Package },
    { id: "claims", label: "Incoming Claims", icon: ShoppingBag },
    { id: "pickups", label: "Pickups", icon: MapPin },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "list", label: "List Item", icon: Plus },
    { id: "moving-sale", label: sellerOnboardingComplete ? "My Drop" : user?.role === "BOTH" ? "Pending Approval" : "Start a Moving Sale", icon: Truck },
    { id: "history", label: "History", icon: History },
  ];

  const buyerTabs: { id: BuyerTab; label: string; icon: React.ElementType }[] = [
    { id: "discover", label: "Discover", icon: Compass },
    { id: "browse", label: "Browse", icon: Search },
    { id: "saved", label: "Saved", icon: Heart },
    { id: "claims", label: "Claims", icon: ShoppingBag },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "history", label: "History", icon: History },
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

  const PICKUP_SLOTS = [
    { id: "sat-morning",   label: "Saturday Morning",   time: "9am – 12pm" },
    { id: "sat-afternoon", label: "Saturday Afternoon",  time: "12pm – 4pm" },
    { id: "sat-evening",   label: "Saturday Evening",    time: "4pm – 7pm" },
    { id: "sun-morning",   label: "Sunday Morning",      time: "10am – 1pm" },
    { id: "sun-afternoon", label: "Sunday Afternoon",    time: "1pm – 5pm" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* ── Item view/edit panel ── */}
      {itemPanel && (
        <>
          <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setItemPanel(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">{editMode ? "Edit Item" : "Item Details"}</h2>
              <button onClick={() => setItemPanel(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Photo */}
              <div className="aspect-video bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden relative group">
                {editMode ? (
                  <>
                    {editPhotoPreview || itemPanel.photos[0] ? (
                      <img
                        src={editPhotoPreview ?? itemPanel.photos[0]}
                        alt={itemPanel.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package size={48} className="text-gray-300" />
                    )}
                    <label className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-medium shadow-sm cursor-pointer hover:bg-black/70">
                      <Upload size={12} />
                      <span>Change photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={editSaving || editPhotoUploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (!file.type.startsWith("image/")) {
                            setEditError("Only image files are allowed.");
                            return;
                          }
                          const previewUrl = URL.createObjectURL(file);
                          setEditPhotoPreview(previewUrl);
                          setEditPhotoKey(null);
                          setEditError("");
                          setEditPhotoUploading(true);
                          (async () => {
                            try {
                              const { key, publicUrl } = await uploadItemPhoto(file);
                              setEditPhotoKey(key);
                              setItemPanel(prev =>
                                prev ? { ...prev, photos: [publicUrl, ...prev.photos.slice(1)] } : prev
                              );
                            } catch (err) {
                              URL.revokeObjectURL(previewUrl);
                              setEditPhotoPreview(null);
                              setEditPhotoKey(null);
                              setEditError(err instanceof Error ? err.message : "Photo upload failed.");
                            } finally {
                              setEditPhotoUploading(false);
                              e.target.value = "";
                            }
                          })();
                        }}
                      />
                    </label>
                  </>
                ) : (
                  <>
                    {itemPanel.photos[0]
                      ? <img src={itemPanel.photos[0]} alt={itemPanel.title} className="w-full h-full object-cover" />
                      : <Package size={48} className="text-gray-300" />
                    }
                  </>
                )}
              </div>

              {/* Status badge */}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  itemPanel.status === "LIVE" ? "bg-emerald-100 text-emerald-700"
                  : itemPanel.status === "CLAIMED" ? "bg-amber-100 text-amber-700"
                  : itemPanel.status === "ARCHIVED" ? "bg-gray-100 text-gray-500"
                  : "bg-blue-100 text-blue-700"
                }`}>{itemPanel.status}</span>
                <span className="text-xs text-gray-400">{itemPanel.category} · {itemPanel.condition}</span>
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} rows={4} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none" />
                  </div>
                  {editPhotoUploading && (
                    <p className="text-[11px] text-emerald-700 flex items-center gap-1.5">
                      <Loader2 size={12} className="animate-spin" />
                      Uploading photo…
                    </p>
                  )}
                  {editError && <p className="text-red-600 text-sm">{editError}</p>}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-xl">{itemPanel.title}</h3>
                    <p className="text-emerald-600 font-bold text-2xl mt-1">${itemPanel.price}</p>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{itemPanel.description}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400">Watchers</p>
                      <p className="font-bold text-gray-800">{itemPanel._count?.watchlist ?? 0}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400">Claims</p>
                      <p className="font-bold text-gray-800">{itemPanel._count?.claims ?? 0}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              {editMode ? (
                <>
                  <button onClick={() => setEditMode(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button
                    disabled={
                      editSaving ||
                      editPhotoUploading ||
                      (editPhotoPreview !== null && !editPhotoKey)
                    }
                    onClick={async () => {
                      setEditSaving(true); setEditError("");
                      try {
                        const payload: Record<string, unknown> = {
                          title: editTitle,
                          price: parseFloat(editPrice),
                          description: editDescription,
                        };
                        if (editPhotoKey) {
                          payload.photos = [editPhotoKey];
                        }
                        const updated = await apiRequest<{ item: ApiItem }>(`/api/items/${itemPanel.id}`, {
                          method: "PATCH",
                          body: JSON.stringify(payload),
                        });
                        setSellerItems(items => items.map(i => i.id === updated.item.id ? updated.item : i));
                        setBrowseItems(items => items.map(i => i.id === updated.item.id ? updated.item : i));
                        setSavedItems(items => items.map(i => i.id === updated.item.id ? updated.item : i));
                        setItemPanel(updated.item);
                        setEditMode(false);
                      } catch (err) {
                        setEditError(err instanceof Error ? err.message : "Save failed");
                      } finally {
                        setEditSaving(false);
                      }
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {editSaving && <Loader2 size={14} className="animate-spin" />}
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditMode(true);
                      setEditTitle(itemPanel.title);
                      setEditPrice(String(itemPanel.price));
                      setEditDescription(itemPanel.description);
                      setEditPhotoPreview(null);
                      setEditPhotoKey(null);
                      setEditPhotoUploading(false);
                      setEditError("");
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <FileText size={15} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 flex items-center justify-center gap-2"
                  >
                    <X size={15} /> Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Delete confirmation modal ── */}
      {deleteConfirmOpen && itemPanel && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Delete Item</h2>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to delete <span className="font-medium text-gray-700">{itemPanel.title}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-5 flex gap-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={deleteSubmitting}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!itemPanel) return;
                  setDeleteSubmitting(true);
                  try {
                    await apiRequest(`/api/items/${itemPanel.id}`, { method: "DELETE" });
                    setSellerItems((items) => items.filter((i) => i.id !== itemPanel.id));
                    setDeleteConfirmOpen(false);
                    setItemPanel(null);
                  } catch {
                    setDeleteConfirmOpen(false);
                  } finally {
                    setDeleteSubmitting(false);
                  }
                }}
                disabled={deleteSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleteSubmitting && <Loader2 size={14} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Claim modal ── */}
      {claimModalItem && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Claim Item</h2>
                <p className="text-sm text-gray-500 mt-0.5">{claimModalItem.title} · <span className="text-emerald-600 font-semibold">${claimModalItem.price}</span></p>
              </div>
              <div className="p-6 space-y-3">
                <p className="text-sm font-semibold text-gray-700">Choose a pickup slot</p>
                {PICKUP_SLOTS.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => setClaimPickupSlot(slot.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition-all ${
                      claimPickupSlot === slot.id
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-emerald-300"
                    }`}
                  >
                    <span className="font-medium text-sm text-gray-800">{slot.label}</span>
                    <span className="text-xs text-gray-500">{slot.time}</span>
                  </button>
                ))}
                {claimError && <p className="text-red-600 text-sm">{claimError}</p>}
              </div>
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => setClaimModalItem(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!claimPickupSlot) { setClaimError("Please select a pickup slot"); return; }
                    setClaimSubmitting(true);
                    setClaimError("");
                    try {
                      const slotLabel = PICKUP_SLOTS.find(s => s.id === claimPickupSlot)!;
                      const { claim } = await apiRequest<{ claim: BuyerClaim }>("/api/claims", {
                        method: "POST",
                        body: JSON.stringify({ itemId: claimModalItem.id, pickupSlot: `${slotLabel.label} (${slotLabel.time})` }),
                      });
                      setMyBuyerClaims(cs => [claim, ...cs]);
                      setClaimedItemIds(ids => new Set([...ids, claimModalItem.id]));
                      setClaimModalItem(null);
                    } catch (err) {
                      setClaimError(err instanceof Error ? err.message : "Failed to claim item");
                    } finally {
                      setClaimSubmitting(false);
                    }
                  }}
                  disabled={claimSubmitting || !claimPickupSlot}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {claimSubmitting && <Loader2 size={14} className="animate-spin" />}
                  Confirm Claim
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 h-14 bg-white/80 backdrop-blur-2xl border-b border-gray-100 flex items-center px-4 gap-4 relative">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <DropYardLogo size="default" />
          <DropYardWordmark className="text-lg font-bold" />
        </Link>
        {/* Phase pill — centered */}
        <div className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
          phase === "LIVE"
            ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
            : phase === "PREVIEW"
              ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
              : phase === "SUBMISSION"
                ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
                : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
        }`}>
          {phase === "LIVE" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          <span className="opacity-50 font-normal">Drop:</span>
          {phaseLabel}
          <span className="opacity-60 font-normal hidden md:inline">{phaseDescription}</span>
          <span className="font-mono opacity-75 bg-black/5 px-1.5 py-0.5 rounded" suppressHydrationWarning>{countdownLabel}</span>
        </div>

        <div className="flex-1" />


        {/* Avatar + sign out */}
        <div className="flex items-center gap-2">
          <button
            suppressHydrationWarning
            onClick={() => setAvatarMenuOpen(o => !o)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-amber-400 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm hover:ring-emerald-300 transition-all"
          >
            {user?.name ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?"}
          </button>
          {avatarMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setAvatarMenuOpen(false)} />
              <div className="absolute right-4 top-12 z-50 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-3">
                  <p suppressHydrationWarning className="text-sm font-semibold text-gray-900 truncate">{user?.name ?? ""}</p>
                  <p suppressHydrationWarning className="text-xs text-gray-400 truncate mt-0.5">{user?.email ?? ""}</p>
                </div>
              </div>
            </>
          )}
          <button
            onClick={signout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </header>

      {/* ── Body: sidebar + content ── */}
      <div className="flex flex-1 min-h-0">

        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-gray-100/80">

          {/* Mode toggle */}
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => {
                  setMode("seller");
                  if (!sellerOnboardingComplete) setActiveSellerTab("moving-sale");
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === "seller"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Seller
              </button>
              <button
                onClick={() => setMode("buyer")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === "buyer"
                    ? "bg-white text-amber-500 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Buyer
              </button>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 py-2">
              {mode === "seller" ? "Manage" : "Explore"}
            </p>
            {navTabs.map((tab) => {
              const listDisabled = mode === "seller" && tab.id === "list" && !canListItem;
              const isActive = activeTab === tab.id;
              const accent = mode === "seller" ? "emerald" : "amber";
              return (
                <button
                  key={tab.id}
                  onClick={() => !listDisabled && setActiveTab(tab.id as SellerTab & BuyerTab)}
                  disabled={listDisabled}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-all group ${
                    listDisabled
                      ? "opacity-40 cursor-not-allowed text-gray-400"
                      : isActive
                        ? accent === "emerald"
                          ? "bg-emerald-50 text-emerald-700 font-semibold"
                          : "bg-amber-50 text-amber-700 font-semibold"
                        : "text-gray-500 font-medium hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <span className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-all ${
                    listDisabled
                      ? "bg-gray-100 text-gray-400"
                      : isActive
                        ? accent === "emerald"
                          ? "bg-emerald-500 text-white shadow-sm shadow-emerald-200"
                          : "bg-amber-500 text-white shadow-sm shadow-amber-200"
                        : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600"
                  }`}>
                    <tab.icon size={14} />
                  </span>
                  <span className="flex-1 truncate">{tab.label}</span>
                  {tab.id === "list" && listDisabled && (
                    <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                      {dropType === "weekly" ? "Mon" : "Setup"}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Dev: phase simulator */}
          <div className="px-4 pb-4 border-t border-gray-100 pt-3">
            <p className="text-[9px] font-semibold text-gray-300 uppercase tracking-widest mb-1.5">Dev: Simulate Phase</p>
            <select
              value={simulatedDate ? phase : "__live__"}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "__live__") { setSimulatedDate(null); return; }
                const dates: Record<string, string> = {
                  SUBMISSION: "2026-02-16T12:00:00",
                  PREVIEW: "2026-02-20T12:00:00",
                  LIVE: "2026-02-21T10:00:00",
                  CLOSED: "2026-02-22T21:00:00",
                };
                setSimulatedDate(new Date(dates[v] ?? dates.SUBMISSION));
              }}
              className="w-full text-xs px-2 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 focus:outline-none"
            >
              <option value="__live__">Real time</option>
              <option value="SUBMISSION">Submission</option>
              <option value="PREVIEW">Preview</option>
              <option value="LIVE">Live</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 p-4 lg:p-6 overflow-y-auto">
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
                          {onboardingError && (
                            <p className="text-red-600 text-sm mb-3">{onboardingError}</p>
                          )}
                          <button
                            onClick={async () => {
                              setOnboardingSubmitting(true);
                              setOnboardingError("");
                              try {
                                const token = localStorage.getItem('dy_access_token') ?? accessToken ?? undefined;
                                await apiRequest('/api/auth/profile', {
                                  method: 'PATCH',
                                  token,
                                  body: JSON.stringify({
                                    postalCode,
                                    interests: selectedInterests,
                                  }),
                                });
                                await refreshUser();
                                setBuyerOnboardingComplete(true);
                              } catch (err) {
                                setOnboardingError(err instanceof Error ? err.message : "Setup failed. Please try again.");
                              } finally {
                                setOnboardingSubmitting(false);
                              }
                            }}
                            disabled={onboardingSubmitting}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl font-medium text-sm hover:bg-amber-600 disabled:opacity-60"
                          >
                            {onboardingSubmitting && <Loader2 size={14} className="animate-spin" />}
                            Finish Setup
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
                  {browseLoading ? (
                    <div className="py-12 text-center text-gray-400 text-sm">Loading items…</div>
                  ) : browseItems.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 text-sm">No items found for this drop yet.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {browseItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                          <div className="aspect-video bg-gray-50 flex items-center justify-center relative">
                            {item.photos.length > 0
                              ? <img src={item.photos[0]} alt={item.title} className="w-full h-full object-cover" />
                              : <Package size={36} className="text-gray-300" />
                            }
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleWatchlistReal(item); }}
                              className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow ${savedIds.has(item.id) ? "bg-red-500 text-white" : "bg-white text-gray-400"}`}
                            >
                              <Heart size={14} fill={savedIds.has(item.id) ? "currentColor" : "none"} />
                            </button>
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{item.category}</p>
                            <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-emerald-600 font-bold">${item.price}</span>
                              <span className="text-xs text-gray-400">{item.seller?.neighborhood ?? item.zone}</span>
                            </div>
                            {canBuyersClaim && (
                              claimedItemIds.has(item.id) ? (
                                <div className="mt-3 w-full py-2 rounded-xl bg-amber-50 text-amber-700 text-sm font-medium text-center">
                                  Claimed
                                </div>
                              ) : (
                                <button
                                  onClick={(e) => { e.stopPropagation(); setClaimModalItem({ id: item.id, title: item.title, price: item.price }); setClaimPickupSlot(""); setClaimError(""); }}
                                  className="mt-3 w-full py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                                >
                                  Claim
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  </>
                  )}
                </div>
              )}

              {activeBuyerTab === "saved" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Saved Items</h2>
                  {savedItems.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                      <Heart size={40} className="mx-auto mb-3 text-gray-200" />
                      <p className="text-gray-500 font-medium">No saved items yet</p>
                      <p className="text-gray-400 text-sm mt-1">Tap the heart on any item to save it</p>
                      <button onClick={() => setActiveBuyerTab("browse")} className="mt-4 px-5 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600">
                        Browse Items
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                          <div className="aspect-video bg-gray-50 flex items-center justify-center relative">
                            {item.photos[0]
                              ? <img src={item.photos[0]} alt={item.title} className="w-full h-full object-cover" />
                              : <Package size={36} className="text-gray-300" />
                            }
                            <button
                              onClick={() => toggleWatchlistReal(item)}
                              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600 transition-colors"
                            >
                              <Heart size={14} fill="currentColor" />
                            </button>
                            <span className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${item.status === "LIVE" ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{item.category}</p>
                            <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-emerald-600 font-bold">${item.price}</span>
                              {canBuyersClaim && item.status === "LIVE" && !claimedItemIds.has(item.id) && (
                                <button
                                  onClick={() => { setClaimModalItem({ id: item.id, title: item.title, price: item.price }); setClaimPickupSlot(""); setClaimError(""); }}
                                  className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700"
                                >
                                  Claim
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeBuyerTab === "claims" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Your Claims</h2>
                    <p className="text-gray-500 text-sm">Items you've claimed and their pickup status</p>
                  </div>
                  {myBuyerClaims.length === 0 ? (
                    <div className="py-16 text-center">
                      <ShoppingBag size={36} className="text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No claims yet</p>
                      <p className="text-gray-400 text-sm mt-1">Browse items and claim what you want during the Live drop</p>
                      <button onClick={() => setActiveBuyerTab("browse")} className="mt-4 px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700">
                        Browse Items
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {myBuyerClaims.map((claim) => (
                        <div key={claim.id} className="flex items-center gap-4 p-5 hover:bg-gray-50/50 transition-colors">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                            {claim.item.photos[0]
                              ? <img src={claim.item.photos[0]} alt={claim.item.title} className="w-full h-full object-cover" />
                              : <Package size={22} className="text-gray-400" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{claim.item.title}</h3>
                            <p className="text-sm text-gray-500">{claim.seller.name} · {new Date(claim.createdAt).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}</p>
                            <p className="text-xs text-amber-600 mt-0.5">Pickup: {claim.pickupSlot}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-emerald-600 font-bold text-sm">${claim.item.price}</p>
                            <span className={`mt-1 inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              claim.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-700"
                              : claim.status === "REJECTED" ? "bg-red-100 text-red-600"
                              : claim.status === "PICKED_UP" ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                            }`}>
                              {claim.status === "PENDING" ? "Awaiting confirmation"
                               : claim.status === "CONFIRMED" ? "Confirmed"
                               : claim.status === "REJECTED" ? "Rejected"
                               : "Picked up"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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

              {/* History Tab — Buyer */}
              {activeBuyerTab === "history" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Drop History</h2>
                    <p className="text-gray-500 mt-1">Your activity across past weekly drops</p>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { label: "Drops Attended", value: "5", icon: Calendar, bg: "bg-emerald-100", text: "text-emerald-600" },
                      { label: "Items Claimed", value: "12", icon: ShoppingBag, bg: "bg-amber-100", text: "text-amber-600" },
                      { label: "Total Spent", value: "$620", icon: DollarSign, bg: "bg-teal-100", text: "text-teal-600" },
                      { label: "Total Saved", value: "$1,610", icon: TrendingDown, bg: "bg-purple-100", text: "text-purple-600" },
                      { label: "vs Retail", value: "72%", icon: Sparkles, bg: "bg-pink-100", text: "text-pink-600" },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                        <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                          <stat.icon size={20} className={stat.text} />
                        </div>
                        <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Past Drops */}
                  <div className="space-y-4">
                    {[
                      {
                        dates: "Feb 22–23, 2025",
                        neighborhood: "Barrhaven",
                        available: 38,
                        claimed: 4,
                        spent: "$185",
                        browsed: 12,
                        saved: 3,
                        savedDollars: "$390",
                        badge: "Most Active",
                        badgeColor: "bg-emerald-100 text-emerald-700",
                      },
                      {
                        dates: "Feb 15–16, 2025",
                        neighborhood: "Westboro",
                        available: 42,
                        claimed: 2,
                        spent: "$95",
                        browsed: 8,
                        saved: 1,
                        savedDollars: "$155",
                        badge: null,
                        badgeColor: "",
                      },
                      {
                        dates: "Feb 8–9, 2025",
                        neighborhood: "Glebe",
                        available: 29,
                        claimed: 3,
                        spent: "$140",
                        browsed: 11,
                        saved: 2,
                        savedDollars: "$280",
                        badge: null,
                        badgeColor: "",
                      },
                      {
                        dates: "Feb 1–2, 2025",
                        neighborhood: "Kanata",
                        available: 35,
                        claimed: 2,
                        spent: "$110",
                        browsed: 9,
                        saved: 1,
                        savedDollars: "$210",
                        badge: null,
                        badgeColor: "",
                      },
                      {
                        dates: "Jan 25–26, 2025",
                        neighborhood: "Orleans",
                        available: 31,
                        claimed: 1,
                        spent: "$90",
                        browsed: 6,
                        saved: 0,
                        savedDollars: "$575",
                        badge: "First Drop",
                        badgeColor: "bg-blue-100 text-blue-700",
                      },
                    ].map((drop) => (
                      <div key={drop.dates} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-gray-900">{drop.dates}</h3>
                                {drop.badge && (
                                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${drop.badgeColor}`}>{drop.badge}</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                                <MapPin size={13} /> {drop.neighborhood}
                              </p>
                            </div>
                            <span className="text-sm text-gray-400">{drop.available} items available</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                              <p className="text-lg font-bold text-gray-900">{drop.claimed}</p>
                              <p className="text-xs text-gray-500">Claimed</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                              <p className="text-lg font-bold text-gray-900">{drop.spent}</p>
                              <p className="text-xs text-gray-500">Spent</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                              <p className="text-lg font-bold text-gray-900">{drop.browsed}</p>
                              <p className="text-xs text-gray-500">Browsed</p>
                            </div>
                            <div className="bg-emerald-50 rounded-xl p-3 text-center">
                              <p className="text-lg font-bold text-emerald-700">{drop.savedDollars}</p>
                              <p className="text-xs text-emerald-600">Saved vs Retail</p>
                            </div>
                          </div>
                        </div>
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
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Items Listed",
                        value: String(sellerItems.length),
                        icon: Package,
                        bg: "bg-emerald-100",
                        text: "text-emerald-600",
                      },
                      {
                        label: "Incoming Claims",
                        value: String(sellerItems.reduce((s, i) => s + (i._count?.claims ?? 0), 0)),
                        icon: ShoppingBag,
                        bg: "bg-amber-100",
                        text: "text-amber-600",
                      },
                      {
                        label: "Total Revenue",
                        value: `$${sellerItems.filter(i => i.status === "CLAIMED" || i.status === "SOLD").reduce((s, i) => s + i.price, 0).toLocaleString()}`,
                        icon: DollarSign,
                        bg: "bg-teal-100",
                        text: "text-teal-600",
                      },
                      {
                        label: "Total Watchers",
                        value: String(sellerItems.reduce((s, i) => s + (i._count?.watchlist ?? 0), 0)),
                        icon: Eye,
                        bg: "bg-purple-100",
                        text: "text-purple-600",
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
                            : setActiveSellerTab("moving-sale")
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

              {activeSellerTab === "moving-sale" && (
                <>
                  {/* State 1: Not yet registered → show form */}
                  {user?.role !== "BOTH" && !sellerOnboardingComplete && (
                    <MovingSaleRegistration />
                  )}

                  {/* State 2: Submitted, pending review */}
                  {user?.role === "BOTH" && !sellerOnboardingComplete && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center space-y-5">
                      <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
                        <Clock size={32} className="text-amber-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Application Under Review</h2>
                        <p className="text-gray-500 text-sm max-w-sm mx-auto">
                          We've received your Moving Sale Drop application and are reviewing it. We'll get back to you within 24 hours.
                        </p>
                      </div>
                      {movingSaleApp && (
                        <div className="inline-flex flex-col items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-8 py-5">
                          <div className="flex items-center gap-2 text-sm text-amber-700">
                            <Calendar size={15} />
                            <span>Requested weekend: <strong>{movingSaleApp.preferredWeekend}</strong></span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-amber-600">
                            <Clock size={13} />
                            Submitted {new Date(movingSaleApp.createdAt).toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" })}
                          </div>
                        </div>
                      )}
                      <div className="space-y-2 pt-2">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">What happens next</p>
                        {[
                          "Admin reviews your application",
                          "You'll be notified of approval",
                          "Your seller dashboard unlocks",
                          "Start listing items for your drop",
                        ].map((step, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-xs flex items-center justify-center font-bold shrink-0">{i + 1}</div>
                            {step}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={async () => {
                          setCheckStatusLoading(true);
                          try {
                            await refreshUser();
                            if (accessToken) {
                              const { movingSale } = await apiRequest<{ movingSale: typeof movingSaleApp }>("/api/moving-sale/mine", { token: accessToken });
                              setMovingSaleApp(movingSale);
                            }
                          } catch {
                            // silently ignore
                          } finally {
                            setCheckStatusLoading(false);
                          }
                        }}
                        disabled={checkStatusLoading}
                        className="mt-2 flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                      >
                        {checkStatusLoading && <Loader2 size={15} className="animate-spin" />}
                        Check Status
                      </button>
                    </div>
                  )}

                  {/* State 3: Approved — show drop summary + CTA */}
                  {sellerOnboardingComplete && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center space-y-5">
                      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                        <CheckCircle size={32} className="text-emerald-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Your Drop is Approved!</h2>
                        <p className="text-gray-500 text-sm max-w-sm mx-auto">
                          {sellerItems.length > 0
                            ? `You have ${sellerItems.length} item${sellerItems.length === 1 ? "" : "s"} listed. Keep adding more to maximise your drop!`
                            : "You're all set. Start listing items for your Moving Sale Drop — buyers can browse them during the preview window."}
                        </p>
                      </div>
                      {movingSaleApp && (
                        <div className="inline-flex flex-col items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-8 py-5">
                          <div className="flex items-center gap-2 text-sm text-emerald-700">
                            <Calendar size={15} />
                            <span>Your weekend: <strong>{movingSaleApp.approvedWeekend ?? movingSaleApp.preferredWeekend}</strong></span>
                          </div>
                          {sellerItems.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-emerald-700">
                              <Package size={15} />
                              <span><strong>{sellerItems.length}</strong> item{sellerItems.length === 1 ? "" : "s"} listed</span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                        <button
                          onClick={() => setActiveSellerTab("list")}
                          className="flex items-center gap-2 justify-center px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                        >
                          <Plus size={16} />
                          {sellerItems.length > 0 ? "Add Another Item" : "List Your First Item"}
                        </button>
                        <button
                          onClick={() => setActiveSellerTab("items")}
                          className="flex items-center gap-2 justify-center px-6 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
                        >
                          <Package size={16} />
                          View My Items {sellerItems.length > 0 && `(${sellerItems.length})`}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeSellerTab === "items" && (
                <div className="space-y-4">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Active Listings", value: String(sellerItems.filter(i => i.status === "LIVE").length), color: "text-emerald-600" },
                      { label: "Total Watchers", value: String(sellerItems.reduce((s, i) => s + (i._count?.watchlist ?? 0), 0)), color: "text-purple-600" },
                      { label: "Pending Claims", value: String(sellerItems.reduce((s, i) => s + (i._count?.claims ?? 0), 0)), color: "text-amber-600" },
                    ].map((s) => (
                      <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Items grid */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold text-gray-900">My Items ({sellerItems.length})</h2>
                      <button
                        onClick={() => setActiveSellerTab("list")}
                        className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-colors"
                      >
                        <Plus size={15} />
                        Add Item
                      </button>
                    </div>

                    {sellerItemsLoading ? (
                      <div className="py-12 text-center text-gray-400 text-sm">Loading items…</div>
                    ) : sellerItems.length === 0 ? (
                      <div className="py-12 text-center">
                        <p className="text-gray-500 mb-3">No items yet.</p>
                        <button onClick={() => setActiveSellerTab("list")} className="text-emerald-600 font-semibold text-sm hover:underline">List your first item →</button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {sellerItems.map((item) => (
                          <div key={item.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow group">
                            <div className="aspect-square bg-gray-50 flex items-center justify-center relative">
                              {item.photos.length > 0 ? (
                                <img src={item.photos[0]} alt={item.title} className="w-full h-full object-cover" />
                              ) : (
                                <Package size={40} className="text-gray-300" />
                              )}
                              <div className="absolute top-2 right-2 bg-purple-600/90 text-white text-xs py-0.5 px-2 rounded-full flex items-center gap-1">
                                <Eye size={10} />{item._count?.watchlist ?? 0}
                              </div>
                              {item.isMovingSale && (
                                <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">MS</div>
                              )}
                              {item.status === "CLAIMED" && (
                                <div className="absolute bottom-2 left-2 right-2 bg-amber-500 text-white text-xs py-1 rounded text-center font-medium">Claimed</div>
                              )}
                              {item.status === "LIVE" && (
                                <div className="absolute bottom-2 left-2 right-2 bg-emerald-600/90 text-white text-xs py-1 rounded text-center font-medium flex items-center justify-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />Live
                                </div>
                              )}
                              {/* Hover overlay with View / Edit */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                  onClick={() => { setItemPanel(item); setEditMode(false); }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-gray-800 text-xs font-semibold hover:bg-gray-100 transition-colors"
                                >
                                  <Eye size={13} /> View
                                </button>
                                <button
                                  onClick={() => { setItemPanel(item); setEditMode(true); setEditTitle(item.title); setEditPrice(String(item.price)); setEditDescription(item.description); setEditError(""); }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                                >
                                  <FileText size={13} /> Edit
                                </button>
                              </div>
                            </div>
                            <div className="p-3 border-t border-gray-100">
                              <h3 className="font-semibold text-gray-900 text-sm truncate">{item.title}</h3>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-emerald-600 font-bold text-sm">${item.price}</p>
                                {(item._count?.claims ?? 0) > 0 && (
                                  <span className="text-xs text-amber-600 font-medium flex items-center gap-0.5">
                                    <ShoppingBag size={11} />{item._count!.claims} claim
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeSellerTab === "claims" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Incoming Claims</h2>
                    <p className="text-gray-500 text-sm">Confirm or reject buyer claims on your items</p>
                  </div>
                  {claimsLoading ? (
                    <div className="py-12 text-center text-gray-400 text-sm">Loading claims…</div>
                  ) : incomingClaims.length === 0 ? (
                    <div className="py-16 text-center">
                      <ShoppingBag size={36} className="text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No pending claims</p>
                      <p className="text-gray-400 text-sm mt-1">Buyer claims will appear here once your items go live</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {incomingClaims.map((claim) => (
                        <div key={claim.id} className="flex items-center gap-4 p-5 hover:bg-gray-50/50 transition-colors">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                            {claim.item.photos[0]
                              ? <img src={claim.item.photos[0]} alt={claim.item.title} className="w-full h-full object-cover" />
                              : <Package size={22} className="text-gray-400" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{claim.item.title}</h3>
                            <p className="text-sm text-gray-500">
                              {claim.buyer.name} · {new Date(claim.createdAt).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">Pickup: {claim.pickupSlot}</p>
                          </div>
                          <p className="text-emerald-600 font-bold text-sm shrink-0">${claim.item.price}</p>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={async () => {
                                await apiRequest(`/api/claims/${claim.id}/confirm`, { method: "PATCH", token: accessToken ?? undefined });
                                setIncomingClaims(cs => cs.filter(c => c.id !== claim.id));
                              }}
                              className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium text-sm hover:bg-emerald-700 transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={async () => {
                                await apiRequest(`/api/claims/${claim.id}/reject`, { method: "PATCH", token: accessToken ?? undefined });
                                setIncomingClaims(cs => cs.filter(c => c.id !== claim.id));
                              }}
                              className="px-4 py-2 border border-gray-200 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                            onClick={() => setActiveSellerTab("moving-sale")}
                            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
                          >
                            Start a Moving Sale
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
                        <h2 className="text-xl font-bold text-gray-900 mb-2">List a New Item</h2>
                        <p className="text-gray-600 text-sm">Upload photos and publish your listing.</p>
                      </div>
                      <form onSubmit={handleListItem} className="p-6 space-y-6">
                        {listError && (
                          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                            <AlertCircle size={16} className="shrink-0" />
                            {listError}
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Add Item Photo</label>
                          <input
                            key={photoInputKey}
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={listSubmitting || listPhotoUploading}
                            onChange={(e) => {
                              void (async () => {
                                const input = e.target;
                                const files = Array.from(input.files ?? []).slice(0, 5);
                                listPhotoPreviews.forEach((u) => URL.revokeObjectURL(u));
                                if (files.length === 0) {
                                  setListPhotoPreviews([]);
                                  setListPhotoKeys([]);
                                  return;
                                }
                                if (!accessToken) return;
                                const previewUrls = files.map((f) => URL.createObjectURL(f));
                                setListPhotoPreviews(previewUrls);
                                setListPhotoKeys([]);
                                setListError("");
                                setListPhotoUploading(true);
                                try {
                                  const keys: string[] = [];
                                  for (const f of files) {
                                    if (!f.type.startsWith("image/")) {
                                      throw new Error("Only image files are allowed.");
                                    }
                                    const { key } = await uploadItemPhoto(f);
                                    keys.push(key);
                                  }
                                  setListPhotoKeys(keys);
                                } catch (err) {
                                  previewUrls.forEach((u) => URL.revokeObjectURL(u));
                                  setListPhotoPreviews([]);
                                  setListPhotoKeys([]);
                                  setListError(err instanceof Error ? err.message : "Photo upload failed.");
                                } finally {
                                  setListPhotoUploading(false);
                                  input.value = "";
                                }
                              })();
                            }}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            JPG, PNG, WEBP, GIF. Max 10MB each. Files upload as soon as you choose them.
                          </p>
                          {listPhotoUploading && (
                            <p className="text-xs text-emerald-700 mt-2 flex items-center gap-2">
                              <Loader2 size={14} className="animate-spin shrink-0" />
                              Uploading to server…
                            </p>
                          )}
                          {listPhotoPreviews.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {listPhotoPreviews.map((url, idx) => (
                                <div key={`${url}-${idx}`} className="relative">
                                  <img src={url} alt={`Selected ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      URL.revokeObjectURL(url);
                                      setListPhotoKeys((prev) => prev.filter((_, i) => i !== idx));
                                      setListPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
                                    }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50"
                                    aria-label="Remove selected photo"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            required
                            value={listTitle}
                            onChange={(e) => setListTitle(e.target.value)}
                            placeholder="e.g. Vintage Wooden Coffee Table"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <textarea
                            required
                            rows={3}
                            value={listDescription}
                            onChange={(e) => setListDescription(e.target.value)}
                            placeholder="Describe your item (at least 10 characters)..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          <select
                            value={listCategory}
                            onChange={(e) => setListCategory(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                          >
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                          <div className="flex flex-wrap gap-2">
                            {["Like New", "Excellent", "Good", "Fair"].map((c) => (
                              <button
                                type="button"
                                key={c}
                                onClick={() => setCondition(c)}
                                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                  condition === c ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                              >{c}</button>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                            <input
                              type="number"
                              required
                              min="0"
                              step="0.01"
                              value={listPrice}
                              onChange={(e) => setListPrice(e.target.value)}
                              placeholder="99"
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Original price (optional)</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={listOriginalPrice}
                              onChange={(e) => setListOriginalPrice(e.target.value)}
                              placeholder="199"
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          disabled={
                            listSubmitting ||
                            listPhotoUploading ||
                            (listPhotoPreviews.length > 0 &&
                              listPhotoKeys.length !== listPhotoPreviews.length)
                          }
                          className="w-full py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                        >
                          {listSubmitting ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Publishing…</> : <><ImagePlus size={20} />Publish Item</>}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              )}

              {/* History Tab — Seller */}
              {activeSellerTab === "history" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Seller History</h2>
                    <p className="text-gray-500 mt-1">Your performance across past weekly drops</p>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Drops Hosted", value: "4", icon: Calendar, bg: "bg-emerald-100", text: "text-emerald-600" },
                      { label: "Items Sold", value: "18", icon: Package, bg: "bg-amber-100", text: "text-amber-600" },
                      { label: "Total Earned", value: "$940", icon: DollarSign, bg: "bg-teal-100", text: "text-teal-600" },
                      { label: "Avg per Drop", value: "$235", icon: Sparkles, bg: "bg-purple-100", text: "text-purple-600" },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                        <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                          <stat.icon size={20} className={stat.text} />
                        </div>
                        <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Past Drops */}
                  <div className="space-y-4">
                    {[
                      {
                        dates: "Feb 22–23, 2025",
                        neighborhood: "Barrhaven",
                        listed: 12,
                        sold: 7,
                        earned: "$315",
                        claims: 9,
                        badge: "Best Drop",
                        badgeColor: "bg-emerald-100 text-emerald-700",
                      },
                      {
                        dates: "Feb 15–16, 2025",
                        neighborhood: "Westboro",
                        listed: 9,
                        sold: 4,
                        earned: "$210",
                        claims: 5,
                        badge: null,
                        badgeColor: "",
                      },
                      {
                        dates: "Feb 8–9, 2025",
                        neighborhood: "Glebe",
                        listed: 8,
                        sold: 4,
                        earned: "$230",
                        claims: 6,
                        badge: null,
                        badgeColor: "",
                      },
                      {
                        dates: "Feb 1–2, 2025",
                        neighborhood: "Kanata",
                        listed: 6,
                        sold: 3,
                        earned: "$185",
                        claims: 4,
                        badge: "First Drop",
                        badgeColor: "bg-blue-100 text-blue-700",
                      },
                    ].map((drop) => (
                      <div key={drop.dates} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-gray-900">{drop.dates}</h3>
                                {drop.badge && (
                                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${drop.badgeColor}`}>{drop.badge}</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                                <MapPin size={13} /> {drop.neighborhood}
                              </p>
                            </div>
                            <span className="text-sm text-gray-400">{drop.listed} items listed</span>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                              <p className="text-lg font-bold text-gray-900">{drop.sold}</p>
                              <p className="text-xs text-gray-500">Sold</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                              <p className="text-lg font-bold text-gray-900">{drop.claims}</p>
                              <p className="text-xs text-gray-500">Claims</p>
                            </div>
                            <div className="bg-emerald-50 rounded-xl p-3 text-center">
                              <p className="text-lg font-bold text-emerald-700">{drop.earned}</p>
                              <p className="text-xs text-emerald-600">Earned</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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

// ============================================================================
// MOVING SALE REGISTRATION FORM
// ============================================================================

// Seller type label → DB enum
const SELLER_TYPE_MAP: Record<string, string> = {
  individual: 'INDIVIDUAL', church: 'CHURCH', charity: 'CHARITY',
  estate: 'ESTATE', business: 'BUSINESS', community: 'COMMUNITY',
};

function MovingSaleRegistration() {
  const { accessToken, user, refreshUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    sellerType: '',
    contactName: user?.name ?? '',
    organizationName: '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    address: '',
    city: '',
    postalCode: user?.postalCode ?? '',
    neighborhood: user?.neighborhood ?? '',
    saleReason: '',
    estimatedItems: '',
    categories: [] as string[],
    description: '',
    preferredWeekend: '',
    pickupWindows: [] as string[],
    flexibleDates: false,
    needsHelp: [] as string[],
    taxReceipt: false,
    referralSource: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const totalSteps = 6;

  const updateFormData = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: string, item: string) => {
    setFormData(prev => {
      const arr = prev[field as keyof typeof prev] as string[];
      return {
        ...prev,
        [field]: arr.includes(item) ? arr.filter((i: string) => i !== item) : [...arr, item],
      };
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(s => s + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.sellerType !== '';
      case 2: return !!(formData.contactName && formData.email && formData.phone);
      case 3: return !!(formData.address && formData.city && formData.postalCode);
      case 4: return !!(formData.saleReason && formData.estimatedItems && formData.categories.length > 0);
      case 5: return !!(formData.preferredWeekend && formData.pickupWindows.length > 0);
      case 6: return true;
      default: return false;
    }
  };

  const stepLabels = ['Type', 'Contact', 'Location', 'Details', 'Schedule', 'Review'];

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
        <p className="text-gray-600 mb-6">
          We'll review your Moving Sale Drop application and contact you within 24 hours to confirm your weekend and discuss next steps.
        </p>
        <div className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-50 rounded-xl text-emerald-700 font-medium">
          <Check size={18} />
          Confirmation sent to {formData.email}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Progress bar */}
      <div className="bg-white rounded-t-2xl border border-b-0 border-gray-100 shadow-sm px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <Truck size={16} className="text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Moving Sale Drop</p>
              <p className="text-xs text-gray-500">Seller Registration</p>
            </div>
          </div>
          <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps} · {Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-3">
          {stepLabels.map((label, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                idx + 1 < currentStep
                  ? 'bg-amber-500 text-white'
                  : idx + 1 === currentStep
                    ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {idx + 1 < currentStep ? <Check size={12} /> : idx + 1}
              </div>
              <span className={`text-xs mt-1 hidden sm:block ${idx + 1 <= currentStep ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white border border-t-0 border-b-0 border-gray-100 px-6 py-6">
        {currentStep === 1 && <MSStepSellerType formData={formData} updateFormData={updateFormData} />}
        {currentStep === 2 && <MSStepContactInfo formData={formData} updateFormData={updateFormData} />}
        {currentStep === 3 && <MSStepLocation formData={formData} updateFormData={updateFormData} />}
        {currentStep === 4 && <MSStepSaleDetails formData={formData} updateFormData={updateFormData} toggleArrayItem={toggleArrayItem} />}
        {currentStep === 5 && <MSStepSchedule formData={formData} updateFormData={updateFormData} toggleArrayItem={toggleArrayItem} />}
        {currentStep === 6 && <MSStepReview formData={formData} updateFormData={updateFormData} toggleArrayItem={toggleArrayItem} />}
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-b-2xl border border-t border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between">
        {currentStep > 1 ? (
          <button
            onClick={prevStep}
            className="flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-gray-900 font-medium transition-colors rounded-xl hover:bg-gray-50"
          >
            <ChevronLeft size={18} />
            Back
          </button>
        ) : (
          <div />
        )}
        {currentStep < totalSteps ? (
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${
              canProceed()
                ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-500/20'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
            <ChevronRight size={18} />
          </button>
        ) : (
          <div className="flex flex-col items-end gap-2">
            {submitError && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <AlertCircle size={14} />{submitError}
              </p>
            )}
            <button
              disabled={submitting}
              onClick={async () => {
                setSubmitError('');
                setSubmitting(true);
                try {
                  await apiRequest('/api/moving-sale', {
                    method: 'POST',
                    token: accessToken ?? undefined,
                    body: JSON.stringify({
                      ...formData,
                      sellerType: SELLER_TYPE_MAP[formData.sellerType as string] ?? 'INDIVIDUAL',
                    }),
                  });
                  await refreshUser();
                  setSubmitted(true);
                } catch (err: unknown) {
                  setSubmitError(err instanceof Error ? err.message : 'Submission failed');
                } finally {
                  setSubmitting(false);
                }
              }}
              className="flex items-center gap-2 px-7 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 disabled:opacity-60 shadow-md shadow-amber-500/20 transition-all"
            >
              {submitting
                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Submitting…</>
                : <><Sparkles size={18} />Submit Application</>
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Step 1 — Seller Type
function MSStepSellerType({ formData, updateFormData }: { formData: Record<string, unknown>; updateFormData: (f: string, v: unknown) => void }) {
  const sellerTypes = [
    { id: 'individual', icon: User, title: 'Individual / Family', description: 'Moving to a new home and need to sell household items', examples: 'Relocating, downsizing, decluttering' },
    { id: 'church', icon: Church, title: 'Church / Religious Org', description: 'Fundraising sale or clearing donated items', examples: 'Rummage sales, donation clearouts, fundraisers' },
    { id: 'charity', icon: Heart, title: 'Charity / Non-Profit', description: 'Selling donated goods to support your mission', examples: 'Thrift sales, estate donations, community drives' },
    { id: 'estate', icon: Home, title: 'Estate Representative', description: "Managing the sale of a loved one's belongings", examples: 'Estate liquidation, family inheritance' },
    { id: 'business', icon: Briefcase, title: 'Business / Office', description: 'Closing, relocating, or upgrading office equipment', examples: 'Office furniture, equipment, supplies' },
    { id: 'community', icon: Users, title: 'Community Group', description: 'Schools, clubs, or community organizations', examples: 'School fundraisers, club sales, group events' },
  ];
  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Truck size={28} className="text-amber-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">What type of seller are you?</h2>
        <p className="text-gray-500 text-sm">This helps us tailor the experience for your needs</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {sellerTypes.map(type => (
          <button
            key={type.id}
            onClick={() => updateFormData('sellerType', type.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              formData.sellerType === type.id
                ? 'border-amber-500 bg-amber-50 ring-4 ring-amber-100'
                : 'border-gray-200 hover:border-amber-300 bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${formData.sellerType === type.id ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                <type.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{type.title}</h3>
                  {formData.sellerType === type.id && <CheckCircle size={16} className="text-amber-500 flex-shrink-0" />}
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{type.description}</p>
                <p className="text-xs text-gray-400 mt-1">{type.examples}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-5 bg-amber-50 rounded-xl p-4 border border-amber-100 flex items-start gap-3">
        <Info size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-gray-900 mb-0.5">Why does this matter?</p>
          <p className="text-xs text-gray-600">Different seller types have different needs. Churches and charities may need tax receipt documentation, estates may need extra time, and businesses might have specific pickup requirements.</p>
        </div>
      </div>
    </div>
  );
}

// Step 2 — Contact Info
function MSStepContactInfo({ formData, updateFormData }: { formData: Record<string, unknown>; updateFormData: (f: string, v: unknown) => void }) {
  const isOrg = ['church', 'charity', 'business', 'community'].includes(formData.sellerType as string);
  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <User size={28} className="text-amber-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Contact Information</h2>
        <p className="text-gray-500 text-sm">How can we reach you about your Moving Sale Drop?</p>
      </div>
      {(String(formData.contactName || '') || String(formData.email || '')) && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700">
          <CheckCircle size={14} className="shrink-0" />
          Pre-filled from your profile — edit below if needed
        </div>
      )}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4">
        {isOrg && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization Name *</label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={formData.organizationName as string} onChange={e => updateFormData('organizationName', e.target.value)} placeholder="e.g., St. Mary's Church, Ottawa Food Bank" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white text-sm" />
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{isOrg ? 'Primary Contact Name *' : 'Your Name *'}</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={formData.contactName as string} onChange={e => updateFormData('contactName', e.target.value)} placeholder="Full name" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="email" value={formData.email as string} onChange={e => updateFormData('email', e.target.value)} placeholder="you@example.com" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white text-sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">We'll send sale updates and buyer inquiries here</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="tel" value={formData.phone as string} onChange={e => updateFormData('phone', e.target.value)} placeholder="(613) 555-0123" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white text-sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">For pickup coordination with buyers</p>
        </div>
      </div>
      <div className="mt-4 flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
        <Shield size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500">Your contact info is only shared with buyers who claim items from your sale. We never sell or share your data.</p>
      </div>
    </div>
  );
}

// Step 3 — Location
function MSStepLocation({ formData, updateFormData }: { formData: Record<string, unknown>; updateFormData: (f: string, v: unknown) => void }) {
  const neighborhoods = ['Kanata', 'Kanata North', 'Kanata South', 'Kanata Lakes', 'Stittsville', 'Barrhaven', 'Orléans', 'Nepean', 'Centretown', 'The Glebe', 'Westboro', 'Hintonburg', 'Other (Ottawa area)'];
  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <MapPin size={28} className="text-amber-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Sale Location</h2>
        <p className="text-gray-500 text-sm">Where will buyers pick up items?</p>
      </div>
      {(String(formData.postalCode || '') || String(formData.neighborhood || '')) && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700">
          <CheckCircle size={14} className="shrink-0" />
          Postal code and neighborhood pre-filled from your profile — add your street address below
        </div>
      )}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address *</label>
          <div className="relative">
            <Home size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={formData.address as string} onChange={e => updateFormData('address', e.target.value)} placeholder="123 Main Street" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
            <input type="text" value={formData.city as string} onChange={e => updateFormData('city', e.target.value)} placeholder="Ottawa" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Postal Code *</label>
            <input type="text" value={formData.postalCode as string} onChange={e => updateFormData('postalCode', e.target.value.toUpperCase())} placeholder="K2K 1A1" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white text-sm uppercase" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Neighborhood</label>
          <select value={formData.neighborhood as string} onChange={e => updateFormData('neighborhood', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white text-sm">
            <option value="">Select your neighborhood</option>
            {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <p className="text-xs text-gray-400 mt-1">Helps local buyers find your sale</p>
        </div>
      </div>
      <div className="mt-4 flex items-start gap-3 bg-amber-50 rounded-xl p-4 border border-amber-100">
        <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-gray-800">Full address only shown to buyers who claim items</p>
          <p className="text-xs text-gray-500 mt-0.5">Public listings only show your neighborhood to protect your privacy.</p>
        </div>
      </div>
    </div>
  );
}

// Step 4 — Sale Details
function MSStepSaleDetails({ formData, updateFormData, toggleArrayItem }: { formData: Record<string, unknown>; updateFormData: (f: string, v: unknown) => void; toggleArrayItem: (f: string, v: string) => void }) {
  const saleReasons = [
    { id: 'moving', label: 'Moving / Relocating', icon: Truck },
    { id: 'downsizing', label: 'Downsizing', icon: Home },
    { id: 'fundraiser', label: 'Fundraiser', icon: Heart },
    { id: 'estate', label: 'Estate Sale', icon: FileText },
    { id: 'declutter', label: 'Major Declutter', icon: Package },
    { id: 'closing', label: 'Business Closing', icon: Building2 },
  ];
  const categories = [
    { id: 'furniture', label: 'Furniture', icon: '🪑' }, { id: 'electronics', label: 'Electronics', icon: '📱' },
    { id: 'kitchen', label: 'Kitchen & Dining', icon: '🍳' }, { id: 'kids', label: 'Kids & Baby', icon: '👶' },
    { id: 'clothing', label: 'Clothing', icon: '👕' }, { id: 'sports', label: 'Sports & Outdoors', icon: '⚽' },
    { id: 'tools', label: 'Tools & Garden', icon: '🔧' }, { id: 'decor', label: 'Home Décor', icon: '🖼️' },
    { id: 'books', label: 'Books & Media', icon: '📚' }, { id: 'office', label: 'Office', icon: '💼' },
    { id: 'collectibles', label: 'Collectibles', icon: '🏺' }, { id: 'other', label: 'Other', icon: '📦' },
  ];
  const itemRanges = [
    { id: '1-10', label: '1–10 items', description: 'Small sale' },
    { id: '11-25', label: '11–25 items', description: 'Medium sale' },
    { id: '26-50', label: '26–50 items', description: 'Large sale' },
    { id: '51-100', label: '51–100 items', description: 'Major sale' },
    { id: '100+', label: '100+ items', description: 'Full house / estate' },
  ];
  const cats = formData.categories as string[];
  return (
    <div className="space-y-5">
      <div className="text-center mb-2">
        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Package size={28} className="text-amber-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Tell us about your sale</h2>
        <p className="text-gray-500 text-sm">Help buyers know what to expect</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">What's the reason for this sale? *</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {saleReasons.map(r => (
            <button key={r.id} onClick={() => updateFormData('saleReason', r.id)} className={`p-3 rounded-xl border-2 text-left transition-all ${formData.saleReason === r.id ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300 bg-white'}`}>
              <r.icon size={18} className={formData.saleReason === r.id ? 'text-amber-600' : 'text-gray-400'} />
              <p className={`text-xs font-medium mt-1.5 ${formData.saleReason === r.id ? 'text-amber-700' : 'text-gray-700'}`}>{r.label}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">How many items are you selling? *</h3>
        <div className="space-y-2">
          {itemRanges.map(range => (
            <button key={range.id} onClick={() => updateFormData('estimatedItems', range.id)} className={`w-full p-3 rounded-xl border-2 text-left flex items-center justify-between transition-all ${formData.estimatedItems === range.id ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300 bg-white'}`}>
              <div className="flex items-center gap-3">
                {formData.estimatedItems === range.id ? <CheckCircle size={18} className="text-amber-500" /> : <Circle size={18} className="text-gray-300" />}
                <span className="font-medium text-gray-900 text-sm">{range.label}</span>
              </div>
              <span className="text-xs text-gray-500">{range.description}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900 text-sm mb-1">Categories *</h3>
        <p className="text-xs text-gray-500 mb-3">Select all that apply</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => toggleArrayItem('categories', cat.id)} className={`p-2.5 rounded-xl border-2 text-left flex items-center gap-2 transition-all ${cats.includes(cat.id) ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300 bg-white'}`}>
              <span className="text-lg">{cat.icon}</span>
              <span className={`text-xs font-medium ${cats.includes(cat.id) ? 'text-amber-700' : 'text-gray-700'}`}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900 text-sm mb-1">Sale Description</h3>
        <p className="text-xs text-gray-500 mb-3">Optional but recommended — tell buyers about your sale</p>
        <textarea value={formData.description as string} onChange={e => updateFormData('description', e.target.value)} rows={3} placeholder="e.g., We're moving to Vancouver after 10 years in Kanata! Selling quality furniture, kids items, kitchen appliances, and more..." className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white text-sm resize-none" />
      </div>
    </div>
  );
}

// Step 5 — Schedule
function MSStepSchedule({ formData, updateFormData, toggleArrayItem }: { formData: Record<string, unknown>; updateFormData: (f: string, v: unknown) => void; toggleArrayItem: (f: string, v: string) => void }) {
  const getUpcomingWeekends = () => {
    const weekends = [];
    const today = new Date();
    const date = new Date(today);
    const daysUntilSat = (6 - date.getDay() + 7) % 7 || 7;
    date.setDate(date.getDate() + daysUntilSat);
    for (let i = 0; i < 4; i++) {
      const sat = new Date(date);
      const sun = new Date(date);
      sun.setDate(sun.getDate() + 1);
      weekends.push({
        id: `weekend-${i}`,
        label: `${sat.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${sun.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        sat: sat.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        sun: sun.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      });
      date.setDate(date.getDate() + 7);
    }
    return weekends;
  };
  const weekends = getUpcomingWeekends();
  const windows = [
    { id: 'sat-morning', label: 'Saturday Morning', time: '9am – 12pm' },
    { id: 'sat-afternoon', label: 'Saturday Afternoon', time: '12pm – 4pm' },
    { id: 'sat-evening', label: 'Saturday Evening', time: '4pm – 7pm' },
    { id: 'sun-morning', label: 'Sunday Morning', time: '10am – 1pm' },
    { id: 'sun-afternoon', label: 'Sunday Afternoon', time: '1pm – 5pm' },
  ];
  const pws = formData.pickupWindows as string[];
  return (
    <div className="space-y-5">
      <div className="text-center mb-2">
        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Calendar size={28} className="text-amber-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Schedule Your Drop</h2>
        <p className="text-gray-500 text-sm">When do you want your Moving Sale to go live?</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Select Your Weekend *</h3>
        <div className="space-y-2">
          {weekends.map((w, idx) => (
            <button key={w.id} onClick={() => updateFormData('preferredWeekend', w.label)} className={`w-full p-3 rounded-xl border-2 text-left transition-all ${formData.preferredWeekend === w.label ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300 bg-white'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {formData.preferredWeekend === w.id ? <CheckCircle size={18} className="text-amber-500" /> : <Circle size={18} className="text-gray-300" />}
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{w.label}</p>
                    <p className="text-xs text-gray-500">{w.sat} & {w.sun}</p>
                  </div>
                </div>
                {idx === 0 && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium">Soonest</span>}
                {formData.preferredWeekend === w.label && <CheckCircle size={16} className="text-amber-500 shrink-0" />}
              </div>
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3 mt-3 p-3 bg-white rounded-xl border border-gray-200 cursor-pointer">
          <input type="checkbox" checked={formData.flexibleDates as boolean} onChange={e => updateFormData('flexibleDates', e.target.checked)} className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">I'm flexible on dates</p>
            <p className="text-xs text-gray-500">We may suggest alternative weekends based on demand</p>
          </div>
        </label>
      </div>
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900 text-sm mb-1">Pickup Windows *</h3>
        <p className="text-xs text-gray-500 mb-3">When are you available for buyers? Select all that apply</p>
        <div className="space-y-2">
          {windows.map(w => (
            <button key={w.id} onClick={() => toggleArrayItem('pickupWindows', w.id)} className={`w-full p-3 rounded-xl border-2 text-left flex items-center justify-between transition-all ${pws.includes(w.id) ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300 bg-white'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${pws.includes(w.id) ? 'bg-amber-500 border-amber-500' : 'border-gray-300'}`}>
                  {pws.includes(w.id) && <Check size={12} className="text-white" />}
                </div>
                <span className="font-medium text-gray-900 text-sm">{w.label}</span>
              </div>
              <span className="text-xs text-gray-500">{w.time}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-start gap-2 bg-white rounded-xl p-3 border border-gray-200">
          <Clock size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600"><strong>Tip:</strong> More pickup windows = more sales! Buyers appreciate flexibility.</p>
        </div>
      </div>
    </div>
  );
}

// Step 6 — Review & Submit
function MSStepReview({ formData, updateFormData, toggleArrayItem }: { formData: Record<string, unknown>; updateFormData: (f: string, v: unknown) => void; toggleArrayItem: (f: string, v: string) => void }) {
  const helpOptions = [
    { id: 'photography', label: 'Item Photography', description: 'We take professional photos of your items' },
    { id: 'pricing', label: 'Pricing Help', description: 'We help you price items competitively' },
    { id: 'listing', label: 'Listing Assistance', description: 'We create descriptions for your items' },
    { id: 'hauling', label: 'Unsold Item Hauling', description: "We remove items that don't sell" },
  ];
  const referralSources = ['Google Search', 'Facebook', 'Instagram', 'Friend / Family', 'Neighbourhood Group', 'Church / Community Org', 'Other'];
  const sellerTypeLabels: Record<string, string> = {
    individual: 'Individual / Family', church: 'Church / Religious Org', charity: 'Charity / Non-Profit',
    estate: 'Estate Representative', business: 'Business / Office', community: 'Community Group',
  };
  const isCharity = ['church', 'charity', 'community'].includes(formData.sellerType as string);
  const needsHelp = formData.needsHelp as string[];
  return (
    <div className="space-y-5">
      <div className="text-center mb-2">
        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <CheckCircle size={28} className="text-amber-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Review & Submit</h2>
        <p className="text-gray-500 text-sm">Almost there! Review your details and submit.</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2"><FileText size={16} className="text-amber-500" /> Your Moving Sale Summary</h3>
        <div className="space-y-0 divide-y divide-gray-100">
          {[
            { label: 'Seller Type', value: sellerTypeLabels[formData.sellerType as string] || (formData.sellerType as string) },
            { label: 'Contact', value: formData.contactName as string },
            { label: 'Location', value: (formData.neighborhood as string) || (formData.city as string) },
            { label: 'Estimated Items', value: formData.estimatedItems as string },
            { label: 'Categories', value: `${(formData.categories as string[]).length} selected` },
            { label: 'Pickup Windows', value: `${(formData.pickupWindows as string[]).length} time slots` },
          ].map(row => (
            <div key={row.label} className="flex justify-between py-2.5">
              <span className="text-sm text-gray-500">{row.label}</span>
              <span className="text-sm font-medium text-gray-900">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-5 text-white">
        <h3 className="font-bold text-base mb-3 flex items-center gap-2"><DollarSign size={18} /> Moving Sale Drop Pricing</h3>
        <div className="bg-white/15 rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-amber-100 text-sm">Flat listing fee</span>
            <span className="font-bold text-xl">$49</span>
          </div>
          <p className="text-xs text-amber-200">Includes featured placement, promotional email to local buyers, and unlimited items.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-amber-100">
          <Check size={14} />
          <span>No commission on sales — you keep 100% of what you earn!</span>
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900 text-sm mb-1">Need Extra Help? <span className="text-gray-400 font-normal">(Optional)</span></h3>
        <p className="text-xs text-gray-500 mb-3">Additional services available for an extra fee</p>
        <div className="space-y-2">
          {helpOptions.map(opt => (
            <button key={opt.id} onClick={() => toggleArrayItem('needsHelp', opt.id)} className={`w-full p-3 rounded-xl border-2 text-left transition-all ${needsHelp.includes(opt.id) ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300 bg-white'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${needsHelp.includes(opt.id) ? 'bg-amber-500 border-amber-500' : 'border-gray-300'}`}>
                  {needsHelp.includes(opt.id) && <Check size={12} className="text-white" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {isCharity && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={formData.taxReceipt as boolean} onChange={e => updateFormData('taxReceipt', e.target.checked)} className="w-4 h-4 mt-0.5 text-amber-500 border-gray-300 rounded focus:ring-amber-500" />
            <div>
              <p className="font-medium text-gray-900 text-sm flex items-center gap-2"><Gift size={16} className="text-amber-500" /> Enable Tax Receipt Requests</p>
              <p className="text-xs text-gray-500 mt-1">Allow buyers to request a tax receipt for their purchase. You'll need to provide receipts to eligible donors.</p>
            </div>
          </label>
        </div>
      )}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">How did you hear about DropYard?</h3>
        <select value={formData.referralSource as string} onChange={e => updateFormData('referralSource', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white text-sm">
          <option value="">Select an option</option>
          {referralSources.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-start gap-3">
        <Info size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-600">
          By submitting, you agree to our <a href="#" className="text-amber-600 hover:underline">Terms of Service</a> and <a href="#" className="text-amber-600 hover:underline">Seller Guidelines</a>. A member of our team will review and contact you within 24 hours.
        </p>
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
