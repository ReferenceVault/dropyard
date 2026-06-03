"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { apiRequest } from "@/lib/api";

export interface AuthUser {
  id: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone?: string;
  role: string;
  /** Moderation status. Frontend force-signs-out a user whose status flips
   *  to SUSPENDED or BANNED mid-session. */
  status?: "ACTIVE" | "SUSPENDED" | "BANNED";
  postalCode?: string;
  neighborhood?: string;
  zone?: string;
  buyerOnboardingDone: boolean;
  sellerOnboardingDone: boolean;
  /** ISO date when the user verified their email. Null = unverified. Shown
   *  as a banner on the dashboard. No features are gated on this yet. */
  verifiedAt?: string | null;
  // True when the user has a passwordHash set. Used by Settings to choose
  // between "Set password" and "Change password".
  hasPassword?: boolean;
  createdAt?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone?: string
  ) => Promise<AuthUser>;
  signin: (email: string, password: string, rememberMe?: boolean) => Promise<AuthUser>;
  /** Google Identity Services JWT (`credential` from GoogleLogin) */
  signInWithGoogle: (credential: string) => Promise<AuthUser>;
  signout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  /** Wipe local auth state without server call or redirect. Used when a
   *  signin succeeded but the user shouldn't actually be kept logged in
   *  (e.g. non-admin user submitting the admin login form). */
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ACCESS_TOKEN_KEY = 'dy_access_token';
const REFRESH_TOKEN_KEY = 'dy_refresh_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    loading: true,
  });

  // On mount — restore session from localStorage (apiRequest auto-refreshes if expired)
  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      setState(s => ({ ...s, loading: false }));
      return;
    }
    apiRequest<{ user: AuthUser }>('/api/auth/me', { token })
      .then(({ user }) => {
        // If the user was suspended/banned mid-session, the server returns 403
        // (caught below). But also defensive-check here in case /me returns
        // a status field on a still-200 path (e.g. caching layer in front).
        if (user.status === 'SUSPENDED' || user.status === 'BANNED') {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          setState({ user: null, accessToken: null, loading: false });
          if (typeof window !== 'undefined') {
            window.location.href = '/join';
          }
          return;
        }
        // Token may have been silently refreshed — read current value from storage
        const freshToken = localStorage.getItem(ACCESS_TOKEN_KEY) ?? token;
        setState({ user, accessToken: freshToken, loading: false });
      })
      .catch(() => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        setState({ user: null, accessToken: null, loading: false });
      });
  }, []);

  const signup = useCallback(async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<AuthUser> => {
    const data = await apiRequest<{ user: AuthUser; accessToken: string; refreshToken: string }>(
      '/api/auth/signup',
      { method: 'POST', body: JSON.stringify({ firstName, lastName, email, password, phone }) }
    );
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    setState({ user: data.user, accessToken: data.accessToken, loading: false });
    return data.user;
  }, []);

  const signin = useCallback(async (email: string, password: string, rememberMe = false): Promise<AuthUser> => {
    const data = await apiRequest<{ user: AuthUser; accessToken: string; refreshToken: string }>(
      '/api/auth/signin',
      { method: 'POST', body: JSON.stringify({ email, password, rememberMe }) }
    );
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    setState({ user: data.user, accessToken: data.accessToken, loading: false });
    return data.user;
  }, []);

  const signInWithGoogle = useCallback(async (credential: string): Promise<AuthUser> => {
    const data = await apiRequest<{ user: AuthUser; accessToken: string; refreshToken: string }>(
      '/api/auth/google',
      { method: 'POST', body: JSON.stringify({ credential }) }
    );
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    setState({ user: data.user, accessToken: data.accessToken, loading: false });
    return data.user;
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) return;
    const { user } = await apiRequest<{ user: AuthUser }>('/api/auth/me', { token });
    const freshToken = localStorage.getItem(ACCESS_TOKEN_KEY) ?? token;
    setState(s => ({ ...s, user, accessToken: freshToken }));
  }, []);

  const signout = useCallback(async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    // Fire-and-forget the backend invalidation. Awaiting it would block the
    // redirect when the API is slow / unreachable, leaving the user looking
    // at a dead "Sign out" click. Local state and tokens get cleared either
    // way, so they're effectively logged out from the user's perspective.
    if (token) {
      apiRequest('/api/auth/signout', { method: 'POST', token }).catch(() => {});
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setState({ user: null, accessToken: null, loading: false });
    // Send admins back to the admin login, everyone else to /join.
    const target = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
      ? '/admin/login'
      : '/join';
    window.location.href = target;
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setState({ user: null, accessToken: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signup, signin, signInWithGoogle, signout, refreshUser, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
