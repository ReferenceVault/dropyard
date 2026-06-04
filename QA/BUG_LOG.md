# DropYard Bug Log

**One row per discovered defect.** Add new rows at the top so the most recent stays visible. Close bugs in-place — don't delete them; the history is useful when a regression returns.

## Severity definitions

| Severity | Definition | Examples |
|---|---|---|
| **P0** | Blocks deploy or causes data loss / security breach | Login broken, payment data leaks, items deleted on edit |
| **P1** | Blocks a primary user flow; no workaround | Can't post item, can't claim, claim status doesn't update |
| **P2** | User-visible defect with a workaround | Wrong count on Overview, mobile layout broken at 360px |
| **P3** | Polish / minor visual / non-blocking | Tooltip wording odd, spacing off by 2px, console warning |

## Status definitions

- **Open** — observed and reproducible, not yet picked up
- **In Progress** — fix being written
- **Fixed (verify)** — fix committed, awaiting re-test
- **Closed** — re-tested and verified gone
- **Won't Fix** — accepted as known limitation, document why

---

## Open bugs (P0/P1 first)

_None._

## P2 — Fixed this session

### BUG-034  ·  P3  ·  Inconsistent invalid-filter handling across admin list endpoints  ·  Status: Open
**Title:** `/api/admin/moving-sales?status=NOPE` returns 400 (guarded post-BUG-019), but `/api/admin/submissions?status=NOPE`, `/api/admin/submissions?type=NOPE`, and `/api/claims/incoming?status=NOPE` silently fall back to default and return 200. Behavior is inconsistent across similar-shape endpoints.
**Found by:** Narveer · **Found date:** 2026-06-04 · **Test case:** TC-D8.1b/c + TC-C11.9
**Repro steps:** `curl /api/admin/submissions?status=NOPE` → 200 with all submissions. `curl /api/admin/moving-sales?status=NOPE` → 400 "Invalid status".
**Expected:** Consistent behavior across all list endpoints — either all guard with 400 (preferred for early error surfacing) or all fall back (preferred for resilience).
**Actual:** Two endpoints reject, two endpoints fall back.
**Impact:** P3 — no functional bug, no crash, no data leak. Just a developer-experience inconsistency that makes the API harder to reason about. The cross-cutting test plan TC-C11 #1 explicitly says "falls back to default OR 400" — so both branches are technically acceptable.
**Notes:** Worth aligning to one pattern when there's time. Recommendation: surface as 400 with `Invalid status` for all filter params, mirroring how the moving-sales handler does it (early validation against the enum). Defer until there's a cohesive API-cleanup pass — not worth one-off-fixing the three endpoints today.

### BUG-033  ·  P2  ·  PATCH /api/admin/moving-sales/:id/reject silently accepts (and discards) rejection reason  ·  Status: Fixed (verify)
**Title:** The route handler at `dropyard_backend/src/routes/admin.ts:665` took no `reason` field from the request body and wrote no rejection reason to the database. The admin frontend's reject button at `MovingSaleDetailPanel` also sent no body. The seller, when notified, had no idea why their application was rejected.
**Found by:** Narveer · **Found date:** 2026-06-04 · **Test case:** TC-D7.7c (reject without reason, expected 400 per docs)
**Repro steps (before fix):**
1. As admin, `curl -X PATCH /api/admin/moving-sales/:id/reject -d '{}'`
2. **Actual:** 200, status flips to REJECTED, no reason stored.
**Expected:** 400 "rejection reason is required".
**Impact:** P2 — rejected seller had no actionable feedback. Audit log had nothing on rejections either, so the admin team couldn't review past decisions.
**Fix commit:** _(local, dropyard_backend/prisma/schema.prisma + migration 20260604103115_add_moving_sale_rejection_reason + src/routes/admin.ts + dropyard_frontend/app/admin/(authed)/moving-sales/page.tsx)_
**Re-tested:**
  - ✅ POST without `reason` body → 400 "A rejection reason is required."
  - ✅ POST with whitespace-only reason → 400
  - ✅ POST with valid reason → 200, reason persisted to `MovingSale.rejectionReason`
  - ✅ GET /:id surfaces `rejectionReason` in response
  - ✅ Audit log entry `MOVING_SALE_REJECTED` created with `reason` and `payload: { from, to: 'REJECTED' }`
  - ✅ Oversized (2001 char) reason → 400 (max 2000)
  - ✅ Frontend admin UI: clicking Reject now toggles a rose-tinted textarea + "Confirm Reject" / "Cancel" footer; required client-side; on success the side panel footer reads `Rejected — "…"` for the persisted reason.
**Notes:**
  1. Schema: added `rejectionReason String?` on `MovingSale`, applied migration `20260604103115_add_moving_sale_rejection_reason`.
  2. Backend: `/reject` now validates `reason` (non-empty, ≤2000 chars) and writes a `MOVING_SALE_REJECTED` audit log entry inside a `$transaction` alongside the status update. Symmetric `MOVING_SALE_APPROVED` audit entry was added to `/approve` for parity — admin history now captures both sides.
  3. Frontend: `MovingSaleDetailPanel` adds `rejectMode` state that swaps the footer from the approve form to a reason textarea. The persisted `rejectionReason` is surfaced in the read-only footer (`Rejected — "…"`).
  4. TypeScript cast (`as Prisma.MovingSaleUpdateInput`) on the data field — Windows EPERM file lock blocked `prisma generate` while backend ran; the column exists in the DB and the cast unblocks TS until `prisma generate` is re-run on next backend restart.
  5. Notification email — deferred. The reason is now in the DB; a future pass can surface it in the seller-rejected email template.

### BUG-032  ·  P1  ·  POST /api/watchlist/:itemId crashes backend on nonexistent itemId  ·  Status: Fixed (verify)
**Title:** When a buyer hits `POST /api/watchlist/:itemId` with an itemId that doesn't exist, the Prisma `upsert` fires a foreign-key constraint violation against `Watchlist.itemId → Item.id`. The handler has no try/catch, so the unhandled promise rejection takes the Node process down. Same root-cause pattern as BUG-019 (missing validation + missing try/catch on a route that touches a relational FK).
**Found by:** Narveer · **Found date:** 2026-06-04 · **Test case:** TC-C12.7 (POST /api/watchlist/:nonexistent)
**Repro steps:**
1. Sign in as any buyer, capture token T.
2. `curl -X POST http://localhost:4000/api/watchlist/nope_xxxxxxxxxxxxxxxxxxxxxx -H "Authorization: Bearer T"`
3. Backend process exits (or hangs on the next request).
**Expected:** 404 "Item not found" with backend still alive.
**Actual (before fix):** Request hangs → connection drops → next curl gets 000 (couldn't connect).
**Impact:** P1 — anyone with a valid auth token (i.e. any signed-in buyer) can crash the entire backend with one request. While auth is required, this is still a denial-of-service vector. Beyond DoS, it broke Wave C testing mid-sweep (TC-C12.8-12.10 returned 000 not because their unauth was rejected, but because the backend had died from 12.7).
**Fix commit:** _(local, dropyard_backend/src/routes/watchlist.ts)_
**Re-tested:** ✅ TC-C12.7 now returns 404 with `{"error":"Item not found"}`. Backend stays alive. All other 12.x cases pass.
**Notes:** Two-part fix in `routes/watchlist.ts`: (a) pre-check `prisma.item.findUnique({ where: { id: itemId }})` and return 404 if missing — clean primary fix; (b) wrap the upsert in try/catch as defense-in-depth in case a concurrent item delete races between the check and the upsert (still surfaces as 500 instead of crashing). Also added try/catch around the DELETE handler for consistency, though `deleteMany` is naturally idempotent and didn't have the same crash risk.

### BUG-031  ·  P2  ·  Seller TopNav first-paint flicker on mobile — JS isMobile branches caused desktop layout to render briefly  ·  Status: Fixed (verify)
**Title:** Resolves the deferred limitation flagged in BUG-030. The seller TopNav and main content area used JS `isMobile` branches for grid columns, paddings, heights, and show/hide of search/sidebar-toggle. On mobile devices the SSR HTML rendered the desktop layout (because `useViewport` defaults to width=1280 server-side), then hydrated and re-rendered as mobile — producing a visible flicker at first paint, brief horizontal overflow, and a momentarily mis-aligned breadcrumb.
**Found by:** Carry-over from BUG-030 · **Found date:** 2026-06-04 · **Test case:** _mobile review during Phase 2_
**Repro steps (before fix):**
1. Open `/buyer` on a real mobile device. Switch to Seller via the truck pill.
2. Observe: brief frame of TopNav with 240px logo column + desktop search bar + "Seller /" breadcrumb, then re-renders as mobile.
**Expected:** Mobile layout from SSR HTML / first paint, no flicker.
**Actual (before fix):** Desktop layout in SSR → flicker → mobile layout after hydration.
**Impact:** P2 — purely visual, no broken functionality. But noticeable on every seller-mode load and felt unprofessional.
**Fix commit:** _(local, dropyard_frontend/components/previews/DropYard_SellerDashboard.jsx + app/globals.css)_
**Re-tested:** ⏳ Requires hard refresh.
**Notes:** Refactored the TopNav SHELL to be CSS-driven instead of JS-driven:
  1. Added CSS classes to `globals.css`: `.dy-seller-topnav` (header grid, height, padding, gap), `.dy-seller-topnav__logo-zone` (border, padding), `.dy-seller-topnav__logo` (height), `.dy-seller-topnav__breadcrumb` (font), `.dy-seller-topnav__right` (gap), `.dy-seller-topnav__bell` (size + hover), `.dy-seller-main` (main padding incl. mobile bottom-nav clearance).
  2. Each class has desktop defaults + `@media (max-width: 768px)` overrides.
  3. Removed `useViewport()` from `TopNav` entirely. All layout flips happen via CSS now — meaning the SSR HTML is correct for any viewport.
  4. Used `.dy-desktop-only` to hide the sidebar toggle, "Seller /" breadcrumb prefix, and search bar on mobile; `.dy-mobile-only` already hid Switch-to-Buyer on desktop.
  5. Hardcoded `#EDE8E0` (C.fawn) in the CSS — flagged in a CSS comment that this needs to stay in sync with the JSX color constants.
**Out of scope** (kept JS `isMobile`): inner-view content (Overview, MyItemsView, ManualItemForm, etc) still uses `useViewport()`. Those flicker too, but to a much smaller degree because by the time content matters, hydration is usually complete. A follow-up pass could convert them too, but the shell was the visible problem.

### BUG-030  ·  P1  ·  Seller dashboard mobile view completely broken — sidebar visible, no bottom nav, horizontal scroll  ·  Status: Fixed (verify)
**Title:** Mirror of BUG-029 but for the seller dashboard. After switching to seller mode, mobile users see the desktop sidebar bleeding into the viewport, no mobile bottom nav, and horizontal scroll.
**Found by:** Narveer · **Found date:** 2026-06-04 · **Test case:** _mobile review during Phase 2_
**Repro steps:** Open `/buyer`, switch to Seller via the truck pill, view on mobile width.
**Expected:** Mobile-friendly layout — sidebar hidden, bottom nav visible, content fits viewport.
**Actual (before fix):** Sidebar rendered at top, content shifted off-screen, no bottom nav.
**Impact:** P1 — same severity as BUG-029. Primary product surface unusable on mobile.
**Fix commit:** _(local, dropyard_frontend/components/previews/DropYard_SellerDashboard.jsx + app/globals.css)_
**Re-tested:** ⏳ Requires hard refresh.
**Notes:** Mirrored the BUG-029 fix pattern to seller dashboard:
  1. `Sidebar` now renders unconditionally (removed `{!isMobile && ...}` gate). Added `className="dy-desktop-sidebar"` to the `<aside>`. CSS rule in globals.css hides on `max-width: 768px`.
  2. `MobileBottomNav` now renders unconditionally (removed `{isMobile && ...}` gate). Added `className="dy-mobile-bottom-nav"`. Same CSS rule from BUG-029 already hides on `min-width: 769px`. Bumped z-index 50 → 60 for parity with buyer.
  3. The same mobile-scoped `body { overflow-x: hidden }` from globals.css catches any remaining transient overflow during the SSR-to-mobile re-render (TopNav's `gridTemplateColumns: isMobile ? "auto 1fr auto" : "240px auto 1fr auto"` still renders the 240px desktop logo column on SSR; will be visible briefly before mobile layout kicks in).
**Known follow-up**: TopNav and various `isMobile`-dependent inline styles in seller dashboard still cause a brief desktop-flash on first paint. Same root cause as BUG-029 — `useViewport` defaults to width=1280 on SSR. The CSS clip masks it but doesn't eliminate the flicker. Proper fix is to convert layout primitives (grid columns, sidebar width, main padding) to CSS classes with media queries instead of JS `isMobile` branches. Deferred — too large for this turn.

### BUG-029  ·  P1  ·  Mobile bottom nav (Discover/Saved/Claims/Messages/You) only appears after scrolling on /buyer  ·  Status: Fixed (verify)
**Title:** On real mobile devices, the bottom nav strip doesn't show on initial page load. It pops in only after the user scrolls or some other re-render is triggered. Major UX regression because the bottom nav is the only mobile-primary navigation.
**Found by:** Narveer · **Found date:** 2026-06-04 · **Test case:** _mobile review during Phase 2_
**Repro steps:**
1. Open `/buyer` on a real mobile device.
2. On first paint, no `MobileBottomNav` visible.
3. Scroll the page. Bottom nav appears.
**Expected:** Bottom nav present from the first paint.
**Actual:** SSR HTML doesn't contain the bottom nav. Hydration eventually adds it.
**Impact:** P1 — primary mobile navigation invisible until user discovers it via scrolling. Combined with the horizontal-scroll regression (BUG-028), the mobile experience was broken.
**Fix commit:** _(local, dropyard_frontend/components/previews/DropYard_BuyerDashboard.jsx + app/globals.css)_
**Re-tested:** ⏳ Requires hard refresh on a mobile-width browser.
**Notes:** Root cause: `useViewport` initializes width to `typeof window !== "undefined" ? window.innerWidth : 1280`. On SSR, `window` is undefined → 1280 → `isMobile=false` → `{isMobile && <MobileBottomNav/>}` gates the nav OUT of SSR HTML. On the client, hydration eventually runs the resize/effects → `isMobile=true` → React inserts the nav → user sees it appear. The "scrolling reveals it" perception is just the hydration timing. **Fix**: render `MobileBottomNav` UNCONDITIONALLY (no `{isMobile && ...}` gate) and hide it on desktop via a CSS media query (`@media (min-width: 769px) { .dy-mobile-bottom-nav { display: none } }`). Now the nav is in SSR HTML on every page; CSS decides visibility per viewport. No more hydration-timing pop-in. Also applies to the same pattern in the seller dashboard (deferred — not changed this turn). Same root cause likely explains part of BUG-028 (horizontal scroll): the desktop layout briefly renders during the SSR-to-mobile transition. Added a mobile-only `body { overflow-x: hidden }` rule scoped to `@media (max-width: 768px)` to clip the transient overflow without affecting desktop.

### BUG-028  ·  P2  ·  Buyer dashboard scrolls horizontally on mobile — page wider than viewport  ·  Status: Defensive fix applied (verify)
**Title:** After Phase 2 + the FilterRail hooks fix, `/buyer` on mobile widths scrolls horizontally. Some descendant of the dashboard's outer container is wider than the viewport.
**Found by:** Narveer · **Found date:** 2026-06-04 · **Test case:** _mobile review during Phase 2_
**Repro steps:** Open `/buyer` at a mobile width (≤768px). Drag horizontally — page scrolls left/right when it shouldn't.
**Expected:** Page fits the viewport width. No horizontal scroll.
**Actual (before fix):** Horizontal scroll appeared. Did NOT exist before Phase 2.
**Impact:** P2 — page is usable but feels broken. Visual content slides off-screen.
**Fix commit:** _(local, dropyard_frontend/components/previews/DropYard_BuyerDashboard.jsx)_
**Re-tested:** ⏳ Requires hard refresh.
**Notes:** Defensive fix — added `overflowX: "hidden"` to the dashboard's outer wrapper div (line ~4895). This clips any descendant overflow without needing to identify the exact offending element. Did NOT find the root cause — checked grids (all `auto-fill minmax(220-260px, 1fr)` which collapse to 1 col at 328px content width, safe), checked MobileFilterBar (uses `flex: 1` for search + `flexShrink: 0` for 44px button, fits), checked TopBar (logo + SwitchToSellerButton compact + UserMenu, ~180px total + gaps, fits at 360px). Suspect a transient SSR-vs-client mismatch where the desktop `FilterRail` capsule renders during SSR (because `useViewport`'s initial width defaults to 1280) and briefly overflows mobile before the client re-renders as `MobileFilterBar`. The `overflowX: hidden` masks that transient state. Should investigate properly when there's time — but this unblocks users today.

### BUG-027  ·  P1  ·  "Switch to Seller" still inaccessible on buyer mobile after BUG-023 fix — UserMenu dropdown is not discoverable  ·  Status: Fixed (verify)
**Title:** BUG-023 added "Switch to Seller" to the mobile UserMenu dropdown. User reported it was still inaccessible — they didn't realize they had to tap the avatar to find it.
**Found by:** Narveer · **Found date:** 2026-06-04 · **Test case:** _mobile review during Phase 2 (follow-up to BUG-023)_
**Repro steps:** Open /buyer on mobile width. Look for any Switch to Seller affordance in the visible UI without opening menus.
**Expected:** Affordance is visible (or has a discoverable hint) without requiring user to discover the avatar dropdown.
**Actual (before this fix):** Switch to Seller existed only inside UserMenu dropdown (which itself requires tapping the unlabeled avatar to discover).
**Impact:** P1 — same impact as BUG-023 (no path from buyer to seller dashboard on mobile). The BUG-023 fix nominally restored the feature but UX-tested it was still effectively hidden.
**Fix commit:** _(local, dropyard_frontend/components/previews/DropYard_BuyerDashboard.jsx)_
**Re-tested:** ⏳ Requires hard refresh.
**Notes:** Replaced the BUG-023 approach. Now `SwitchToSellerButton` renders on mobile too, in a compact icon-only variant: just the Truck-icon tile, no label, no arrow. Added `compact` prop to the component (default false on desktop, true on mobile). Removed the duplicate menu item from UserMenu — single source of truth in the topbar pill. The icon-only mobile version is ~40×40px (touch-friendly), still amber-tinted so it matches the desktop pill's affordance, with `aria-label` and `title` for screen readers / hover tooltip. UserMenu no longer needs the `onSwitchRole` prop; removed it from both component signature and call site.

### BUG-026  ·  P1  ·  FilterRail violates Rules of Hooks — buyer Discover page crashes at SSR/mobile boundary  ·  Status: Fixed (verify)
**Title:** `FilterRail` in `DropYard_BuyerDashboard.jsx` calls `useState` × 3 and `useEffect` AFTER an `if (isMobile) return <MobileFilterBar/>` early return. When `isMobile` flips (which happens during SSR hydration: server `width=1280→isMobile=false`, client reads actual viewport), the hook count changes and React throws.
**Found by:** Narveer · **Found date:** 2026-06-04 · **Test case:** _mobile review during Phase 2_
**Repro steps:**
1. Open `/buyer` on mobile width (≤768px).
2. Browser console / Next.js overlay shows: "React has detected a change in the order of Hooks called by FilterRail" → followed by "Rendered more hooks than during the previous render."
3. Code: `dropyard_frontend/components/previews/DropYard_BuyerDashboard.jsx:1056` — `useViewport()`, then `if (isMobile) return...`, then `useState(null)` × 3 + `useEffect`.
**Expected:** All hooks run unconditionally on every render; the mobile/desktop branch determines only what's returned.
**Actual (before fix):** Hooks 2-5 are skipped when `isMobile=true` but run when `isMobile=false`. React explodes on viewport flip.
**Impact:** P1 — buyer Discover page is unrenderable on mobile or whenever the viewport state changes. The error is also misleading: it surfaces secondary errors (hydration mismatches downstream) that distract from the root cause.
**Fix commit:** _(local, dropyard_frontend/components/previews/DropYard_BuyerDashboard.jsx)_
**Re-tested:** ⏳ Requires hard refresh at mobile width.
**Notes:** Standard Rules of Hooks fix — moved all hook calls (`useState` × 3 + `useEffect`) above the `if (isMobile) return ...` branch. Added a comment explaining why. Verified there's no similar pattern elsewhere: searched both dashboard files for `if (isMobile)` early returns; the only other match (seller `MyItemsView` line 4288) is inside a `.map()` callback, not a component-level early return — safe.

### BUG-025  ·  P1  ·  /buyer hydration mismatch — server renders loading div, client renders mounted placeholder  ·  Status: Fixed (verify)
**Title:** When `/buyer` loads, React reports a hydration mismatch: server-side HTML contains `BuyerDashboardContent`'s "Checking access" loading div (`h-screen flex items-center justify-center bg-[#f7faf8]`), but client first-render produces `AuthedBuyerContent`'s `!mounted` placeholder (`min-h-screen bg-slate-50`). React re-generates the tree client-side, masking the underlying cause and degrading first paint.
**Found by:** Narveer · **Found date:** 2026-06-04 · **Test case:** _mobile review during Phase 2_
**Repro steps:**
1. Visit `/buyer` (any width).
2. Next.js overlay shows hydration mismatch with className diff: `+ min-h-screen bg-slate-50` (client) vs `- h-screen flex items-center justify-center bg-[#f7faf8]` (server).
**Expected:** Server and client first-paint markup match.
**Actual (before fix):** Server takes `BuyerDashboardContent`'s loading branch (since `useAuth` returns `loading=true, user=null` on SSR). Client first render reaches `AuthedBuyerContent`'s `!mounted` early return with different markup. Hydration mismatch.
**Impact:** P1 — every visit to `/buyer` causes a hydration error and a forced client re-render. Real users see a brief flicker; the broken tree also surfaces cascading errors downstream (the FilterRail hooks bug above was masked by this).
**Fix commit:** _(local, dropyard_frontend/app/buyer/page.tsx)_
**Re-tested:** ⏳ Requires hard refresh.
**Notes:** Pragmatic fix — aligned `AuthedBuyerContent`'s `!mounted` placeholder (2 occurrences, one per `mode` branch) with the exact loading markup from `BuyerDashboardContent`. Now whichever branch the SSR HTML reflects, the client's first-render markup matches byte-for-byte. Did NOT investigate WHY the client first render is reaching `AuthedBuyerContent` when the server takes the loading branch — `AuthProvider`'s `useState` initializes with `loading=true, user=null` identically on both, so they should match. Speculation: React 19 + Next 16 Turbopack runs the initial render in some non-blocking way that allows `useEffect` to complete before hydration validation. Mooting the question by making both branches' fallbacks identical is safer than chasing the discrepancy. Both placeholders now render the "Checking access…" pill on the `#f7faf8` background.

### BUG-024  ·  P2  ·  Buyer mobile bottom nav reportedly missing on Claims page  ·  Status: Defensive fix applied (verify)
**Title:** User reported that on /buyer at mobile width, the MobileBottomNav appears on Saved/Messages but not on Claims.
**Found by:** Narveer · **Found date:** 2026-06-04 · **Test case:** _mobile review during Phase 2_
**Repro steps (per user):** Open /buyer on a mobile-width viewport, navigate to Claims tab from bottom nav.
**Expected:** MobileBottomNav remains visible at the bottom on Claims like every other view.
**Actual (per user):** Bottom nav doesn't appear on Claims.
**Code analysis:** `MobileBottomNav` is rendered unconditionally inside `{isMobile && ...}` at the dashboard root (`DropYard_BuyerDashboard.jsx` ~line 4928). It's `position: fixed; bottom: 0`. Parent has `padding-bottom: calc(76px + env(safe-area-inset-bottom, 0))` so content clears the nav. ClaimsPage (~line 2919) renders no fixed/sticky element that would cover the nav. Only fixed-position element in ClaimsPage scope is the cancel-confirmation modal (z-index 200), which only opens on user action. **Could not reproduce from code review.**
**Impact:** P2 — bottom nav is the only mobile-primary navigation. If broken on Claims, users can't switch tabs without scrolling back to top.
**Fix commit:** _(local, dropyard_frontend/components/previews/DropYard_BuyerDashboard.jsx — bumped MobileBottomNav z-index 50→60)_
**Re-tested:** ⏳ Awaiting user re-test after dev server restart. If still missing, will need to instrument with browser dev tools to identify what's covering the nav.
**Notes:** Defensive fix only — bumped nav z-index from 50 to 60 to defeat any unknown overlay sitting at z-index 50-59. Did not change the render condition. If issue persists, suspect either (a) a hot-reload / state caching issue where ClaimsPage was rendered before Phase 2 modal edits committed, (b) a viewport-specific behavior we missed, or (c) a per-row action button somehow being interpreted as covering the nav.

### BUG-023  ·  P1  ·  "Switch to Seller" inaccessible on buyer mobile — no way to upgrade role  ·  Status: Fixed (verify)
**Title:** On `/buyer` at mobile width, the "Switch to Seller" entry point is hidden with no replacement. Mobile buyers cannot reach the seller dashboard.
**Found by:** Narveer · **Found date:** 2026-06-04 · **Test case:** _mobile review during Phase 2_
**Repro steps:**
1. Open `/buyer` at mobile width (≤768px).
2. Inspect TopBar — `SwitchToSellerButton` is gated `{!isMobile && <SwitchToSellerButton .../>}` (line 580).
3. Open UserMenu — no Switch to Seller entry there either.
**Expected:** Mobile users have a discoverable path to the seller dashboard.
**Actual (before fix):** Dead end. Mobile buyers must rotate their device or open desktop to switch.
**Impact:** P1 because seller acquisition / role-switch is a primary product flow. The buyer dashboard advertises seller features (e.g. `SellWithAICta`) on Discover, so a buyer who clicks through expects to land on the seller side. On mobile they had nowhere to go.
**Fix commit:** _(local, dropyard_frontend/components/previews/DropYard_BuyerDashboard.jsx)_
**Re-tested:** ⏳ Requires manual verification at mobile width.
**Notes:** Added a Switch to Seller entry to the mobile UserMenu (avatar dropdown), gated on `isMobile && onSwitchRole`. Uses the same `Truck` icon and amber color as the desktop pill so the affordance is recognizable. UserMenu now accepts an `onSwitchRole` prop and TopBar forwards it. Desktop behavior unchanged (Switch to Seller stays in the TopBar pill where it always was). Note: `DiscoverPage` also has a `SellWithAICta` that wires `onSwitchRole` (line ~4340) — that's a discover-page CTA, not nav. It remains visible on mobile too, but it's discoverable only from one page; the avatar menu is the always-available entry point.

### BUG-022  ·  P1  ·  /join page crashes when `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is missing — entire signup/signin unreachable  ·  Status: Fixed (verify)
**Title:** When the Google client ID env var is missing, the /join page throws "Google OAuth components must be used within GoogleOAuthProvider" at render and never recovers. No way to sign in via email/password either, even though that flow doesn't need Google.
**Found by:** Narveer · **Found date:** 2026-06-04 · **Test case:** _runtime regression — surfaced during Phase 1 mobile-responsiveness review_
**Repro steps:**
1. Delete or rename `dropyard_frontend/.env.local` (or simply leave `NEXT_PUBLIC_GOOGLE_CLIENT_ID` unset).
2. Restart `npm run dev`.
3. Visit `http://localhost:3000/join`.
**Expected:** Page renders normally. Google button hides or shows the "not configured" notice; email/password works.
**Actual (before fix):** Runtime error overlay: `useGoogleOAuth → useGoogleLogin → JoinPageContent`. Whole page is unreachable.
**Environment:** Local dev, Next.js 16.1.6 (Turbopack), `@react-oauth/google`. Same code path runs in prod — any prod deploy without `NEXT_PUBLIC_GOOGLE_CLIENT_ID` baked at build time would 500 the entire signup page.
**Impact:** P1 because: signup/signin is the primary entry to the app. A missing env var → entire flow dead. The page already has a conditional render for the Google button (when env empty, it shows an "add NEXT_PUBLIC_GOOGLE_CLIENT_ID" notice). That branch was never reachable because the hook above the JSX threw first.
**Fix commit:** _(local, dropyard_frontend/components/GoogleSignInButton.tsx + app/join/page.tsx)_
**Re-tested:** ⏳ Requires restoring or leaving `.env.local` blank. Typecheck clean.
**Notes:** Root cause was structural — `useGoogleLogin` was called unconditionally at the top of `JoinPageContent`, but `GoogleOAuthProviderWrapper` short-circuits to a no-provider render when `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is empty. Hook + no provider = throw. Extracted the Google button into `components/GoogleSignInButton.tsx`; the hook now only mounts when the gate at line 361 (`googleClientId ? ...`) is true. The "not configured" notice branch is now reachable. Side observation: `.env.local` was tracked-but-gitignored earlier this session; it went missing between then and now (likely lost during a `git checkout` / `git restore` somewhere). User needs to recreate it with `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.

### BUG-021  ·  P2  ·  Drop boundaries stored in UTC, not Ottawa-local — backend/frontend disagree by 4h  ·  Status: Fixed (verify)
**Title:** Backend phase math runs in UTC; frontend phase math runs in local browser time. They disagree by 4h (EDT) or 5h (EST) on when the drop actually opens and closes.
**Found by:** Narveer · **Found date:** 2026-06-03 · **Test case:** TC-B15.4 (timezone handling)
**Repro steps:**
1. `curl http://localhost:4000/api/drop/current` → observe `liveStart` ends with `08:00:00.000Z` (UTC)
2. Inspect `dropyard_backend/src/lib/dropCycle.ts:46-60` — `computeDropBoundaries` uses `setUTCHours(hours, 0, 0, 0)` with hours=8 for liveStart, 20 for closedStart.
3. Inspect `dropyard_frontend/lib/dropCycle.ts:42` — `getCurrentDropSaturday` uses `d.setHours(DROP_OPEN_HOUR, 0, 0, 0)` — local time.
**Expected:** Both sides interpret "Saturday 8 AM" identically as 8 AM Ottawa-local (America/Toronto).
**Actual:** Backend treats the boundaries as UTC. liveStart 08:00 UTC = 04:00 EDT / 03:00 EST. Real users in Ottawa get items 4-5 hours before the announced time.
**Environment:** Local dev. Same code path runs in prod.
**Impact:** P2 because: (a) the day-of-week math is correct so the phase is correct most of the week; (b) the 4-5h discrepancy only matters around the actual transitions. But on Saturday morning, the gap is highly visible — buyers see the drop "open" at 4 AM EDT while the UI says "opens 8 AM".
**Fix commit:** _(local, dropyard_backend/src/lib/dropCycle.ts + src/lib/dropSeeder.ts)_
**Re-tested:** ✅ liveStart now 12:00 UTC (= 8 AM EDT). closedStart now Mon 00:00 UTC (= Sun 8 PM EDT). weekOf now Sat 04:00 UTC (= Sat 00:00 EDT). Phase reporting unchanged (Wed → SUBMISSION).
**Notes:** Fix refactored backend `lib/dropCycle.ts` to use `Intl.DateTimeFormat({ timeZone: 'America/Toronto' })` for all wall-clock conversions. New `torontoToUtc()` helper tries EST (UTC-5) and EDT (UTC-4) offsets and picks whichever round-trips back to the input wall-clock — DST-aware, no library needed. `getDropWeekMonday` now uses Toronto's calendar week. `computeDropBoundaries` produces UTC instants that correspond to Toronto 00:00 / 08:00 / 20:00. `getWeekOfDate` returns Sat 00:00 Toronto. Data migration: `ensureCurrentDrop` got a transition clause (±48h window) so existing drops are updated in place. A one-shot `prisma/fix-bug-021.ts` was run to merge the duplicate that slipped through a hot-reload race — 17 items preserved on the canonical drop, empty sibling deleted, all 6 surviving drops re-stamped with the new boundaries. Script deleted after run. Frontend impact: none — already used local time via `setHours()`, which now agrees with the backend on "8 AM Saturday".



## P1 — Fixed this session

### BUG-020  ·  P2  ·  POST /api/items accepts isBundle=true with bundleCount=0  ·  Status: Fixed (verify)
**Title:** Server accepts an inconsistent bundle listing (isBundle true, bundleCount 0). Frontend then renders broken "Bundle of 0" pill.
**Found by:** Narveer · **Found date:** 2026-06-03 · **Test case:** TC-B12.12
**Repro steps:**
1. POST /api/items as a valid seller with `isBundle:true, bundleCount:0, bundleContents:["a"]` and an otherwise-valid payload
**Expected:** 400 with a bundle-consistency error.
**Actual (before fix):** 201 Created. Item persists with the bad invariant.
**Environment:** Local dev backend (ts-node-dev)
**Fix commit:** _(local, dropyard_backend/src/routes/items.ts createItemSchema)_
**Re-tested:** ✅ Confirmed 400 with "A bundle listing needs at least one item (bundleCount ≥ 1 and bundleContents non-empty)." post-fix.
**Notes:** Root cause — createItemSchema treated isBundle/bundleCount/bundleContents as independent optional fields. No cross-field invariant. Fix: added `.refine()` on the Zod schema requiring (when isBundle is true) bundleCount ≥ 1 AND bundleContents non-empty. Update path (updateItemSchema) deliberately NOT covered — partial PATCH would need merged-state validation against the existing item which is heavier. Flagged for later if Wave B uncovers an update-flow exploit. The stray test item that got created during repro was deleted via API.

**Sibling guard for BUG-019 fixed pre-emptively:** During the BUG-019 sweep, found `admin.ts:582` (`GET /api/admin/moving-sales`) had the same unguarded `?status=` cast. Added the same `Object.values(MovingSaleStatus).includes(status)` runtime guard so a bogus `?status=NOPE` returns 400 instead of crashing the dev server. All other enum-query handlers verified safe (admin user list, admin submissions list, claims status filter — all already use Set.has or Object.values.includes guards).

### BUG-019  ·  P1  ·  /api/items (invalid category query crashes backend)  ·  Status: Fixed (verify)
**Title:** GET /api/items?category=anything-bogus throws an unhandled PrismaClientValidationError that crashes the ts-node-dev process.
**Found by:** Narveer · **Found date:** 2026-06-03 · **Test case:** TC-B12.3 (invalid filter)
**Repro steps:**
1. `curl http://localhost:4000/api/items?category=NOPE`
**Expected:** 400 with "Invalid category" body OR 200 with empty results.
**Actual:** Server logs `PrismaClientValidationError: Invalid value for argument 'category'. Expected ItemCategory.` and the dev server terminates. Any subsequent request fails with connection refused until backend is restarted.
**Environment:** Local dev (ts-node-dev). Same crash would happen in prod (Express's default behavior on unhandled promise rejection is to terminate).
**Fix commit:** _(local, dropyard_backend/src/routes/items.ts)_
**Re-tested:** Pending backend restart + re-run TC-B12.3.
**Notes:** Root cause — items.ts:297 used `category as ItemCategory` which is a TypeScript compile-time cast, not a runtime check. The raw query string passed through to Prisma's where clause; Prisma rejected it; the async route had no try/catch, so the rejection propagated as an unhandled promise rejection that killed the Node process. Fix: (1) added `Object.values(ItemCategory).includes(category)` runtime guard — bad input now returns 400 "Invalid category"; (2) parseInt safety guard on page/limit; (3) wrapped the entire handler in try/catch so any future surprise throw returns 500 cleanly instead of crashing the server. Defense in depth — the guard handles the known case, the try/catch covers anything else.

**Same anti-pattern likely exists elsewhere.** Worth a sweep of other route handlers that accept enum strings from query params — claims status filter (`?status=`), admin users filter (`?role=`), admin submissions filter, etc. Each one should be guarded against bogus enum values. Will flag during Wave D testing.





## Recently closed

### BUG-018  ·  P2  ·  Sweep for remaining fake countdowns (homepage dead code, /for-buyers, dashboard item-detail strings)  ·  Status: Fixed (verify)
**Title:** After BUG-017, a sweep found three more fake countdowns across public + dashboard surfaces.
**Found by:** Narveer · **Found date:** 2026-06-03 · **Test case:** exploratory (BUG-017 follow-up)
**Repro steps:** Open /for-buyers — observe hero "Drop ends in 23:44:59" ticking down to 0 then looping to 23 again, disconnected from the real drop cycle.
**Expected:** All time-based UI matches the canonical drop cycle.
**Actual (before fix):**
1. `app/page.tsx:285` — `DropCountdown` function defined with fake `{hours: 23, minutes: 45, seconds: 32}` state that wraps at 47h. DEAD CODE — never imported or rendered anywhere.
2. `app/for-buyers/page.tsx:46` — fake countdown `{h: 23, m: 44, s: 59}` ticking down, displayed prominently in the hero with hardcoded "Drop ends in" label. Wraps to 23h instead of pointing at a real moment.
3. Active buyer + v2 + final dashboards' `DiscoverPage`: hardcoded `Saturday's Drop opens in <b>2d 14h</b>` body text in the Sneak Peek-related pill.
4. Active seller dashboard's `ManualItemForm`: `(2d 14h away)` hardcoded body text in the "When should this go live?" Calendar pill.
**Fixes:**
1. Deleted `DropCountdown` dead code (replaced with a one-line comment explaining the removal and pointing at DynamicDropCard as the live countdown source).
2. /for-buyers countdown now reads from `getDropCycleInfo(now)`. Phase-aware: LIVE phase → `dropCloseMoment(now)` with label "Drop ends in"; everything else → `nextDropMoment(now)` with label "Drop opens in". SSR-safe null-then-mount pattern.
3+4. Added a tiny SSR-safe `useDropOpenCountdownString()` hook to each of the 4 dashboard files (active buyer + v2 + final buyer + active seller). Returns the formatted compact countdown to next drop open. Used in `DiscoverPage` (buyer) and `ManualItemForm` (seller). Tick interval set to 60s since the compact format only changes at minute boundaries.
**Environment:** Chrome 131, 1280px
**Fix commit:** _(local, app/page.tsx + app/for-buyers/page.tsx + DropYard_BuyerDashboard*.jsx + DropYard_SellerDashboard.jsx)_
**Re-tested:** Pending.
**Notes:** Pattern across BUG-015, BUG-016, BUG-017, BUG-018 is the same anti-pattern: magic values embedded across surfaces instead of derived from `lib/dropCycle.ts`. Now that the helper API is rich (constants + format helpers + nextDropMoment/dropCloseMoment/formatCompactCountdown), any future countdown should reach for those instead of hand-rolling.

### BUG-017  ·  P1  ·  /buyer (countdown disagrees with seller; was hardcoded demo data)  ·  Status: Fixed (verify)
**Title:** Buyer dashboard "Drop opens in" countdown shows different time than seller's "Saturday 8 a.m. 2d 23h" countdown — they targeted the same moment but differed by ~9 hours.
**Found by:** Narveer · **Found date:** 2026-06-03 · **Test case:** exploratory (BUG-016 follow-up)
**Repro steps:**
1. Open /buyer Discover tab in "between drops" state — banner says "Drop opens in 2d 14h 23m 40s"
2. Switch to seller mode → Overview tab — hero says "Next Drop · Saturday 8 a.m. (2d 23h)"
3. Compare the two — should match (same target = next Saturday 8 AM)
**Expected:** Both countdowns within a few seconds of each other.
**Actual:** Buyer ~2d 14h, seller ~2d 23h — 9 hour gap that never converges.
**Environment:** Chrome 131, 1280px
**Fix commit:** _(local, components/previews/DropYard_BuyerDashboard.jsx + _v2 + _final)_
**Re-tested:** Pending.
**Notes:** Root cause — the buyer dashboard's AnticipationBand component (line 627) had a HARDCODED demo countdown: `useState({ d: 2, h: 14, m: 23, s: 47 })` that started at "2d 14h 23m 47s" and just ticked down from there, completely disconnected from the real drop cycle. Same fake pattern in WelcomeBand (h:m:s starting at 19:49:32 for the LIVE-drop "ends in" timer). Originally written as design-demo placeholders ("// Demo starts at 2d 14h 23m 47s") and never wired up. Fix: replaced both with real countdowns derived from `nextDropMoment(now)` / `dropCloseMoment(now)` with the same SSR-safe pattern as DynamicDropCard (null-on-first-render so server + client first render produce identical zeros, then useEffect seeds + ticks per second). Applied identically to v2 + final preview files (4 fake countdowns total across 3 files, all fixed).

### BUG-016  ·  P1  ·  /buyer (drop time inconsistency: 10am vs 8am)  ·  Status: Fixed (verify)
**Title:** Buyer dashboard says "Drop opens Saturday 10 AM" while seller dashboard, FAQ, lib/dropCycle.ts, and DB schema all say Saturday 8 AM. Users see contradictory drop times.
**Found by:** Narveer · **Found date:** 2026-06-03 · **Test case:** exploratory
**Repro steps:**
1. Sign in. View /buyer Discover page → "The next Drop lands Saturday at 10 AM"
2. Switch to seller mode → "Next Drop · Saturday 8 a.m."
3. Same user, same product, two different drop times.
**Expected:** All surfaces show Saturday 8 AM (canonical per dropCycle.ts and schema.prisma Drop.liveStart).
**Actual:** Buyer dashboard hardcoded 10 AM in 12+ places + a logic bug at line 312 (`hour >= 10` to determine "live" state should be `>= 8`).
**Environment:** Chrome 131, 1280px
**Fix commit:** _(local, components/previews/DropYard_BuyerDashboard.jsx)_
**Re-tested:** Pending.
**Notes:** Root cause — buyer dashboard was authored before team finalized Saturday 8 AM. Magic numbers ("10 AM" / "10AM" strings + the `hour >= 10` comparison in computeDropState) never got updated. Fix: (1) computeDropState line 312 changed from `hour >= 10` to `hour >= 8` with a comment pointing at the canonical source files so future drift is caught; (2) global string replace "10 AM" → "8 AM" and "10AM" → "8AM" inside DropYard_BuyerDashboard.jsx covering badges, banners, item card pills, notification copy, sneak-peek body text, etc. Legitimate pickup-time conversation samples ("Saturday morning, 10am?" lowercase) deliberately left alone — those are buyer/seller pickup negotiations, not drop times.

**Expanded coverage (2026-06-03 follow-up):** Same hardcoded-10am pattern also fixed in DropYard_BuyerDashboard_v2.jsx, DropYard_BuyerDashboard_final.jsx, and DropYard_SellerDashboard.jsx (which had 3 stray "Saturday 10 am" strings the user hadn't noticed yet because they appear in less-visible UI sections — `Next Drop: Saturday 10 am` Calendar pill, `Goes live Saturday at 10 am` description, `Next Drop is Saturday 10 am.` settings hint). Also fixed a stale comment at DropYard_BuyerDashboard.jsx:305 ("Live from Saturday 10:00 AM..."). All pickup-time references ("Saturday 10:00 AM" in pickup slot arrays, "Saturday 10am works" in conversation demos) deliberately left alone — those are flexible pickup negotiations, not drop times.

### BUG-015  ·  P2  ·  / (homepage DynamicDropCard hydration mismatch)  ·  Status: Fixed (verify)
**Title:** Hydration error on homepage — countdown seconds digit differs between server-rendered HTML and client first render.
**Found by:** Narveer · **Found date:** 2026-06-03 · **Test case:** exploratory
**Repro steps:**
1. Open / (homepage) in fresh browser
2. Observe DevTools console
**Expected:** No hydration warnings.
**Actual:** "Hydration failed because the server rendered text didn't match the client." — value 53 on client vs 54 on server in CountdownUnit (seconds).
**Environment:** Chrome 131, 1280px
**Fix commit:** _(local, components/previews/DynamicDropCard.jsx)_
**Re-tested:** Pending.
**Notes:** Root cause — `useState(() => new Date())` initializer ran during SSR (server time) AND during initial client hydration (client time, ~1s later). The seconds digit always loses this race because the gap between SSR and hydration is non-zero. Fix: initialize `now` to null so SSR and first client render produce identical markup (all zeros via formatDuration(0)); set `now = new Date()` inside useEffect to seed the real value immediately after mount, then tick every second from there. Sub-frame flicker of 0d 0h 0m 0s before the real countdown appears — visually imperceptible. Downstream computed values (dropInfo, isLive, remaining, time) all guarded against null `now`. Pattern applies to any time-based component that SSRs.

### BUG-014  ·  P2  ·  /verify-email → /buyer (stale banner)  ·  Status: Fixed (verify)
**Title:** After clicking "Continue to DropYard" from the verify-email success page, the "Please verify your email" banner stays visible on /buyer until manual refresh.
**Found by:** Narveer · **Found date:** 2026-06-03 · **Test case:** exploratory
**Repro steps:**
1. Sign up; receive verification email
2. Click the verify link → lands on /verify-email which shows success
3. Click "Continue to DropYard" → arrives at /buyer
4. Observe the banner still rendering
5. Refresh manually → banner disappears
**Expected:** Banner gone the moment the user lands on /buyer post-verification.
**Actual:** Banner renders until manual refresh re-mounts AuthContext.
**Environment:** Chrome 131, 1280px
**Fix commit:** _(local, app/verify-email/page.tsx)_
**Re-tested:** Pending.
**Notes:** Root cause — verify-email page called POST /api/auth/verify-email (server updates user.verifiedAt) but never refreshed the cached AuthContext user. EmailVerifyBanner read stale verifiedAt=null and rendered. Fix: call refreshUser() from AuthContext after the API succeeds, before transitioning to the success state. By the time the user clicks "Continue", AuthContext has the updated user object and the banner self-hides. No-op if user isn't signed in (e.g. clicked link in incognito), so safe either way.

### BUG-013  ·  P2  ·  /api/auth/signin (timing-attack enumeration)  ·  Status: Fixed (verify)
**Title:** Signin response time differed measurably between valid-email-wrong-password (~150-300ms, bcrypt runs) and unknown-email (~10ms, bcrypt skipped). Attacker could enumerate valid emails over many timed requests.
**Found by:** Narveer · **Found date:** 2026-06-03 · **Test case:** TC-A6 cross-cutting check 7
**Repro steps:**
1. Send N signin requests with `{ email: known-valid@example.com, password: WrongPass1 }` and measure response time
2. Send N signin requests with `{ email: never-registered@example.com, password: Anything1 }` and measure response time
3. Compare medians
**Expected:** Times are comparable (within ~30ms).
**Actual (before fix):** Code at `dropyard_backend/src/routes/auth.ts:188-203` confirmed `prisma.user.findUnique` returned 401 immediately when no user matched; `bcrypt.compare` only ran when user existed. Difference in execution path → measurable timing difference.
**Environment:** Local dev, prod code identical.
**Fix commit:** _(local, dropyard_backend/src/routes/auth.ts)_
**Re-tested:** Pending empirical retest after backend restart clears rate limiter.
**Notes:** Root cause — auth path took shortcut when user didn't exist. Fix: added module-level `TIMING_EQUALIZATION_HASH = bcrypt.hashSync('not-a-real-password-just-for-timing', 12)` computed once at startup (~150ms one-time cost). signin handler now always runs `bcrypt.compare(password, user?.passwordHash ?? TIMING_EQUALIZATION_HASH)` before branching on the result. All three failure cases (no user, Google-only user, wrong password) now take ~the same wall time. Existing error messages preserved — including the "This account uses Google sign-in" message, which is a separate concern (enumeration via error-text rather than timing). Open for future tightening if needed.

### BUG-012  ·  P3  ·  /buyer secondary tabs (PageTitle vertical spacing)  ·  Status: Fixed (verify)
**Title:** Too much vertical space above the title on Saved/Claims/Messages/History — title sits ~70px below the top header, looks floaty.
**Found by:** Narveer · **Found date:** 2026-06-03 · **Test case:** exploratory (follow-up to BUG-011)
**Repro steps:**
1. On /buyer, click any non-Discover tab (Saved/Claims/Messages/History).
2. Observe vertical gap between top header and "Back to Discover" button + title.
**Expected:** Title sits close under the top header.
**Actual:** ~70px of dead space (container padding 36px top + back-button margin 16px + container marginBottom 20px when stacking effects).
**Environment:** Chrome 131, 1280px and 360px
**Fix commit:** _(local, dropyard_frontend/components/previews/DropYard_BuyerDashboard.jsx)_
**Re-tested:** Pending.
**Notes:** Root cause — `PageTitle` had top padding 36px (desktop) / 16px (mobile), container marginBottom 20px/12px, and the new back button added its own marginBottom 16px/12px. All three stacked. Original generous padding was tuned for tabs without a back button — adding the back button compounded the spacing. Fix: trimmed container padding to 4px/0 top, 16px/8px bottom; marginBottom to 12px/8px; back-button marginBottom to 10px/8px; adjusted decorative dots `top` from 38 to 8 to track the new title position. Net savings: ~58px desktop, ~32px mobile.

### BUG-011  ·  P2  ·  /buyer Saved/Claims/Messages/History tabs (no back button)  ·  Status: Fixed (verify)
**Title:** No back button on the four secondary buyer tabs (Saved, Claims, Messages, History) — once a user navigates into one, the only way back to Discover is via the sidebar (which collapses on mobile) or by clicking the Discover sidebar item again.
**Found by:** Narveer · **Found date:** 2026-06-03 · **Test case:** exploratory
**Repro steps:**
1. As Sarah, sign in. Land on Discover.
2. Click Saved (or Claims / Messages / History) in the sidebar.
3. Look for a way back to Discover.
**Expected:** A back button at the top of the page that returns to Discover.
**Actual:** No back button. Only the sidebar (hidden on mobile) or the tab item itself can be clicked.
**Environment:** Chrome 131, 1280px and 360px
**Fix commit:** _(local, dropyard_frontend/components/previews/DropYard_BuyerDashboard.jsx)_
**Re-tested:** Pending.
**Notes:** Root cause — the shared `PageTitle` component used by all four tabs had no back-navigation slot. The detail views (ItemDetail, PreviewItemDetail, SneakPeekListPage, RegularSellerProfile) all had their own inline "Back" pill button, but that pattern wasn't centralized. Tabs were originally treated as top-level destinations reached only via the sidebar — assumption breaks on mobile and conceptually for "done browsing, take me back". Fix: added optional `onBack` prop to `PageTitle` that renders a back-pill button reusing the exact same styling as the existing detail-view pattern (ArrowLeft + "Back to Discover"). Threaded the prop through `SavedPage`, `ClaimsPage`, `MessagesPage`, `HistoryPage` signatures, and wired all four call sites in `DropYardBuyerDashboard` to `() => setPage("discover")`. Button says "Back to Discover" (not just "Back") because tab pages have no contextual "back" — being explicit about the destination is clearer UX. Existing detail-view "Back" buttons unchanged for consistency within their context (they go back to whatever tab the user came from, not a fixed destination).

**Not yet applied to:** Seller dashboard's Saved/Claims/etc tabs likely have the same gap (same PageTitle pattern, separate file `DropYard_SellerDashboard.jsx`). Flag for Wave B testing.

### BUG-010  ·  P2  ·  /api/moving-sale + /api/submissions (case-sensitive email)  ·  Status: Fixed (verify)
**Title:** Email fields on moving-sale registration and contact-form submissions stored with original case; mixed-case admin search would miss them despite Prisma's case-insensitive search mode.
**Found by:** Narveer · **Found date:** 2026-06-03 · **Test case:** exploratory (flagged in BUG-006 notes)
**Repro steps:**
1. As a seller, submit a Moving Sale registration with contact email `Seller@Example.com`.
2. In admin Submissions view, search for `seller@example.com`.
3. Match works (Prisma `mode: 'insensitive'` saves it), but the stored email is still mixed-case.
**Expected:** Email stored in canonical lowercase form for consistency with User table.
**Actual:** Email stored as user-typed; only the admin search query had case-insensitive matching as a safety net.
**Environment:** Backend prisma seeded local DB
**Fix commit:** _(local, dropyard_backend/src/lib/validation.ts + src/routes/movingSale.ts + src/routes/submissions.ts + src/routes/auth.ts)_
**Re-tested:** Pending.
**Notes:** Root cause — `emailField` Zod helper was defined inline in auth.ts and not exported, so other route files re-rolled their own `z.string().email()` without the normalization transform. submissions.ts had no Zod schema at all — pulled email straight from raw payload via `pickString`. Fix: extracted `emailField`, `passwordPolicy`, and a new `normalizeEmail()` helper to `src/lib/validation.ts`. auth.ts refactored to import (DRY). movingSale.ts uses `emailField`. submissions.ts wraps the raw extracted email in `normalizeEmail()`. Existing rows with mixed-case emails in moving_sale / submission tables aren't auto-fixed — if admin filtering by exact match becomes important, run `UPDATE "moving_sales" SET email = LOWER(email)` and same for submissions.

**Not in scope:** admin user search (admin.ts:119 + admin.ts:363) was already using Prisma `mode: 'insensitive'` — case-insensitive at query time. No fix needed.

### BUG-009  ·  P3  ·  /admin/login (back-button + non-admin signed-in user)  ·  Status: Fixed (verify)
**Title:** /admin/login's authenticated-user guard only handled ADMIN role; a signed-in BUYER or SELLER pressing back from /buyer to /admin/login saw the admin signin form.
**Found by:** Narveer · **Found date:** 2026-06-03 · **Test case:** exploratory (flagged in BUG-008 notes)
**Repro steps:**
1. Sign in as a BUYER (Sarah Demo).
2. Manually navigate to /admin/login while signed in.
3. **Expected:** redirect to /buyer.
4. **Actual:** admin signin form rendered.
**Environment:** Chrome 131, 1280px
**Fix commit:** _(local, dropyard_frontend/app/admin/login/page.tsx)_
**Re-tested:** Pending.
**Notes:** Root cause — guard checked `user.role === "ADMIN"`; when a non-admin user was authenticated, the guard skipped, leaving the form visible. Fix: widened to redirect ANY authenticated user — admins to /admin, everyone else to /buyer. Mirrors the pattern applied to /join in BUG-008. router.replace was already in use, so no history-stacking issue at /admin/login.

### BUG-008  ·  P2  ·  /join (back-button while authenticated)  ·  Status: Fixed (verify)
**Title:** Browser back button from /buyer (or /admin) lands on /join while user is still signed in; auth form renders for an authenticated user.
**Found by:** Narveer · **Found date:** 2026-06-03 · **Test case:** exploratory
**Repro steps:**
1. Sign in at /join. Land on /buyer.
2. Press browser back button.
3. Observe destination — /join with the auth form visible.
**Expected:** Either the back button skips past /join entirely OR /join redirects authenticated users away.
**Actual:** /join renders the signin form for an already-signed-in user.
**Environment:** Chrome 131, 1280px
**Fix commit:** _(local, app/join/page.tsx + app/forgot-password/page.tsx)_
**Re-tested:** Pending.
**Notes:** Two root causes — (1) /join had no symmetric authenticated-user guard mirroring BuyerDashboardContent's unauthenticated-user guard; (2) handleSubmit and Google onSuccess used router.push("/buyer") instead of router.replace, so /join stayed in history and the back stack pointed at it. Fix: added useEffect that calls router.replace to /buyer or /admin when (!loading && user) on /join AND /forgot-password; switched both router.push calls in /join to router.replace so the auth page is swapped (not stacked) on successful signin. Both halves contribute — without the guard, deep-linking to /join while signed in is still broken; without the replace, the back stack still has /join even after signin.

**Possible same issue elsewhere — not fixed in this pass:** /admin/login likely has the same router.push + no-guard pattern. Flag for TC-A4 testing; if confirmed, same fix applies.

### BUG-007  ·  P3  ·  /join (Remember Me)  ·  Status: Fixed (verify)
**Title:** "Remember me" checkbox on signin was wired to React state but nothing read the value; refresh token TTL was identical whether checked or not.
**Found by:** Narveer · **Found date:** 2026-06-03 · **Test case:** TC-A9 (added during forgot-password work)
**Repro steps:**
1. Sign in with Remember me UNCHECKED. Decode dy_refresh_token at jwt.io.
2. Sign in with Remember me CHECKED. Decode dy_refresh_token.
3. Compare expiry claims.
**Expected:** Checked → meaningfully longer TTL (industry norm 30 days). Unchecked → shorter (1 day).
**Actual:** Both produced identical 7-day TTLs (the default JWT_REFRESH_EXPIRES_IN). The checkbox was UI theatre.
**Environment:** Chrome 131, 1280px
**Fix commit:** _(local, dropyard_backend/src/lib/jwt.ts + src/routes/auth.ts + dropyard_frontend/context/AuthContext.tsx + app/join/page.tsx)_
**Re-tested:** Pending TC-A9.
**Notes:** Root cause — the checkbox had a `useState` binding but no consumer; AuthContext.signin took only (email, password); the backend signin schema didn't accept rememberMe. Pure scaffolding-without-implementation. Fix: signinSchema now accepts optional rememberMe; signin route passes { expiresIn: rememberMe ? '30d' : '1d' } to signRefreshToken; signRefreshToken now accepts the override; AuthContext.signin signature widened to (email, password, rememberMe?); /join page passes rememberMe state through. Defaults preserved — callers without rememberMe behave as if unchecked, i.e. 1d refresh.

### BUG-006  ·  P1  ·  /join signup + signin (case-insensitive email)  ·  Status: Fixed (verify)
**Title:** Same email with different capitalization (`User@x.com` vs `user@x.com`) creates two separate accounts; signin with a different casing than signup fails.
**Found by:** Narveer · **Found date:** 2026-06-03 · **Test case:** TC-A1 step 17
**Repro steps:**
1. Sign up at /join with email `User@x.com`
2. Sign out
3. Try to sign in with `user@x.com` (same password)
**Expected:** Same account, signin succeeds. Subsequent signup with `user@x.com` is rejected as duplicate.
**Actual:** Signin returns "Invalid email or password". A second signup with `user@x.com` creates a second User row.
**Environment:** Chrome 131, 1280px, local DB
**Fix commit:** _(local, dropyard_backend/src/routes/auth.ts + dropyard_frontend/app/join/page.tsx)_
**Re-tested:** Pending.
**Notes:** Root cause — Postgres unique constraint on `email String @unique` is case-sensitive by default. Signup and signin paths read email as-is from request body, never normalize. Google auth was already lowercasing (lib/googleAuth.ts:74,111) — created an asymmetry where one user could have separate Google + password accounts for the same logical email. Fix: extracted `emailField = z.string().email().transform(v => v.trim().toLowerCase())` in auth.ts, applied to signupSchema + signinSchema so every path that uses these schemas normalizes consistently. Client `app/join/page.tsx` handleSubmit also normalizes (trim + lowercase) before send so the value sent matches what server stores. Defense-in-depth — neither side relies on the other.

**Data migration required:** any existing User rows in the DB with mixed-case emails won't be auto-fixed by the code change. Run `SELECT id, email FROM "User" WHERE email != LOWER(email);` to find them. If duplicates exist (e.g. both `User@x.com` AND `user@x.com`), pick one to keep and delete the other manually. Then `UPDATE "User" SET email = LOWER(email) WHERE email != LOWER(email);` to normalize the rest. For the test row Narveer created during TC-A1, easiest is to delete it via Prisma Studio.

### BUG-005  ·  P1  ·  /join signup + signin  ·  Status: Fixed (verify)
**Title:** Invalid email format ("not-an-email", "user@", "a@b.c") not blocked client-side; error surfaces only as generic server banner.
**Found by:** Narveer · **Found date:** 2026-06-03 · **Test case:** TC-A1 step 12
**Repro steps:**
1. Open /join → Sign up tab
2. Enter "not-an-email" in the email field, fill other fields, click Sign Up
**Expected:** Browser email-input validation OR a clear server error (per TC).
**Actual:** Form submits without client-side block; server returns generic "Invalid email address" banner without field highlighting.
**Environment:** Chrome 131, 1280px
**Fix commit:** _(local, app/join/page.tsx)_
**Re-tested:** Pending.
**Notes:** Root cause — email input had `type="email"` but no `required`, no inline check in handleSubmit. Server zod did reject but UX felt unclear. Fix: added `required` + `autoComplete="email"`, added inline pre-submit check with regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, trimmed email before submit. Browser will now block obvious malformed input before the request leaves the page.

### BUG-004  ·  P1  ·  /join signup + auth backend  ·  Status: Fixed (verify)
**Title:** Weak passwords accepted at signup ("12345678" all digits passed; "12345" rejected only by generic server message).
**Found by:** Narveer · **Found date:** 2026-06-03 · **Test case:** TC-A1 step 11
**Repro steps:**
1. Open /join → Sign up
2. Enter password "12345678" (8 digits, no letter)
3. Submit
**Expected:** Client-side validation blocks with "must include letter and number" or similar.
**Actual:** Account created successfully — server only enforced min 8 chars, no complexity.
**Environment:** Chrome 131, 1280px
**Fix commit:** _(local, app/join/page.tsx + dropyard_backend/src/routes/auth.ts)_
**Re-tested:** Pending.
**Notes:** Two root causes — (1) frontend had zero client-side validation: password input had no `required`, no `minLength`, no inline check; (2) backend zod schema only enforced `min(8)` — no complexity. Fix: client now does inline length + letter + number check with specific error messages; input has `required` + `minLength={8}` for signup + `autoComplete="new-password"`; signin path keeps the looser non-empty check so existing accounts can still sign in. Backend: extracted `passwordPolicy = z.string().min(8).regex(/[a-zA-Z]/).regex(/\d/)` and applied to signupSchema, setPasswordSchema, changePasswordSchema (defense in depth). Signin schema unchanged so existing accounts aren't locked out.

### BUG-003  ·  P1  ·  /buyer & /admin (logout)  ·  Status: Fixed (verify)
**Title:** Logout doesn't reliably redirect to /join; sometimes lands on /join?mode=signin or appears to do nothing.
**Found by:** Narveer · **Found date:** 2026-06-03 · **Test case:** TC-A2 step 6 (Sign out)
**Repro steps:**
1. Sign in as Sarah at /join
2. From /buyer, click avatar menu → Sign out
3. Observe destination URL
**Expected:** Browser lands on /join cleanly.
**Actual:** Either no visible navigation (await blocks on /api/auth/signout), or lands on /join?mode=signin (BuyerDashboardContent auth guard races with AuthContext signout's hard nav).
**Environment:** Chrome 131, 1280px, demo accounts
**Fix commit:** _(local, AuthContext.tsx + app/buyer/page.tsx)_
**Re-tested:** Pending.
**Notes:** Two root causes — (1) AuthContext.signout awaits the API call before navigating, so slow/dead backend blocks the hard nav; (2) BuyerDashboardContent.useEffect did router.replace("/join?mode=signin") while signout did window.location.href = '/join'. Race condition. Fix: removed the await (fire-and-forget the backend invalidation); aligned both targets to bare '/join'.

### BUG-002  ·  P1  ·  /join signup  ·  Status: Fixed (verify)
**Title:** Signup completes without checking the Terms of Service checkbox.
**Found by:** Narveer · **Found date:** 2026-06-03 · **Test case:** TC-A1 (exploratory addition)
**Repro steps:**
1. Open /join, switch to Sign up
2. Fill name/email/password but leave the "I agree to..." checkbox unchecked
3. Click Sign Up
**Expected:** Form blocks, error appears, no account created.
**Actual:** Account is created; user is signed in and redirected to /buyer.
**Environment:** Chrome 131, 1280px
**Fix commit:** _(local, app/join/page.tsx)_
**Re-tested:** Pending.
**Notes:** Root cause — checkbox had no useState binding, no required attribute, and handleSubmit didn't check it. UI implied a contract that the code didn't enforce. Fix: added agreedToTerms state, wired checkbox, added required attribute, guard in handleSubmit, and disabled the submit button until checked.

### BUG-001  ·  P2  ·  /join signup  ·  Status: Fixed (verify)
**Title:** "Terms of Service" and "Privacy Policy" text in signup checkbox label is not clickable / not linked.
**Found by:** Narveer · **Found date:** 2026-06-03 · **Test case:** TC-A1 step 6 (exploratory addition)
**Repro steps:**
1. Open /join → Sign up tab
2. Click on "Terms of Service" or "Privacy Policy" text in the checkbox label
**Expected:** Opens the respective policy page in a new tab.
**Actual:** Nothing happens (just toggles the checkbox via parent <label>).
**Environment:** Chrome 131, 1280px
**Fix commit:** _(local, app/join/page.tsx)_
**Re-tested:** Pending.
**Notes:** Root cause — `<span>` elements styled to look like links (emerald color, cursor-pointer) but no href / onClick / Link wrapper. Placeholder visual styling from the initial design pass never got wired. Fix: replaced spans with Next.js `<Link>` to /community-guidelines (per product decision for TOS) and /privacy-policy, both opening in a new tab with rel="noopener noreferrer".

---

## Template (copy this row for every new bug)

```
### BUG-NNN  ·  [Severity P0/P1/P2/P3]  ·  Page/Surface  ·  Status: Open
**Title:** One-line summary.
**Found by:** Name · **Found date:** YYYY-MM-DD · **Test case:** TC-XX or "exploratory"
**Repro steps:**
1. ...
2. ...
3. ...
**Expected:** What should happen.
**Actual:** What does happen (with console errors / screenshots if relevant).
**Environment:** Browser + version, viewport size, account email.
**Fix commit:** _(filled when status moves to Fixed)_
**Re-tested:** _(filled when status moves to Closed)_
**Notes:** Root cause once known.
```

## Example (delete after first real bug is logged)

```
### BUG-000  ·  P2  ·  /buyer Overview (seller mode)  ·  Status: Closed
**Title:** Shelf count includes SOLD items after pickup.
**Found by:** Narveer · **Found date:** 2026-06-01 · **Test case:** exploratory
**Repro steps:**
1. Log in as Avery Demo
2. Confirm a buyer claim, then mark pickup complete
3. Return to Overview tab
**Expected:** Shelf count decrements by 1.
**Actual:** Shelf count unchanged; sold item still appears in My Items > On the Shelf.
**Environment:** Chrome 131, 1440px, demo-seller@dropyard.local
**Fix commit:** _(local on May29DropF, see [[uncommitted-snapshot-2026-06-01]])_
**Re-tested:** Pending Wave B execution.
**Notes:** Root cause — adaptItem in DropYard_SellerDashboard.jsx mapped any non-DRAFT item to a "published" lifecycle, including SOLD. Filter rewritten to require status === "LIVE". Same filter bug also broke Overview hero counts and ShareSheet.
```
