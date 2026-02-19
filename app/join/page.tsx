"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  User,
  Zap,
  Shield,
  Users,
  Heart,
  Check,
} from "lucide-react";

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function JoinPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "signup") setAuthMode("signup");
    else setAuthMode("signin");
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/buyer");
  };

  return (
    <div className="min-h-full flex flex-col">
      {/* Main content - Split layout */}
      <div className="flex-1 flex flex-col lg:flex-row px-4 md:px-[5%] lg:px-[10%] bg-gradient-to-br from-amber-50 via-orange-50/80 to-amber-100">
        {/* Left Panel - Informational */}
        <div className="w-full lg:w-1/2 pt-16 lg:pt-20 pb-8 lg:pb-12 flex flex-col justify-start">
          <div>
            <div className="inline-flex items-center gap-2 border-2 border-amber-500/60 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Lock size={14} />
            Secure Authentication
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-emerald-600">Drop</span><span className="text-amber-500">Yard</span>
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            From one home to another. Real neighbors. No hassle.
          </p>
          <p className="text-base mb-10">
            <span className="text-emerald-600 font-medium">Currently live in Ottawa.</span> Expanding soon.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Zap size={24} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Your privacy comes first</h3>
                <p className="text-sm text-gray-600">
                  Your contact details are not shown publicly. You decide when to share.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Shield size={24} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">No brokers. No spam. No pressure</h3>
                <p className="text-sm text-gray-600">
                  Connect directly with neighbors. We actively remove fake and outdated listings.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Users size={24} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
                  Early-access community <Heart size={14} className="text-amber-500 fill-amber-500" />
                </h3>
                <p className="text-sm text-gray-600">
                  You&apos;re joining DropYard at an early stage as we build it neighborhood by neighborhood. We&apos;d love your feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-8 lg:py-12">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setAuthMode("signin")}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
                authMode === "signin"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode("signup")}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
                authMode === "signup"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Sign Up
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {authMode === "signin" ? "Welcome Back" : "Create your account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={authMode === "signin" ? "••••••••" : "Create a password (8+ characters)"}
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

            {authMode === "signin" ? (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-sm text-emerald-600 font-medium hover:underline">
                  Forgot password?
                </button>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <input type="checkbox" id="terms" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mt-0.5" />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the <span className="text-emerald-600 font-medium cursor-pointer">Terms of Service</span> and <span className="text-emerald-600 font-medium cursor-pointer">Privacy Policy</span>
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
            >
              {authMode === "signin" ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <GoogleIcon />
            <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
          </button>

          {/* Security indicators */}
          <div className="flex items-center justify-center gap-6 mt-10 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <Check size={14} className="text-emerald-500" />
              Secure
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <Lock size={14} className="text-emerald-500" />
              Encrypted
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <Shield size={14} className="text-emerald-500" />
              Private
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-pulse text-emerald-600 font-semibold">Loading...</div></div>}>
      <JoinPageContent />
    </Suspense>
  );
}
