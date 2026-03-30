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
  email: string;
  phone?: string;
  role: string;
  postalCode?: string;
  neighborhood?: string;
  zone?: string;
  buyerOnboardingDone: boolean;
  sellerOnboardingDone: boolean;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signup: (name: string, email: string, password: string, phone?: string) => Promise<AuthUser>;
  signin: (email: string, password: string) => Promise<AuthUser>;
  /** Google Identity Services JWT (`credential` from GoogleLogin) */
  signInWithGoogle: (credential: string) => Promise<AuthUser>;
  signout: () => Promise<void>;
  refreshUser: () => Promise<void>;
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
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<AuthUser> => {
    const data = await apiRequest<{ user: AuthUser; accessToken: string; refreshToken: string }>(
      '/api/auth/signup',
      { method: 'POST', body: JSON.stringify({ name, email, password, phone }) }
    );
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    setState({ user: data.user, accessToken: data.accessToken, loading: false });
    return data.user;
  }, []);

  const signin = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    const data = await apiRequest<{ user: AuthUser; accessToken: string; refreshToken: string }>(
      '/api/auth/signin',
      { method: 'POST', body: JSON.stringify({ email, password }) }
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
    if (token) {
      await apiRequest('/api/auth/signout', { method: 'POST', token }).catch(() => {});
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setState({ user: null, accessToken: null, loading: false });
    window.location.href = '/join';
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signup, signin, signInWithGoogle, signout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
