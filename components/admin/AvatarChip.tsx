import React from "react";

const PALETTE = [
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-violet-400 to-violet-600",
  "from-sky-400 to-sky-600",
  "from-rose-400 to-rose-600",
  "from-teal-400 to-teal-600",
];

/** Deterministic colour from a seed string, so the same user always renders the same gradient. */
function paletteIndex(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % PALETTE.length;
}

export function AvatarChip({
  name,
  seed,
  size = "md",
}: {
  name: string;
  /** Optional seed for colour selection (e.g. user id). Falls back to name. */
  seed?: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  const sizing = size === "sm"
    ? "h-7 w-7 text-[10px]"
    : size === "lg"
    ? "h-10 w-10 text-sm"
    : "h-8 w-8 text-[11px]";

  const grad = PALETTE[paletteIndex(seed ?? name)];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-bold text-white bg-gradient-to-br ${grad} ${sizing} ring-2 ring-white shadow-sm flex-shrink-0`}
      aria-hidden
    >
      {initials}
    </span>
  );
}
