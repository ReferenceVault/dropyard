"use client";

import { useRouter } from "next/navigation";
import HowItWorksLanding from "@/components/HowItWorksLanding";

export default function HowItWorksRoute() {
  const router = useRouter();
  const goBuyer  = () => router.push("/for-buyers");
  const goSeller = () => router.push("/join?mode=signup");

  return <HowItWorksLanding {...({ onBuyerCta: goBuyer, onSellerCta: goSeller } as any)} />;
}
