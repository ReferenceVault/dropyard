"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Mail } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type State = "idle" | "verifying" | "success" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { refreshUser } = useAuth();
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    if (!token) {
      setState("error");
      setMessage("This verification link is missing the security token.");
      return;
    }
    setState("verifying");
    apiRequest<{ message: string }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        // Refresh the cached user object so AuthContext's verifiedAt updates
        // immediately. Without this, /buyer keeps showing the "Verify your
        // email" banner until the user manually refreshes the page.
        // refreshUser is a no-op if the user isn't signed in (e.g. opened
        // the link in incognito) — safe either way.
        try { await refreshUser(); } catch { /* non-fatal */ }
        setState("success");
        setMessage(res.message);
      })
      .catch((err: unknown) => {
        setState("error");
        setMessage(err instanceof Error ? err.message : "Something went wrong.");
      });
  }, [token, refreshUser]);

  return (
    <Card>
      {state === "verifying" && (
        <div className="text-center">
          <Loader2 size={32} className="text-emerald-600 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email…</h1>
          <p className="text-sm text-gray-500">One moment.</p>
        </div>
      )}

      {state === "success" && (
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Email verified</h1>
          <p className="text-base text-gray-700 mb-8">{message || "You're all set."}</p>
          <Link
            href="/buyer"
            className="inline-block w-full py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
          >
            Continue to DropYard
          </Link>
        </div>
      )}

      {state === "error" && (
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Couldn&rsquo;t verify your email</h1>
          <p className="text-base text-gray-700 mb-8">{message}</p>
          <p className="text-sm text-gray-500 mb-6">
            You can request a new verification email from your dashboard.
          </p>
          <Link
            href="/buyer"
            className="inline-block w-full py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
          >
            Back to DropYard
          </Link>
        </div>
      )}

      {state === "idle" && (
        <div className="text-center">
          <Mail size={32} className="text-emerald-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500">Preparing verification…</p>
        </div>
      )}
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 md:px-[10%] py-12 bg-gradient-to-br from-amber-50 via-orange-50/80 to-amber-100">
        <div className="w-full max-w-md">
          <Link
            href="/buyer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800 mb-6"
          >
            <ArrowLeft size={16} />
            Back to DropYard
          </Link>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-pulse text-emerald-600 font-semibold">Loading…</div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
