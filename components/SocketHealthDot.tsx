"use client";

import React from "react";
import { useSocket } from "@/context/SocketContext";

// BUG-064 — tiny health indicator. Renders a dot whose color reflects the
// live socket connection state:
//   green  = connected, real-time updates working
//   amber  = trying to connect / reconnecting
//   gray   = no socket (signed out)
//
// Placed in the seller TopNav / buyer TopBar so QA and engineers can spot
// flaky connections at a glance. Hover for the human-readable status.
//
// Production-suitable: <4px dot, no chrome, doesn't affect layout.
export function SocketHealthDot({ className = "" }: { className?: string }) {
  const { socket, connected } = useSocket();
  const status = !socket ? "off" : connected ? "live" : "reconnecting";

  const color = status === "live" ? "#10b981" /* emerald-500 */
              : status === "reconnecting" ? "#f59e0b" /* amber-500 */
              : "#94a3b8" /* slate-400 */;

  const label =
    status === "live" ? "Real-time updates: connected"
    : status === "reconnecting" ? "Real-time updates: reconnecting…"
    : "Real-time updates: not connected";

  return (
    <span
      className={className}
      title={label}
      aria-label={label}
      role="img"
      style={{
        display:      "inline-block",
        width:        8,
        height:       8,
        borderRadius: "50%",
        background:   color,
        boxShadow:    status === "live"
                        ? `0 0 0 2px ${color}33`
                        : status === "reconnecting"
                        ? `0 0 0 2px ${color}33`
                        : "none",
        animation:    status === "reconnecting" ? "dropyard-pulse 1.2s ease-in-out infinite" : undefined,
      }}
    />
  );
}

// CSS keyframes live in app/globals.css. If they don't exist yet, the dot
// just stays a solid amber when reconnecting — graceful degrade.
