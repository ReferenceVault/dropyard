"use client";

import { useRouter } from "next/navigation";
import { Footer } from "@/app/page";

export function GlobalFooter() {
  const router = useRouter();

  const setPage = (p: string) => {
    if (p === "home") router.push("/");
    else if (p === "buyers") router.push("/for-buyers");
    else if (p === "sellers") router.push("/for-sellers");
    else if (p === "howitworks") router.push("/how-it-works");
    else router.push("/");
  };

  // BUG-074 — generic CTAs default to signin. Explicit "Sign up" buttons
  // still pass "signup" to override. Matches the homepage helpers in
  // app/page.tsx; keep these two in sync.
  const goBuyerAuth = (mode: "signup" | "login" = "login") => {
    router.push(`/join?mode=${mode === "login" ? "signin" : "signup"}`);
  };

  const goSellerAuth = (mode: "signup" | "login" = "login") => {
    router.push(`/join?mode=${mode === "login" ? "signin" : "signup"}`);
  };
  const goMovingAuth = (mode: "signup" | "login" = "login") => {
    router.push(`/join?mode=${mode === "login" ? "signin" : "signup"}`);
  };

  return (
    <Footer
      goBuyerAuth={goBuyerAuth}
      goSellerAuth={goSellerAuth}
      goMovingAuth={goMovingAuth}
      setPage={setPage}
    />
  );
}
