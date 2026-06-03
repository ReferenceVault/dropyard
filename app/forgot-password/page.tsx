"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertCircle, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // Signed-in users have no business on the forgot-password page — they can
  // change their password from Settings. Bounce them to their dashboard.
  useEffect(() => {
    if (!authLoading && user) {
      router.replace(user.role === "ADMIN" ? "/admin" : "/buyer");
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address (e.g. you@example.com).");
      return;
    }
    setLoading(true);
    try {
      await apiRequest<{ message: string }>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: normalizedEmail }),
      });
      setSent(true);
    } catch (err: unknown) {
      // The server returns the same body whether the email matched or not, so
      // we only see real errors here (rate limit, network down, validation).
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            <div className="inline-flex items-center gap-2 border-2 border-amber-500/60 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Lock size={14} />
              Password reset
            </div>

            {sent ? (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-emerald-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h1>
                <p className="text-base text-gray-700 mb-2">
                  If an account exists for <span className="font-semibold">{email.trim().toLowerCase()}</span>,
                  we&rsquo;ve sent a reset link.
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  The link is valid for 30 minutes. Check your spam folder if it doesn&rsquo;t arrive in a minute or two.
                </p>
                <Link
                  href="/join"
                  className="inline-block w-full py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                >
                  Back to sign in
                </Link>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset your password</h1>
                <p className="text-sm text-gray-600 mb-6">
                  Enter the email address you signed up with and we&rsquo;ll send you a link to choose a new password.
                </p>

                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    <AlertCircle size={16} className="shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                        autoFocus
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
                    Send reset link
                  </button>
                </form>

                <p className="text-xs text-gray-500 mt-6 text-center">
                  For your security, we send the same response whether or not an account with that email exists.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
