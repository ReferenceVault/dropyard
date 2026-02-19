"use client";

import { useRouter } from "next/navigation";
import { SellersPage } from "../page";

export default function ForSellersRoute() {
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

  const goMovingAuth = () => router.push("/join?mode=signup");

  return (
    <SellersPage
      goBuyerAuth={goBuyerAuth}
      goSellerAuth={goSellerAuth}
      goMovingAuth={goMovingAuth}
      setPage={setPage}
    />
  );
}
