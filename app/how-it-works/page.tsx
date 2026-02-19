"use client";

import { useRouter } from "next/navigation";
import { HowItWorksPage } from "../page";

export default function HowItWorksRoute() {
  const router = useRouter();

  const setPage = (p: string) => {
    if (p === "home") router.push("/");
    else if (p === "buyers") router.push("/for-buyers");
    else if (p === "sellers") router.push("/for-sellers");
    else router.push("/");
  };

  const goBuyerAuth = (mode?: "signup" | "login") => {
    router.push(`/join?mode=${mode === "login" ? "signin" : "signup"}`);
  };

  const goSellerAuth = () => router.push("/join?mode=signup");

  return (
    <HowItWorksPage
      goBuyerAuth={goBuyerAuth}
      goSellerAuth={goSellerAuth}
      setPage={setPage}
    />
  );
}
