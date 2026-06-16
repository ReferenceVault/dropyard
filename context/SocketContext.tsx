"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface SocketContextValue {
  // null while signed out or before initial connect. Components subscribe
  // through useSocketEvent(); the raw socket is exposed for one-off emit().
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────
// BUG-064 — proper socket lifecycle.
//
// Previously we keyed the useEffect on `accessToken` from AuthContext. That
// worked when JWTs lived in localStorage and AuthContext rewrote them on
// every signin/refresh, but the cookie migration broke it: silent refreshes
// land NEW cookies without touching AuthContext state, so accessToken stays
// stale and the effect never re-runs → socket keeps trying to connect with
// dead credentials, never reconnects after rotation.
//
// New model:
//   - Connect once when user.id is known (signed in).
//   - Tear down when user becomes null (signed out).
//   - Socket.IO's built-in auto-reconnect handles token rotation: on every
//     reconnect, the browser sends the LATEST dy_access cookie (because we
//     set withCredentials:true on the client AND the backend reads from
//     the Cookie header on each handshake). So a silent refresh just means
//     the next reconnect uses the fresh token — no React plumbing needed.
//   - withCredentials sends cookies cross-origin, which we need because
//     api.dropyard.app and dropyard.app are different origins in prod.
// ─────────────────────────────────────────────────────────────────────────
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setSocket(null);
      setConnected(false);
      return;
    }

    const s = io(SOCKET_URL, {
      // Cookies are the auth surface — send dy_access on every handshake.
      // No JWT in handshake.auth anymore; backend reads it from the Cookie
      // header (with auth.token retained as a back-compat fallback for
      // native/mobile clients).
      withCredentials:        true,
      transports:             ["websocket", "polling"],
      reconnection:           true,
      reconnectionAttempts:   Infinity,
      reconnectionDelay:      1000,
      reconnectionDelayMax:   5000,
      // Aggressive timeouts so a stuck connection bounces fast instead of
      // sitting silent for the full default (20s).
      timeout:                10000,
    });

    s.on("connect", () => {
      setConnected(true);
      // eslint-disable-next-line no-console
      console.info("[socket] connected", s.id);
    });
    s.on("disconnect", (reason) => {
      setConnected(false);
      // eslint-disable-next-line no-console
      console.info("[socket] disconnected:", reason);
    });
    s.on("connect_error", (err) => {
      // Most common cause: token expired between sessions or backend down.
      // Auto-reconnect will pick up the fresh cookie next attempt.
      // eslint-disable-next-line no-console
      console.warn("[socket] connect_error:", err.message);
    });

    setSocket(s);
    return () => {
      s.removeAllListeners();
      s.disconnect();
    };
    // Keyed on user.id ONLY. user object identity changes on every refreshUser()
    // call; pulling just the id keeps the effect from re-running spuriously.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket(): SocketContextValue {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used inside <SocketProvider>");
  return ctx;
}

// Subscribe to a server event for the lifetime of a component. Re-binds when
// the socket instance changes (reconnect) or the handler identity changes.
// The handler ref pattern lets callers pass an inline function without
// triggering re-binds on every render.
export function useSocketEvent<T = unknown>(
  event: string,
  handler: (payload: T) => void,
): void {
  const { socket } = useSocket();
  const handlerRef = useRef(handler);
  useEffect(() => { handlerRef.current = handler; }, [handler]);

  useEffect(() => {
    if (!socket) return;
    const wrapped = (payload: T) => handlerRef.current(payload);
    socket.on(event, wrapped);
    return () => {
      socket.off(event, wrapped);
    };
  }, [socket, event]);
}
