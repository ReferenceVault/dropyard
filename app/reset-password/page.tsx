"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // No token in the URL — nothing for this page to do. Direct visitors here
  // are usually broken email clients or someone manually deep-linking.
  if (!token) {
    return (
      <ResetCard>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Invalid reset link</h1>
          <p className="text-base text-gray-700 mb-8">
            This link is missing the security token. Please use the link from your email exactly as it was sent.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block w-full py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
          >
            Request a new link
          </Link>
        </div>
      </ResetCard>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password) {
      setError("Please enter a new password.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      setError("Password must include at least one letter and one number.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await apiRequest<{ message: string }>("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setSuccess(true);
      // Take them to /join after a short pause so they can read the success
      // state, then sign in with the new password.
      setTimeout(() => router.push("/join"), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <ResetCard>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Password reset</h1>
          <p className="text-base text-gray-700 mb-2">
            Your password has been updated.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Redirecting you to sign in&hellip;
          </p>
          <Link
            href="/join"
            className="inline-block w-full py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
          >
            Sign in now
          </Link>
        </div>
      </ResetCard>
    );
  }

  return (
    <ResetCard>
      <div className="inline-flex items-center gap-2 border-2 border-amber-500/60 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
        <KeyRound size={14} />
        Choose a new password
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Set your new password</h1>
      <p className="text-sm text-gray-600 mb-6">
        Choose a strong password you don&rsquo;t use anywhere else. All your other devices will be signed out.
      </p>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8+ characters, letter and number"
              required
              minLength={8}
              autoComplete="new-password"
              autoFocus
              className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter the same password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          Reset password
        </button>
      </form>
    </ResetCard>
  );
}

function ResetCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 md:px-[10%] py-12 bg-gradient-to-br from-amber-50 via-orange-50/80 to-amber-100">
        <div className="w-full max-w-md">
          <Link
            href="/join"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800 mb-6"
          >
            <ArrowLeft size={16} />
            Back to sign in
          </Link>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-pulse text-emerald-600 font-semibold">Loading&hellip;</div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
