import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

function IconBase({ children, className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </IconBase>
  );
}

function MapPinIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </IconBase>
  );
}

function ChevronDownIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  );
}

const BRAND_GREEN = "#2f8f2f";
const BRAND_ORANGE = "#f59e0b";

const quickFilters = [
  "Furniture",
  "Electronics",
  "Kids & Baby",
  "Kitchen",
  "Sports",
  "Clothing",
];

const neighborhoods = [
  { name: "Barrhaven", status: "live" },
  { name: "Kanata", status: "coming_soon" },
  { name: "Nepean", status: "coming_soon" },
  { name: "Orléans", status: "coming_soon" },
  { name: "Stittsville", status: "coming_soon" },
];

function runChecks() {
  if (!quickFilters.length) {
    throw new Error("quickFilters must not be empty");
  }
  if (!neighborhoods.length) {
    throw new Error("neighborhoods must not be empty");
  }
  if (!neighborhoods.some((n) => n.status === "live")) {
    throw new Error("At least one neighborhood must be live");
  }
}

runChecks();

export default function DropYardSearchHeroRedesign() {
  const [query, setQuery] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("Barrhaven");
  const [activeFilter, setActiveFilter] = useState("Furniture");

  const helperText = useMemo(() => {
    return selectedNeighborhood === "Barrhaven"
      ? "Search 156+ items available in Barrhaven's live Drop"
      : `Join the waitlist for ${selectedNeighborhood} before it launches`;
  }, [selectedNeighborhood]);

  return (
    <section className="relative overflow-hidden bg-[#f7faf8] py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-80px] top-8 h-56 w-56 rounded-full bg-[rgba(47,143,47,0.08)] blur-3xl" />
        <div className="absolute right-[-60px] top-12 h-52 w-52 rounded-full bg-[rgba(245,158,11,0.10)] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(47,143,47,0.14)] bg-white/90 px-4 py-2 text-sm font-medium text-[color:var(--brand-green)] shadow-sm backdrop-blur"
            style={{ ['--brand-green']: BRAND_GREEN }}
          >
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: BRAND_GREEN }} />
            Barrhaven is live now
          </div>

          <h2 className="text-balance text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
            Find what you're looking for.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            {helperText}
          </p>

          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-3">
            {neighborhoods.map((neighborhood) => {
              const isLive = neighborhood.status === "live";
              return (
                <div
                  key={neighborhood.name}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                    isLive
                      ? "bg-[rgba(47,143,47,0.10)] text-[color:var(--brand-green)]"
                      : "bg-slate-100 text-slate-500"
                  }`}
                  style={{ ['--brand-green']: BRAND_GREEN }}
                >
                  <span className="relative inline-flex h-2.5 w-2.5">
                    {isLive && (
                      <span
                        className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-75"
                        style={{ backgroundColor: BRAND_GREEN }}
                      />
                    )}
                    <span
                      className="relative inline-flex h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: isLive ? BRAND_GREEN : '#cbd5e1' }}
                    />
                  </span>
                  {neighborhood.name}
                  <span className="text-xs font-medium uppercase tracking-[0.12em] opacity-80">
                    {isLive ? 'Live now' : 'Coming soon'}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mx-auto mt-10 max-w-6xl"
        >
          <div className="rounded-[32px] border border-white/70 bg-white/90 p-3 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-4">
            <div className="grid gap-3 lg:grid-cols-[1.45fr_0.58fr_auto]">
              <label className="group flex min-h-[68px] items-center gap-4 rounded-[24px] border border-slate-100 bg-slate-50/90 px-5 transition focus-within:border-[rgba(47,143,47,0.22)] focus-within:bg-white focus-within:shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-100 transition group-focus-within:text-[color:var(--brand-green)]"
                  style={{ ['--brand-green']: BRAND_GREEN }}
                >
                  <SearchIcon className="h-5 w-5" />
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search items, brands, or categories"
                  className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 sm:text-lg"
                />
              </label>

              <div className="relative">
                <select
                  value={selectedNeighborhood}
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                  className="min-h-[68px] w-full appearance-none rounded-[24px] border border-slate-100 bg-slate-50/90 pl-14 pr-12 text-base font-medium text-slate-800 outline-none transition hover:bg-white focus:border-[rgba(47,143,47,0.22)] focus:bg-white sm:text-lg"
                >
                  {neighborhoods.map((neighborhood) => (
                    <option key={neighborhood.name} value={neighborhood.name}>
                      {neighborhood.name} {neighborhood.status === 'live' ? '• Live now' : '• Coming soon'}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[color:var(--brand-green)]"
                  style={{ ['--brand-green']: BRAND_GREEN }}
                >
                  <MapPinIcon className="h-5 w-5" />
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                  <ChevronDownIcon className="h-4 w-4" />
                </div>
                
              </div>

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.985 }}
                className="inline-flex min-h-[68px] items-center justify-center gap-3 rounded-[24px] px-7 text-lg font-semibold text-white shadow-[0_14px_35px_rgba(47,143,47,0.24)] transition"
                style={{ background: `linear-gradient(135deg, ${BRAND_GREEN} 0%, ${BRAND_GREEN} 60%, ${BRAND_ORANGE} 100%)` }}
              >
                <SearchIcon className="h-5 w-5" />
                {selectedNeighborhood === 'Barrhaven' ? 'Search Barrhaven' : 'Notify Me'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-center gap-3"
        >
          {quickFilters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition sm:text-base ${
                  isActive
                    ? "text-white shadow-md"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
                style={
                  isActive
                    ? { background: `linear-gradient(135deg, ${BRAND_GREEN} 0%, ${BRAND_ORANGE} 100%)` }
                    : undefined
                }
              >
                {filter}
              </button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
