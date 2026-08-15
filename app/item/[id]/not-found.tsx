import Link from "next/link";

/**
 * Shown when a shared item link points at something that no longer exists —
 * deleted listing, bad id, or the backend being unreachable. Shared links
 * outlive the items they point at, so this is a normal destination, not an
 * error state: give the visitor somewhere to go instead of a dead end.
 */
export default function ItemNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">📦</div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">This listing isn&apos;t available</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
        It may have been picked up already, or the link may be out of date. Plenty of other things are up for grabs
        nearby.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/buyer"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-[14px] font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-800"
        >
          Browse the Drop →
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-[14px] font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Back to DropYard
        </Link>
      </div>
    </main>
  );
}
