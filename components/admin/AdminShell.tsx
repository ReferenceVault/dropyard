"use client";

import React, { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import type { AuthUser } from "@/context/AuthContext";

const LG_BREAKPOINT = 1024;

export function AdminShell({
  user,
  onSignout,
  children,
}: {
  user: AuthUser;
  onSignout: () => void;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Single header hamburger handler: on desktop it toggles the sidebar
  // collapse state; on mobile it opens the slide-out drawer.
  const toggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth >= LG_BREAKPOINT) {
      setCollapsed((c) => !c);
    } else {
      setMobileOpen(true);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f7faf8] flex">
      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar
          user={user}
          onSignout={onSignout}
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
