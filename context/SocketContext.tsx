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
  // null while signed out or before initial connect. The component subscribes
  // through useSocketEvent() so it doesn't usually need to read this directly,
  // but it's exposed for one-off emit() calls.
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextValue | null>(null);

// Wraps the app under <AuthProvider>. Owns a single socket.io connection
// and re-creates it whenever the access token changes (sign in, sign out,
// silent token refresh). Components subscribe to events via useSocketEvent().
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      // Signed out — make sure we don't keep a zombie connection open.
      setSocket(null);
      setConnected(false);
      return;
    }

    const s = io(SOCKET_URL, {
      auth: { token: accessToken },
      transports: ["websocket", "polling"], // websocket first, fall back to polling
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));
    s.on("connect_error", (err) => {
      // The most common cause is an expired token; the next REST call will
      // trigger a refresh, the AuthContext will update accessToken, and this
      // effect re-runs with a fresh socket.
      // eslint-disable-next-line no-console
      console.warn("[socket] connect_error:", err.message);
    });

    setSocket(s);
    return () => {
      s.removeAllListeners();
      s.disconnect();
    };
  }, [accessToken]);

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
