"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type DashboardMode = "buyer" | "seller";

export type DropType = "weekly" | "moving";

export type BuyerClaimStatus = "Pending" | "Confirmed" | "Picked Up";

export interface BuyerClaim {
  id: string;
  itemId: string;
  itemName: string;
  sellerName: string;
  price: number;
  status: BuyerClaimStatus;
  pickupSlot?: string;
  pickupAddress?: string;
  requestedAt: string;
}

export interface DashboardState {
  mode: DashboardMode;
  sellerOnboardingComplete: boolean;
  buyerOnboardingComplete: boolean;
  dropType: DropType;
  movingSaleDate: string;
  promoEmailOptIn: boolean;
  watchlist: string[];
  buyerClaims: BuyerClaim[];
  setMode: (mode: DashboardMode) => void;
  setSellerOnboardingComplete: (v: boolean) => void;
  setBuyerOnboardingComplete: (v: boolean) => void;
  setDropType: (t: DropType) => void;
  setMovingSaleDate: (d: string) => void;
  setPromoEmailOptIn: (v: boolean) => void;
  toggleWatchlist: (itemId: string) => void;
  addBuyerClaim: (claim: Omit<BuyerClaim, "id" | "requestedAt">) => void;
}

const defaultState: DashboardState = {
  mode: "seller",
  sellerOnboardingComplete: false,
  buyerOnboardingComplete: false,
  dropType: "weekly",
  movingSaleDate: "",
  promoEmailOptIn: false,
  watchlist: [],
  buyerClaims: [
    {
      id: "c1",
      itemId: "i1",
      itemName: "Sectional Sofa",
      sellerName: "Jane D.",
      price: 450,
      status: "Pending",
      requestedAt: "2 hours ago",
    },
    {
      id: "c2",
      itemId: "i2",
      itemName: "iPhone 13",
      sellerName: "Mike T.",
      price: 320,
      status: "Confirmed",
      pickupSlot: "Sat 2pm-4pm",
      pickupAddress: "123 Oak St, K1A",
      requestedAt: "1 day ago",
    },
  ],
  setMode: () => {},
  setSellerOnboardingComplete: () => {},
  setBuyerOnboardingComplete: () => {},
  setDropType: () => {},
  setMovingSaleDate: () => {},
  setPromoEmailOptIn: () => {},
  toggleWatchlist: () => {},
  addBuyerClaim: () => {},
};

const DashboardContext = createContext<DashboardState>(defaultState);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<DashboardMode>("seller");
  const [sellerOnboardingComplete, setSellerOnboardingComplete] = useState(false);
  const [buyerOnboardingComplete, setBuyerOnboardingComplete] = useState(false);
  const [dropType, setDropType] = useState<DropType>("weekly");
  const [movingSaleDate, setMovingSaleDate] = useState("");
  const [promoEmailOptIn, setPromoEmailOptIn] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [buyerClaims, setBuyerClaims] = useState<BuyerClaim[]>(
    defaultState.buyerClaims
  );

  const toggleWatchlist = useCallback((itemId: string) => {
    setWatchlist((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  }, []);

  const addBuyerClaim = useCallback(
    (claim: Omit<BuyerClaim, "id" | "requestedAt">) => {
      setBuyerClaims((prev) => [
        {
          ...claim,
          id: `c${Date.now()}`,
          requestedAt: "Just now",
        },
        ...prev,
      ]);
    },
    []
  );

  return (
    <DashboardContext.Provider
      value={{
        mode,
        sellerOnboardingComplete,
        buyerOnboardingComplete,
        watchlist,
        buyerClaims,
        setMode,
        setSellerOnboardingComplete,
        setBuyerOnboardingComplete,
        dropType,
        movingSaleDate,
        promoEmailOptIn,
        setDropType,
        setMovingSaleDate,
        setPromoEmailOptIn,
        toggleWatchlist,
        addBuyerClaim,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}
