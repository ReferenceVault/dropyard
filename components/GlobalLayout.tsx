"use client";

import { usePathname } from "next/navigation";
import { GlobalHeader } from "./GlobalHeader";
import { GlobalFooter } from "./GlobalFooter";

export function GlobalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Authed/portal routes render their own shell — the public header + footer
  // should NOT appear on top of them.
  const isDashboard =
    pathname.startsWith("/buyer") ||
    pathname.startsWith("/seller") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/preview");

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && <GlobalHeader />}
      {/* Header is ~80px tall (h-20 logo). pt-16 (64px) was insufficient and
          slipped 16px of content under the fixed nav. */}
      <main className={`flex-1 flex flex-col ${isDashboard ? "" : "pt-20"}`}>{children}</main>
      {!isDashboard && <GlobalFooter />}
    </div>
  );
}
