"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getDropCycleInfo,
  formatDropDate,
  formatDropTime,
  type DropCycleInfo,
  type DropPhase,
} from "@/lib/dropCycle";

export interface DropCycleState extends DropCycleInfo {
  /** For demo: override current time to simulate different phases */
  simulatedDate: Date | null;
  setSimulatedDate: (d: Date | null) => void;
  /** Current "now" used for calculations */
  effectiveNow: Date;
  /** Milliseconds until nextEventAt */
  msUntilNextEvent: number;
  /** Formatted countdown string */
  countdownLabel: string;
}

const defaultInfo = getDropCycleInfo(new Date());

const DropCycleContext = createContext<DropCycleState>({
  ...defaultInfo,
  simulatedDate: null,
  setSimulatedDate: () => {},
  effectiveNow: new Date(),
  msUntilNextEvent: 0,
  countdownLabel: "",
});

function getCountdownLabel(ms: number): string {
  if (ms <= 0) return "Now";
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  const h = Math.floor(ms / 3600000) % 24;
  const d = Math.floor(ms / 86400000);
  const parts: string[] = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0 || parts.length > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(" ");
}

export function DropCycleProvider({ children }: { children: React.ReactNode }) {
  const [simulatedDate, setSimulatedDateState] = useState<Date | null>(null);
  const [tick, setTick] = useState(0);

  const setSimulatedDate = useCallback((d: Date | null) => {
    setSimulatedDateState(d);
  }, []);

  const effectiveNow = simulatedDate ?? new Date();
  const info = getDropCycleInfo(effectiveNow);
  const msUntilNextEvent = Math.max(
    0,
    info.nextEventAt.getTime() - effectiveNow.getTime()
  );
  const countdownLabel = getCountdownLabel(msUntilNextEvent);

  // Re-tick every second so countdown updates (only when not simulated, or to refresh)
  useEffect(() => {
    if (simulatedDate) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [simulatedDate]);

  return (
    <DropCycleContext.Provider
      value={{
        ...info,
        simulatedDate,
        setSimulatedDate,
        effectiveNow,
        msUntilNextEvent,
        countdownLabel,
      }}
    >
      {children}
    </DropCycleContext.Provider>
  );
}

export function useDropCycle() {
  return useContext(DropCycleContext);
}
