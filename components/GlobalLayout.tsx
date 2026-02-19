"use client";

import { usePathname } from "next/navigation";
import { GlobalHeader } from "./GlobalHeader";
import { GlobalFooter } from "./GlobalFooter";

export function GlobalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/buyer";

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && <GlobalHeader />}
      <main className={`flex-1 flex flex-col ${isDashboard ? "" : "pt-16"}`}>{children}</main>
      {!isDashboard && <GlobalFooter />}
    </div>
  );
}
