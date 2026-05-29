"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminAuthedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, signout, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.replace("/admin/login");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "ADMIN") {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f7faf8]">
        <div className="flex items-center gap-3 text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-sm font-medium">Checking access…</p>
        </div>
      </div>
    );
  }

  return (
    <AdminShell user={user} onSignout={signout}>
      {children}
    </AdminShell>
  );
}
