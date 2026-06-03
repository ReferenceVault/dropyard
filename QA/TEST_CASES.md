# DropYard Test Cases

**Step-by-step scripts for every row in [QA_MATRIX.md](./QA_MATRIX.md).** Each test case is self-contained — a tester unfamiliar with the codebase should be able to follow it without asking questions.

## Demo accounts (shared password: `Demo@1234`)

- **Seller:** `demo-seller@dropyard.local` (Avery Demo)
- **Buyers:** `sarah.demo@dropyard.local`, `james.demo@dropyard.local`, `priya.demo@dropyard.local`, `tom.demo@dropyard.local`, `david.demo@dropyard.local`, `hassan.demo@dropyard.local`, `lindsay.demo@dropyard.local`
- **Admin:** `info@asvntech.com` / `Apple@1234`

If the demo accounts don't exist on the environment under test, run `npx tsx prisma/seedDemo.ts` from `dropyard_backend/` to seed.

## Conventions

- "Open" = navigate via URL bar (no clicks). "Click" = mouse click. Use `Tab`/`Enter`/`Esc` explicitly for keyboard.
- "Expect" = pass criterion. If any "Expect" line fails → log a bug in [BUG_LOG.md](./BUG_LOG.md) and mark the column ❌.
- **Edge cases and security checks are mandatory** — not bonus. Most production bugs hide there.
- Test every TC on **two viewports**: desktop (1280px) and mobile (360px). Note layout differences.
- Use Chrome by default; switch browsers only in TC-F5.
- DevTools open at all times — watch Console for red errors and Network for failed requests.

## Drop cycle reference

DropYard has a weekly cycle:

| Phase | Days | What's happening |
|---|---|---|
| **SUBMISSION** | Mon-Wed | Sellers can register a Moving Sale Drop |
| **PREVIEW** | Thu-Fri | Items visible but not yet claimable |
| **LIVE** | Sat 8am - Sun 8pm | Buyers can claim items |
| **CLOSED** | Sun 8pm - Mon 8am | Drop wrapped, pickups happen |

Many test cases depend on the current phase. If you need a specific phase to test, use the "Dev: Simulate Phase" dropdown (if present) or seed with a forced phase.

## Navigation guide

- [Wave A — Foundation](#wave-a--foundation) (TC-A1 to TC-A6)
- [Wave B — Seller core](#wave-b--seller-core) (TC-B1 to TC-B15)
- [Wave C — Buyer core](#wave-c--buyer-core) (TC-C1 to TC-C13)
- [Wave D — Admin](#wave-d--admin) (TC-D1 to TC-D8)
- [Wave E — Public / marketing / legal](#wave-e--public--marketing--legal) (TC-E1 to TC-E13)
- [Wave F — Cross-cutting](#wave-f--cross-cutting) (TC-F1 to TC-F10)
- [Running guide](#running-guide)

---

# Wave A — Foundation

These four tests gate every later wave. If A1 fails, do not begin Wave B.

---

## TC-A1 · New-user signup via `/join`

**Prerequisite:** Fresh incognito window, no cookies.

### Golden path

1. Open `/join`.
2. Confirm the page loads under 2 seconds (Slow 3G).
3. Click "Sign up" tab if not already selected.
4. Enter:
   - Email: `qa-test-{timestamp}@example.com` (unique each run)
   - Password: `Test@1234`
   - First name: `QA`
   - Last name: `Tester`
5. Click Submit.
6. **Expect:** Redirected to onboarding flow OR directly to `/buyer`.
7. **Expect:** DevTools → Application → Local Storage → both `dy_access_token` and `dy_refresh_token` are present and non-empty.
8. **Expect:** The signup email is in the database as ACTIVE user (verify via admin panel or `prisma studio`).
9. Refresh the page. **Expect:** still logged in (refresh token works).

### Edge cases

10. **Duplicate email:** Sign out. Go back to `/join` signup. Use the same email. **Expect:** specific error like "Account already exists" — NOT a generic 500. No new user row created.
11. **Weak password:** Try `12345`. **Expect:** client-side validation blocks submission with specific message ("must include letter and number" etc).
12. **Invalid email format:** Try `not-an-email`. **Expect:** browser email-input validation OR clear server error.
13. **Empty fields:** Submit with any required field empty. **Expect:** field-level error highlighting.
14. **Rate limit:** Hit signup endpoint via `curl` 10 times in quick succession with different emails. **Expect:** after N requests, returns 429 with `Retry-After` header.

### Security checks

15. Inspect Network tab on submit. **Expect:** `passwordHash` and `password` never appear in any response body.
16. Confirm response sets no cookies with `Set-Cookie` (we use localStorage tokens, not cookies — if cookies appear, flag for review).
17. Try sending the same email with different capitalisation (`User@x.com` vs `user@x.com`). **Expect:** treated as the same account (case-insensitive) — no duplicate user.

---

## TC-A2 · Existing-user login via `/join`

**Prerequisite:** Demo seed has been run. Open fresh incognito.

### Golden path

1. Open `/join`. Switch to "Sign in" tab.
2. Enter Sarah's creds: `sarah.demo@dropyard.local` / `Demo@1234`.
3. Submit.
4. **Expect:** Redirect to `/buyer`. Page loads in buyer mode (Discover tab visible).
5. Click the avatar menu top-right. **Expect:** "Sarah M." name visible.
6. Click "Sign out". **Expect:** redirect to `/` or `/join`. Both `dy_access_token` and `dy_refresh_token` cleared from localStorage.

### Edge cases

7. **Wrong password:** Sign in with Sarah's email + `WrongPass1`. **Expect:** specific error "invalid credentials" but NOT a message that distinguishes "user not found" from "wrong password" (no email enumeration).
8. **Unknown email:** Try `nope@nope.com` / `Anything1`. **Expect:** same generic error as #7.
9. **Rate limit:** Submit wrong password 6 times in a row. **Expect:** 429 / lockout message before 6th attempt succeeds.
10. **Trailing whitespace:** Try `sarah.demo@dropyard.local ` (trailing space). **Expect:** still works (server trims) OR specific format error — NOT silent failure.
11. **Logged-in user visits `/join`:** If already signed in, navigate to `/join` directly. **Expect:** redirect to `/buyer` OR show signed-in state — not a duplicate login form that creates conflict.

### Security checks

12. After sign out, click browser back button. **Expect:** authenticated pages no longer accessible — should redirect to `/join` or show a logged-out state.
13. Try replaying the last `/api/auth/login` request via DevTools after sign-out. **Expect:** works (it's just login again) — but the OLD access token from the prior session is rejected (`401`).

---

## TC-A3 · Google sign-in via `/join`

**Prerequisite:** Test Google account available. Fresh incognito.

### Golden path

1. Open `/join`. Click "Continue with Google".
2. **Expect:** Google OAuth popup or redirect appears.
3. Approve with a Google account whose email is NOT yet a DropYard user.
4. **Expect:** redirect back to `/buyer`. Tokens in localStorage.
5. Open DB / admin panel. **Expect:** new User row with this Google email, `passwordHash = null`.

### Edge cases

6. **Cancel OAuth:** Click "Continue with Google", then cancel the Google popup. **Expect:** returned to `/join` cleanly. No orphan partial-user row created.
7. **Existing email, Google sign-in:** Use a Google account whose email matches an existing password-based DropYard user. **Expect:** either (a) merged into the same account, OR (b) clear error "this email is registered with password, please sign in with password". Decide which behaviour is intended and document. Whichever it is, must NOT silently create a duplicate user.
8. **Set password later:** After Google sign-up, go to Settings → Set Password. **Expect:** can set a password; subsequent login works with either Google OR password.
9. **Revoked Google access:** In Google account settings, revoke DropYard. Then try Google sign-in again. **Expect:** still works (fresh OAuth grant).

### Security checks

10. Inspect token returned. **Expect:** the access token is a JWT signed by your server, NOT the raw Google ID token (which would let any Google-sign-in user impersonate by replaying).

---

## TC-A4 · Admin login via `/admin/login`

### Golden path

1. Open `/admin/login` in fresh incognito.
2. Enter admin creds: `info@asvntech.com` / `Apple@1234`.
3. Submit. **Expect:** redirect to `/admin`.
4. Confirm `/admin` loads with admin dashboard UI (not user dashboard).

### Edge cases

5. **Non-admin user creds:** Try Sarah's creds at `/admin/login`. **Expect:** rejected with 403 / "not authorized" — NOT silently logged in as non-admin.
6. **Wrong password 5 times:** **Expect:** rate limit kicks in (`authAttemptLimiter`).
7. **Token expiry:** Sign in. Wait 16+ minutes. Try any admin action. **Expect:** refresh succeeds transparently OR redirect to `/admin/login`. Should NOT hang or 500.
8. **Direct nav to `/admin` without auth:** Open incognito. Navigate directly to `/admin`. **Expect:** redirect to `/admin/login`.
9. **Direct nav to `/admin/users` without auth:** Same — redirect, not partial render.

### Security checks

10. Inspect Network tab. **Expect:** admin endpoints (`/api/admin/*`) require Authorization header AND return 403 for non-admin tokens. Test by hand-crafting a request with Sarah's token aimed at `/api/admin/users`.
11. **JWT tampering:** Take a valid admin access token. Change the last character. Hit `/api/admin/users`. **Expect:** 401 invalid signature.
12. **CSRF risk:** Since tokens live in localStorage (not cookies), CSRF is naturally mitigated. Verify no admin endpoints accept session cookies as auth.

---

## TC-A5 · Session refresh & JWT expiry

### Golden path

1. Sign in as Sarah at `/join`.
2. Note the time. Wait at least 16 minutes (access token TTL is 15m).
3. Click any tab in `/buyer` that triggers an API call (e.g. Saved tab).
4. **Expect:** content loads with no re-login prompt.
5. DevTools → Network. **Expect:** a `POST /api/auth/refresh` call fired transparently, returned new access token.

### Edge cases

6. **Delete refresh token mid-session:** While logged in, open DevTools → Application → Local Storage. Delete `dy_refresh_token`. Wait for access token to expire. Trigger an API call. **Expect:** the refresh attempt fails (no refresh token), user is logged out, redirected to `/join`.
7. **Tamper access token:** While logged in, modify `dy_access_token` last char. Trigger any API call. **Expect:** server returns 401, client either auto-refreshes (still has refresh token) OR logs out cleanly. Should NOT loop infinitely.
8. **Refresh-token rotation (if implemented):** Sign in. Capture the refresh token. Wait 30s. Trigger refresh. **Expect:** new refresh token issued, old one rejected on replay. (If not implemented, file as P2.)
9. **Tab close & reopen:** Sign in, close tab, reopen `/buyer` 10 minutes later. **Expect:** still logged in (refresh fires on load).
10. **Concurrent tabs:** Open `/buyer` in two tabs. Sign out from one. **Expect:** other tab eventually logs out too (on next API call) — or shows a "session ended" message.

---

## TC-A6 · API integration: `/api/auth`

**Tool:** Postman, Insomnia, or `curl`. Run against `http://localhost:4000` or your prod API base.

### Endpoints to cover

| Endpoint | Method | Test |
|---|---|---|
| `/api/auth/signup` | POST | valid → 201; duplicate → 409; weak password → 400 |
| `/api/auth/login` | POST | valid → 200 + tokens; wrong password → 401 generic; rate limit → 429 |
| `/api/auth/refresh` | POST | valid refresh → 200 + new access; expired → 401; tampered → 401 |
| `/api/auth/me` | GET | with valid token → 200 + user; no token → 401; expired token → 401 |
| `/api/auth/me` | PATCH | update profile fields → 200; invalid field → 400; unauth → 401 |
| `/api/auth/me/set-password` | POST | Google user no password → 200; password user → 400; weak → 400 |
| `/api/auth/me/change-password` | POST | correct old → 200; wrong old → 401; weak new → 400; rate limit after 5 |
| `/api/auth/logout` | POST | valid → 200; tokens revoked server-side if implemented |
| `/api/auth/google` | POST | valid Google id_token → 200; tampered → 401 |

### Cross-cutting API checks

1. **Password fields never echo:** Confirm every response body never contains `password`, `passwordHash`, `refreshToken` field on User objects.
2. **CORS:** Confirm `Access-Control-Allow-Origin` is set to your frontend domain in prod (NOT `*`).
3. **Helmet headers:** Confirm response includes `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security` (in prod).
4. **Rate limit headers:** Confirm `X-RateLimit-*` or `Retry-After` headers present on rate-limited endpoints.
5. **Error format consistency:** All 4xx errors return `{ error: "message" }` shape, not mixed `{ message: ... }` / `{ errors: [...] }`.
6. **SQL injection probe:** Try email `' OR '1'='1` in login. **Expect:** treated as a literal string, 401 normal response, no DB error.
7. **Timing attack:** Time `/login` with valid email + wrong password vs unknown email. **Expect:** times are comparable (bcrypt comparison runs even when user not found, to prevent enumeration).

---

# Wave B — Seller core

**Prerequisite for all Wave B tests:** Sign in as `demo-seller@dropyard.local` and switch to seller mode (avatar menu top-right → "Switch to seller" if not already in seller mode).

---

## TC-B1 · Overview tab (seller mode)

### Golden path

1. Sign in as Avery Demo. Land on `/buyer`. Switch to seller mode.
2. Confirm the Overview tab is selected by default.
3. **Expect:** Drop cycle strip at top shows current phase (SUBMISSION/PREVIEW/LIVE/CLOSED) and a countdown to the next phase boundary.
4. **Expect:** Hero counts read: "X queued for Saturday's Drop · Y on the Shelf · Z drafts" (numbers match actual inventory).
5. **Expect:** "Needs your attention" section lists actionable items (pickups today, unread messages, drafts).
6. **Expect:** "Going live this Drop" preview shows queued items as horizontally scrollable cards.
7. **Expect:** Recap card shows last drop's stats ("X of Y sold · $Z earned · top item: ...") if a recent drop happened.
8. Click each "attention" tile. **Expect:** navigates to the relevant tab (Pickups, Messages, My Items, etc.).
9. Click an item card in "Going live". **Expect:** opens item detail or scrolls to the item in My Items.

### Edge cases

10. **Empty state:** Use a fresh seller account with zero items. **Expect:** counts read 0, no broken cards, an empty-state CTA "Add your first item".
11. **Phase transition:** Wait through (or simulate) a phase change (e.g. SUBMISSION → PREVIEW). **Expect:** strip updates without manual refresh (or updates on next interaction).
12. **All-sold scenario:** Seller with all items SOLD, none active. **Expect:** counts read 0/0, recap card shows the sale totals correctly, no orphan "Going live" cards.
13. **No recent drop:** First-time seller, no prior drop happened. **Expect:** recap card hidden OR shows a "first drop coming up" message — NOT a broken "0 of 0 sold" display.
14. **Real-time update:** Have a buyer (in another browser) claim an item. **Expect:** "attention" tile shows a new pending claim within 2 seconds without manual refresh (socket event).

### Mobile checks

15. At 360px, the Drop cycle strip stacks gracefully (no horizontal overflow).
16. "Going live" cards swipe horizontally without page-level horizontal scroll.

### Security checks

17. Open DevTools → Network. Confirm `/api/items/mine` and `/api/items/recap` use the Authorization header.
18. Sign in as a different seller (or call `/api/items/mine` with another user's token). **Expect:** only own items returned — no cross-tenant leak.

---

## TC-B2 · My Items tab (seller mode)

### Golden path

1. From seller mode, click "My Items" in left nav.
2. **Expect:** Tab filters visible — "All", "Drafts", "Queued", "On the Shelf".
3. **Expect:** Default tab is "All" and shows every active (non-SOLD, non-ARCHIVED) item.
4. Click "Drafts". **Expect:** only items with status DRAFT shown.
5. Click "Queued". **Expect:** only LIVE + DROP placement items shown.
6. Click "On the Shelf". **Expect:** only LIVE + SHELF placement items shown.
7. Click an item card. **Expect:** opens edit/detail view.
8. **Expect:** Each card shows: photo (or placeholder), title, price, condition badge, placement badge (Drop/Shelf), status, watcher count if > 0.
9. **Expect:** Bundle items show a "Bundle of N" pill and the contents reveal.

### Edge cases

10. **Empty filter:** A tab with zero matching items. **Expect:** specific empty state ("No drafts yet — start a listing") with CTA, not just blank space.
11. **SOLD item:** Mark an item as picked up (via Pickups tab). Return to My Items. **Expect:** SOLD item is NOT visible in any of the 4 filters (it lives in History).
12. **ARCHIVED item:** Manually archive an item. **Expect:** not visible in any filter.
13. **CLAIMED but not picked up:** Confirm a claim on an item. Return to My Items. **Expect:** item is still visible (state is "in flight" — seller needs to see it).
14. **Long title:** Item with a 200-char title. **Expect:** ellipsis or wrap, no card layout break.
15. **Missing photo:** Item with empty `photos[]` array. **Expect:** placeholder rendered, no broken image icon.
16. **Search:** If a search box exists, type a partial title. **Expect:** filters in real time, accent-insensitive.

### Real-time

17. In another browser as a buyer, claim a Drop item. As seller, watch My Items. **Expect:** item visually updates to "Pending Claim" or similar within 2s.
18. Confirm the claim from Orders tab. Switch back to My Items. **Expect:** item shows "Claimed" state.
19. Mark pickup complete. Switch back to My Items. **Expect:** item disappears from all filters within 2s.

### Mobile

20. Cards stack vertically at 360px, no horizontal overflow.
21. Filter tabs scroll horizontally if they overflow.

### Security

22. Hand-craft a `/api/items/mine` call with a buyer's token. **Expect:** returns only their (likely empty) items, not the seller's.

---

## TC-B3 · Orders/Claims tab (seller side)

### Golden path

1. In seller mode, click "Orders" in left nav.
2. **Expect:** Sub-tabs: "Pending claims" (default), "Confirmed pickups", "History".
3. **Expect:** Pending claims sub-tab lists every PENDING claim on this seller's items.
4. Each row shows: item thumbnail, item title, buyer name + neighborhood, pickup slot requested, time-since requested.
5. Click "Accept" on a pending claim.
6. **Expect:** Confirmation modal asks "Confirm pickup with [buyer] for [item] at [slot]?".
7. Confirm. **Expect:** claim disappears from Pending list, item lifecycle moves to CLAIMED.
8. **Expect:** Any other pending claims on the same item are auto-rejected (visible in the buyer's Claims tab as "rejected").
9. Switch to "Confirmed pickups". **Expect:** the just-confirmed claim now appears here.

### Edge cases

10. **Reject claim:** Pending claim → click Reject. **Expect:** modal "Reject [buyer]'s claim?". Confirm. Disappears. Buyer sees REJECTED in their Claims tab.
11. **Race condition:** Two browsers, both as seller (or via direct API). Try to accept the same claim twice. **Expect:** second attempt returns 400/409 with clear error — NOT 500.
12. **Already-accepted item:** A claim arrives on an item that's already been claimed (and CLAIMED status). Should not happen via UI, but if it does (via API). **Expect:** the claim endpoint returns 400 "item not available".
13. **Buyer cancels first:** While a claim is PENDING, have the buyer cancel from their side. As seller, watch Orders. **Expect:** the row disappears within 2s.
14. **Mark picked up:** In Confirmed pickups, click "Mark picked up". **Expect:** confirmation, then claim moves to History sub-tab. Item moves to SOLD status. Item disappears from My Items.
15. **No claims:** A seller with no claims. **Expect:** empty state on each sub-tab with CTA "Share your Drop" or similar.

### Real-time

16. Open Orders. In another browser, have a buyer claim an item. **Expect:** new row appears in Pending within 2s without refresh (socket `claim:new`).

### Mobile

17. Each claim row stacks (thumbnail above text) at 360px.
18. Accept/Reject buttons remain visible without horizontal scroll.

### Security

19. As Avery (seller), try via API to accept a claim that belongs to another seller. **Expect:** 404 or 403, NOT silent success.
20. As Avery, try to mark a claim as picked up that isn't CONFIRMED. **Expect:** 400.

---

## TC-B4 · Pickups tab

### Golden path

1. Seller mode → "Pickups" (may be a sub-tab of Orders or its own nav item).
2. **Expect:** List of all CONFIRMED claims grouped by date (Today / This week / Later).
3. **Expect:** Each row shows: item, buyer name + neighborhood, pickup slot, pickup address (if set), time-until.
4. Click a pickup. **Expect:** detail view with full address, contact-the-buyer link (opens Messages thread), "Mark picked up" CTA.
5. Click "Mark picked up". **Expect:** confirmation prompt, then row disappears, item flips to SOLD.

### Edge cases

6. **Today urgency:** A pickup scheduled for today within 2 hours. **Expect:** visually highlighted (claret color or "Urgent" pill).
7. **Past pickup, not marked:** A pickup whose slot has passed but not marked. **Expect:** visible warning + maybe a "Mark as no-show" option.
8. **No address:** Pickup whose address field is empty. **Expect:** shows "—" or "Buyer will be notified" — no "undefined" string.
9. **Multiple same-day:** 3 pickups on the same day. **Expect:** sorted by time, all visible without overflow.

### Real-time

10. Open Pickups. In another browser, confirm a new claim. **Expect:** new row appears within 2s.
11. Have buyer cancel a confirmed pickup. **Expect:** row disappears within 2s.

### Mobile

12. Date groupings render clearly. Each pickup row tappable in full.

### Security

13. Try via API to fetch another seller's pickups. **Expect:** 403/empty.

---

## TC-B5 · Messages tab (seller side)

### Golden path

1. Seller mode → "Messages" nav.
2. **Expect:** Master-detail layout. Left: conversation list sorted by most recent message. Right: thread view (or empty state if none selected).
3. **Expect:** Each conversation row shows: buyer name, item being discussed (small thumbnail or title), last message preview, unread badge if applicable.
4. Click a conversation. **Expect:** thread loads, showing all messages chronologically.
5. **Expect:** Each message shows sender (you/them), body, timestamp.
6. Type in the composer and send. **Expect:** message appears immediately in the thread (optimistic) and confirmed by socket.

### Edge cases

7. **Empty inbox:** Zero conversations. **Expect:** empty state with explanation ("Buyers can message you about your items — start by listing one").
8. **Long message:** Send a 500-char message. **Expect:** wraps cleanly, no overflow.
9. **Rapid send:** Send 5 messages back-to-back. **Expect:** all appear in order, none lost.
10. **Unread management:** Open a conversation with unread messages. **Expect:** unread badge clears after viewing. Reload page. **Expect:** still cleared (persisted via `lastReadBySellerAt`).
11. **Send empty:** Try to send an empty message. **Expect:** Send button disabled or noop.
12. **Multiple items per buyer:** Same buyer has questions on 2 different items. **Expect:** 2 distinct conversations (keyed by itemId + buyerId).

### Real-time

13. Open Messages. In another browser as a buyer, send a message. **Expect:** new message appears in seller's thread within 2s without refresh. Conversation list re-sorts to top.
14. If seller has a conversation NOT open and the buyer messages, the conversation row bumps to top with an unread badge.

### Mobile

15. At 360px, master-detail collapses: list view by default, tap a row → thread view fills screen. Back button returns to list.

### Security

16. Try via API to fetch a conversation that doesn't belong to you. **Expect:** 404/403.
17. Try to send a message to a conversation you don't own. **Expect:** 403.

---

## TC-B6 · History tab (seller side)

### Golden path

1. Seller mode → "History" (may be Orders sub-tab).
2. **Expect:** List of all PICKED_UP claims, sorted by completedAt desc.
3. **Expect:** Each row shows: item thumbnail, title, buyer name, price sold, completed date, review (if any).
4. **Expect:** Rows with a review show star rating + review text quote.
5. **Expect:** Totals summary at top: total items sold, total $ earned, avg rating.
6. Click a row. **Expect:** expanded detail view with full transaction info + ability to message the buyer.

### Edge cases

7. **Empty history:** No past sales. **Expect:** empty state.
8. **No-review:** Some claims have null review. **Expect:** row renders without a phantom star UI.
9. **Long review:** A review with 500 chars. **Expect:** truncated with "more" or wrapped.
10. **Price below original:** Item sold for less than `originalPrice`. **Expect:** shows "$95 → $80" strikethrough format.
11. **Year boundaries:** History spanning 2 years. **Expect:** grouped by month/year or paginated.

### Security

12. Try via API to read another seller's history. **Expect:** 403/empty.

---

## TC-B7 · Settings tab (seller side)

### Golden path

1. Seller mode → "Settings" or avatar menu → Settings.
2. **Expect:** Sections: Profile (name, email, neighborhood), Payment methods, Default pickup address, Notifications, Password.
3. Edit display name. Save. **Expect:** success toast, name updates everywhere (avatar menu, conversations).
4. Edit accepted payment methods (toggle CASH, ETRANSFER). Save. **Expect:** new items pre-fill with these defaults.
5. Edit default pickup address. Save. **Expect:** new items pre-fill the address.
6. Toggle notification channels (email/whatsapp/push) per event type (claim/offer/question/pickup/weekly). Save. **Expect:** the matrix persists on reload.

### Edge cases

7. **Empty name:** Try to save with name blank. **Expect:** field error, no save.
8. **Invalid email format:** Try `not-email`. **Expect:** field error.
9. **Network failure during save:** Use DevTools to block `/api/auth/me`. Click save. **Expect:** error toast, settings UI doesn't show success.
10. **Concurrent edit:** Edit in two tabs. Save one. Then save the other. **Expect:** last write wins gracefully, or a conflict warning. Should NOT 500.

### Security

11. Try via API to PATCH `/api/auth/me` with a different user's ID in the body. **Expect:** server ignores the body ID, updates only the authenticated user.
12. Try to PATCH a forbidden field (e.g. `role: 'ADMIN'`). **Expect:** rejected with 400 or field silently dropped — NOT silently promoted.

---

## TC-B8 · Create-item flow

### Golden path

1. Seller mode → "Add item" button (top right or in My Items).
2. **Expect:** Multi-step form OR single long form: Title, Description, Category, Condition, Price (+ original price), Photos (up to N), Placement (Drop vs Shelf), Bundle toggle, Pickup mode, Payment methods.
3. Fill all required fields with valid data.
4. Upload at least 1 photo (use a small JPG / PNG).
5. **Expect:** Photo upload shows progress, then displays the thumbnail.
6. Click "Save as draft". **Expect:** appears in My Items > Drafts. Item DB row has status DRAFT.
7. Re-open the draft. Click "Publish to Drop". **Expect:** confirmation, then item flips to LIVE + DROP. Appears in Queued.

### Edge cases

8. **Required field missing:** Submit without title. **Expect:** field error.
9. **Price = 0:** Try price = 0. **Expect:** specific error (price > 0 required) OR allowed if free items are intended — confirm intent.
10. **Negative price:** Try price = -10. **Expect:** rejected.
11. **Excessive photos:** Try uploading 11+ photos if limit is 10. **Expect:** validation blocks at limit.
12. **Huge photo:** Upload a 20MB+ photo. **Expect:** rejected client-side with size limit error before upload attempt.
13. **Bad photo format:** Try uploading a `.txt` file. **Expect:** rejected.
14. **S3 failure:** Use DevTools to block the S3 PUT URL. Upload. **Expect:** specific error, item save not allowed without photos (or allowed with placeholder, document the choice).
15. **Bundle:** Toggle "Is bundle", enter bundle count = 4 and 4 content lines. Save. **Expect:** stored. Renders with "Bundle of 4" pill.
16. **Shelf placement:** Choose "Shelf" placement. **Expect:** item goes LIVE immediately (no Drop wait).
17. **Cancel mid-form:** Fill 3 fields, navigate away. **Expect:** confirmation prompt OR draft auto-saved (document behavior).
18. **Submit twice:** Click Save twice rapidly. **Expect:** form button disabled after first click; only one item created.

### Mobile

19. Form fields stack at 360px, no horizontal scroll. Photo picker works on mobile (taps to native picker).

### Security

20. Inspect the `/api/items` POST payload. **Expect:** server validates every field, doesn't trust client-passed `sellerId` (uses JWT).
21. Try to set `sellerId` to another user's ID in the request body. **Expect:** server ignores, uses JWT user.
22. Inject HTML / script tags in title/description. **Expect:** stored raw but rendered safely (escaped) on read.
23. Upload an image with EXIF GPS metadata. **Expect:** server strips it before storing (privacy) — or document if it doesn't.

---

## TC-B9 · Edit-item flow

### Golden path

1. My Items → click an item → Edit.
2. **Expect:** form pre-fills with current values.
3. Change title and price. Save.
4. **Expect:** updated values reflected in My Items list.

### Edge cases

5. **Edit a LIVE item:** Change description on a queued (LIVE + DROP) item during PREVIEW phase. **Expect:** allowed.
6. **Edit a CLAIMED item:** Try editing an item with status CLAIMED. **Expect:** either blocked with clear message OR only specific fields editable (price locked etc.).
7. **Edit a SOLD item:** Should not be possible via UI (item isn't shown). If accessed via direct URL, **expect:** 400/403.
8. **Delete:** Delete a DRAFT item. **Expect:** confirmation, then removed from My Items.
9. **Delete a LIVE item with no claims:** **Expect:** allowed with warning.
10. **Delete a LIVE item with pending claims:** **Expect:** prompt explaining the claims will be auto-rejected.

### Security

11. Try via API to PATCH another seller's item. **Expect:** 404/403.

---

## TC-B10 · Confirm-pickup flow end-to-end (Playwright candidate)

This is the marquee flow — exercises the entire lifecycle from listing to history.

### Golden path

1. Sign in as Avery. Create a new item (TC-B8 golden path).
2. Sign in as Sarah (different browser/incognito). Claim the item.
3. As Avery, see the pending claim in Orders. Accept it.
4. As Sarah, see the claim status change to "Confirmed" in real time (no refresh).
5. As Avery, navigate to Pickups, find the confirmed pickup, click "Mark picked up".
6. **Expect:** Item disappears from My Items.
7. **Expect:** Item appears in Avery's History tab.
8. **Expect:** Claim appears in Sarah's History tab.
9. **Expect:** Both Overview hero counts decrement (Avery's shelf/queued count drops by 1).
10. **Expect:** Drop recap "X of Y sold · $Z earned" totals update.

### Real-time validation

11. The buyer-side socket event for `claim:updated: PICKED_UP` fires within 2s of the seller's action.
12. The seller-side socket event also fires (claim row disappears from Orders Confirmed sub-tab without refresh).

### Edge cases

13. **Cancel mid-flow:** Buyer cancels the claim after confirm but before pickup. **Expect:** item flips back to LIVE, available for re-claim.
14. **Mark picked up twice:** Try clicking the button twice rapidly. **Expect:** second click no-op.

---

## TC-B11 · Moving-sale registration

### Golden path

1. Seller mode → "Register Moving Sale" CTA (visible during SUBMISSION phase only).
2. **Expect:** Form: address, drop window preference, item categories planned, expected item count.
3. Fill and submit.
4. **Expect:** Success message "Your sale is awaiting admin approval".
5. **Expect:** Status visible somewhere ("Pending review"). Cannot submit a second sale until first is reviewed.

### Edge cases

6. **Not in SUBMISSION phase:** Try during LIVE phase. **Expect:** CTA hidden or disabled with phase explanation.
7. **Already registered:** Try to register again while one is Pending. **Expect:** blocked with message.
8. **Approved sale:** Once admin approves (TC-D5), seller's status shows "Approved", and they can list items.
9. **Rejected sale:** If admin rejects, seller sees the rejection reason. Can edit and resubmit.

### Security

10. Try via API to approve own sale. **Expect:** 403 (only admin endpoint).

---

## TC-B12 · API: `/api/items`

| Endpoint | Method | Test |
|---|---|---|
| `/api/items` | GET | public list of LIVE items; pagination; filters (category, neighborhood); empty list returns `{ items: [] }` |
| `/api/items` | POST | requires auth; valid → 201; invalid fields → 400; non-seller (BUYER role) → 403 if role-gated |
| `/api/items/mine` | GET | auth required; returns only own items; never returns other sellers' |
| `/api/items/recap` | GET | auth required; returns last drop's sale stats for this seller |
| `/api/items/:id` | GET | public LIVE items readable; DRAFT only by owner |
| `/api/items/:id` | PATCH | owner only; non-owner → 404/403; invalid fields → 400 |
| `/api/items/:id` | DELETE | owner only; soft-delete or hard-delete (document choice) |

Cross-cutting:

1. Try `/api/items?category=FURNITURE` filter. **Expect:** only FURNITURE items.
2. Try a malformed UUID for `:id`. **Expect:** 400, not 500.
3. Photo URLs in responses use the resolved CDN/S3 URL, not raw S3 key.
4. Hardcode-test: pass an item with bundleCount=0 but isBundle=true. **Expect:** rejected.

---

## TC-B13 · API: `/api/uploads`

| Endpoint | Method | Test |
|---|---|---|
| `/api/uploads/presign` | POST | auth required; returns signed S3 PUT URL; URL expires in ≤ 15 min |
| (S3 PUT) | PUT | upload with returned URL; succeeds; file appears in S3 bucket |
| `/api/uploads/confirm` | POST | (if implemented) returns final CDN URL for the uploaded key |

1. **Without auth:** call `/presign`. **Expect:** 401.
2. **Different user reuses URL:** call `/presign` as User A, then try to PUT as User B. **Expect:** S3 enforces the signature (only valid signature can PUT). User B's request fails.
3. **Expired URL:** wait > 15 min after `/presign`, then try PUT. **Expect:** S3 rejects.
4. **MIME validation:** request presign for `.exe`. **Expect:** rejected or restricted to image types.
5. **CORS:** confirm S3 bucket allows PUT from your frontend origin (or via CloudFront).

---

## TC-B14 · API: `/api/moving-sale`

| Endpoint | Method | Test |
|---|---|---|
| `/api/moving-sale` | POST | seller creates registration; once per active sale |
| `/api/moving-sale/mine` | GET | returns the seller's current sale + status |
| `/api/moving-sale/:id` | PATCH | seller edits while still Pending |
| `/api/moving-sale/:id` | DELETE | seller withdraws |

1. Try POST during non-SUBMISSION phase. **Expect:** 400 with phase info.
2. Try to PATCH after admin approval. **Expect:** 400/403 ("approved, cannot edit").

---

## TC-B15 · API: `/api/drop`

| Endpoint | Method | Test |
|---|---|---|
| `/api/drop/current` | GET | returns current drop with weekOf, phase, phase deadlines |
| `/api/drop/cycle` | GET | (if exists) returns cycle config |

1. Call at a known time. **Expect:** phase matches the day/hour mapping.
2. Confirm timezone handling — Ottawa is `America/Toronto`. The phase boundaries align with local time, not UTC.

---

# Wave C — Buyer core

**Prerequisite:** Sign in as `sarah.demo@dropyard.local`. Stay in buyer mode (default for BUYER role).

---

## TC-C1 · Discover tab

### Golden path

1. Sign in as Sarah. Land on `/buyer`.
2. **Expect:** Discover tab is the default.
3. **Expect:** Hero/banner shows current drop phase + countdown if applicable ("Drop opens in 2d 4h").
4. **Expect:** "Featured this week" or "Hot picks" row of items.
5. **Expect:** Filter rail: search box, category dropdown, sort dropdown (price asc/desc, newest, popular).
6. **Expect:** Item grid showing all LIVE items, with seller and price.
7. Click a category. **Expect:** grid filters in real time.
8. Type in search box. **Expect:** debounced filtering on title/description.
9. Sort by price asc. **Expect:** items re-order.

### Edge cases

10. **No items:** A phase/state with zero LIVE items. **Expect:** empty state with "Drop opens Saturday" or similar.
11. **Drop CLOSED:** During CLOSED phase. **Expect:** banner indicates "Drop is wrapped, next opens Saturday".
12. **Long item title:** ellipsis on card, full title on hover/tap.
13. **Sold out mid-browse:** While viewing, an item gets claimed in another browser. **Expect:** visual indicator on the card (or removal) within 2s.

### Real-time

14. Another buyer claims an item Sarah is viewing. **Expect:** Sarah's view of that item updates to "Claimed" overlay.
15. New item is published. **Expect:** appears in Discover within 2s (if subscribed) or on next refresh.

### Mobile

16. At 360px, filter rail collapses into a sticky toggle. Grid becomes single column or 2-col.

### Security

17. `/api/items` should never return DRAFT or ARCHIVED items in the public list.
18. Items from suspended sellers should be hidden.

---

## TC-C2 · Saved tab

### Golden path

1. Buyer mode → "Saved" tab.
2. **Expect:** All items Sarah has watchlisted, regardless of current status.
3. **Expect:** Each card has same info as Discover + a Saved indicator.
4. Click the heart/save icon to unsave an item. **Expect:** removed from list immediately, watchlist count decrements.

### Edge cases

5. **Empty saved:** No items saved. **Expect:** empty state with CTA "Browse the drop".
6. **Saved item went SOLD:** Sarah's saved item gets bought by someone else. **Expect:** visible with "Sold" overlay — option to "Notify if available again" (if implemented).
7. **Saved item went CLAIMED by Sarah:** **Expect:** "You claimed this" overlay.
8. **Sort/filter:** If saved tab has sort/filter, same checks as Discover.

### Real-time

9. While viewing Saved tab, item gets claimed by another buyer. **Expect:** "Sold" overlay appears.

### Security

10. `/api/watchlist` returns only Sarah's saves.
11. Try POST `/api/watchlist` with another user's ID. **Expect:** ignored, uses JWT.

---

## TC-C3 · Claims tab (buyer side)

### Golden path

1. Buyer mode → "Claims" tab.
2. **Expect:** Stats bar: confirmed count, awaiting count, picked-up count.
3. **Expect:** Cards for each claim, grouped by status (Confirmed / Awaiting / Picked up).
4. **Expect:** Each card shows item, seller name, pickup slot, pickup address (if confirmed), status badge.
5. Click "Message seller" on a card. **Expect:** opens Messages thread for that item/seller.
6. Click "Cancel claim" on a PENDING or CONFIRMED claim.
7. **Expect:** confirmation modal "Cancel your claim on [item]?".
8. Confirm. **Expect:** claim removed from list. If was CONFIRMED, item flips back to LIVE.

### Edge cases

9. **No claims:** empty state.
10. **Already-picked-up:** No cancel option visible.
11. **Rejected by seller:** Visible in a "Rejected" section or removed; document behavior.
12. **Pickup overdue:** Confirmed claim whose slot has passed. **Expect:** warning indicator.

### Real-time

13. As Sarah, watch the Claims tab. As Avery in another browser, confirm Sarah's pending claim. **Expect:** Sarah's card flips to "Confirmed" within 2s.
14. As Avery, mark as picked up. **Expect:** Sarah's card moves to "Picked up" section.
15. As Avery, reject a pending claim. **Expect:** Sarah sees Rejected status.

### Security

16. `/api/claims/mine` only returns Sarah's claims.
17. Try via API to cancel another buyer's claim. **Expect:** 404/403.

---

## TC-C4 · Messages tab (buyer side)

Mirror of TC-B5 from buyer perspective.

### Golden path

1. Buyer mode → "Messages" tab.
2. **Expect:** Conversation list shows all of Sarah's threads, sorted by recency.
3. Click a thread. **Expect:** messages load, composer ready.
4. Send a message. **Expect:** appears immediately, mirrored to seller in real time.

### Edge cases

5. **Empty:** No conversations. **Expect:** empty state with hint "Ask a seller about an item to start a conversation".
6. **Long thread:** 50+ messages. **Expect:** virtualized or scrollable smoothly; jump-to-latest works.
7. **Send during seller offline:** Seller not connected. **Expect:** message delivered via DB. Seller sees on next load.

### Real-time

8. Seller sends a message. **Expect:** buyer's thread updates within 2s. List re-sorts.
9. Conversation has unread badge if message arrives while thread isn't open.

### Security

10. `/api/conversations/mine` returns only Sarah's threads.
11. Cannot view a thread that doesn't include Sarah.

---

## TC-C5 · History tab (buyer side)

### Golden path

1. Buyer mode → "History" tab.
2. **Expect:** All PICKED_UP claims belonging to Sarah, with seller info, completed date, total $ spent.
3. **Expect:** Stats: total purchases, total spent, average rating left.
4. Click an item. **Expect:** detail view with pickup info, option to leave/edit a review.

### Edge cases

5. **Empty history:** empty state.
6. **Leave review:** Click "Leave a review". 5-star + text. Save. **Expect:** review attached to claim. Seller sees in their History.
7. **Edit review:** After saving, edit and re-save. **Expect:** updated.
8. **No review left yet:** UI prompts to leave one within X days post-pickup.

### Security

9. Cannot review on someone else's claim.
10. Cannot review a non-PICKED_UP claim.

---

## TC-C6 · Item detail view

### Golden path

1. From Discover, click any item card.
2. **Expect:** Detail view (modal or full page) with: hero photo (or carousel if multiple), full title, price, original price (strikethrough if discounted), description, condition, category, seller name + neighborhood, pickup info, "Claim now" CTA, "Save" heart icon, "Message seller" link.
3. **Expect:** Bundle items show contents list.
4. Click "Save". **Expect:** heart fills, added to watchlist.
5. Click "Claim now".
6. **Expect:** modal asking pickup slot selection.
7. Select a slot. Confirm. **Expect:** claim created, success toast, "You claimed this" overlay appears.

### Edge cases

8. **Already-claimed item:** Open detail. **Expect:** CTA hidden or replaced with "Sold" / "Reserved".
9. **Item from suspended seller:** **Expect:** detail not accessible OR shown with warning.
10. **Multiple photos:** Click through carousel. **Expect:** smooth, all photos load.
11. **No photos:** Placeholder rendered.
12. **Long description:** "Read more" expand if truncated.

### Real-time

13. Item gets claimed by another buyer while detail is open. **Expect:** CTA disables, "Sold" overlay appears within 2s.

### Mobile

14. Hero photo is full width; CTAs sticky-bottom for thumb reach.

### Security

15. Direct nav to a DRAFT item's URL (if guessable). **Expect:** 404.
16. XSS probe: if any seller-controlled text renders (title, description), confirm escaping.

---

## TC-C7 · Claim flow end-to-end (Playwright candidate)

Same as TC-B10 from buyer side. Combines C1 → C6 → C3.

1. Discover → click item → Claim now → pick slot → confirm.
2. **Expect:** appears in Claims tab as "Awaiting confirmation".
3. As seller (Avery), confirm. **Expect:** Sarah's Claims card flips to "Confirmed" in real time.
4. As Avery, mark picked up. **Expect:** Sarah's card moves to "Picked up". Item appears in Sarah's History.

---

## TC-C8 · Cancel-claim flow (buyer)

### Golden path

1. As Sarah, claim an item.
2. Go to Claims tab. Click Cancel.
3. Confirm modal. **Expect:** claim removed.
4. **Expect:** if claim was CONFIRMED, item is LIVE again — verify by claiming from Discover.

### Edge cases

5. **Cancel a PICKED_UP:** No option visible.
6. **Cancel a REJECTED:** No option (already inactive).

### Security

7. Cannot cancel another buyer's claim.

---

## TC-C9 · Watchlist save/unsave

### Golden path

1. From any item card or detail, click heart/save.
2. **Expect:** heart fills, item appears in Saved tab.
3. Click heart again to unsave. **Expect:** removed from Saved.

### Edge cases

4. **Save same item twice rapidly:** Server should treat second as idempotent, not duplicate.
5. **Watcher count:** Item shows total watchers (across all buyers). Saving increments by 1, unsaving decrements.

### Security

6. `/api/watchlist` POST uses authenticated user; cannot save on behalf of another user.

---

## TC-C10 · Real-time socket events (both sides)

Comprehensive socket test — exercises both Avery and Sarah simultaneously in 2 browsers.

| Event | Trigger | Expected effect |
|---|---|---|
| `claim:new` | Buyer claims | Seller's Orders tab updates within 2s |
| `claim:updated CONFIRMED` | Seller accepts | Buyer's Claims tab updates within 2s |
| `claim:updated REJECTED` | Seller rejects | Buyer sees Rejected status within 2s |
| `claim:updated CANCELLED` | Buyer cancels | Seller's Orders row removed within 2s |
| `claim:updated PICKED_UP` | Seller marks picked up | Both: Buyer's claim moves to History, Seller's My Items removes the item |
| `message:new` | Either party sends | Other side's Messages updates within 2s |

### Edge cases

1. **Socket disconnects mid-session:** Use DevTools → Network → set Offline. Then Online. **Expect:** socket reconnects; missed events sync (or full refetch on reconnect).
2. **Both online, slow network:** Throttle to Slow 3G. Event still arrives within 5s.
3. **Wrong user receives an event:** Use a 3rd browser as a different buyer. **Expect:** doesn't receive other users' events.

### Security

4. Try to connect to socket with a tampered auth. **Expect:** rejected, no events leaked.

---

## TC-C11 · API: `/api/claims`

| Endpoint | Method | Test |
|---|---|---|
| `/api/claims` | POST | auth; valid item/slot → 201; own item → 400; non-LIVE item → 400; duplicate pending → 400 |
| `/api/claims/mine` | GET | own claims only |
| `/api/claims/incoming?status=PENDING` | GET | seller's pending claims |
| `/api/claims/incoming?status=CONFIRMED` | GET | confirmed pickups |
| `/api/claims/incoming?status=PICKED_UP` | GET | history |
| `/api/claims/:id/confirm` | PATCH | seller of item only; not-pending → 400; other sellers → 404 |
| `/api/claims/:id/reject` | PATCH | seller only |
| `/api/claims/:id/cancel` | PATCH | buyer only; not-PENDING-or-CONFIRMED → 400 |
| `/api/claims/:id/picked-up` | PATCH | seller only; not-CONFIRMED → 400 |

Cross-cutting:

1. **Invalid status filter:** `?status=NOPE`. **Expect:** falls back to default or 400.
2. **Concurrent confirm/cancel race:** test both endpoints simultaneously. **Expect:** transaction safety — only one wins.

---

## TC-C12 · API: `/api/watchlist`

| Endpoint | Method | Test |
|---|---|---|
| `/api/watchlist` | POST | adds item; idempotent on duplicate |
| `/api/watchlist/:itemId` | DELETE | removes; non-existent → 204 or 404 (document) |
| `/api/watchlist/mine` | GET | own saves only |

---

## TC-C13 · API: `/api/conversations`

| Endpoint | Method | Test |
|---|---|---|
| `/api/conversations` | GET | both-roles inbox sorted by recency |
| `/api/conversations` | POST | creates thread (idempotent on existing item+buyer pair) |
| `/api/conversations/:id/messages` | GET | only participants can read |
| `/api/conversations/:id/messages` | POST | only participants can send |
| `/api/conversations/:id/read` | PATCH | marks read by current user |

Cross-cutting:

1. **Empty body message:** rejected.
2. **Message > 5000 chars:** rejected or truncated (document).
3. **Non-participant access:** 403.
4. **Read receipt persistence:** lastReadBy* persists across sessions.

---

# Wave D — Admin

**Prerequisite:** Sign in as `info@asvntech.com` / `Apple@1234` at `/admin/login`.

---

## TC-D1 · `/admin` dashboard root

### Golden path

1. Sign in. Land on `/admin`.
2. **Expect:** Top-line metrics: total users, total items, active sales this week, pending submissions count, total $ transacted.
3. **Expect:** Quick-action cards: "Review submissions", "Manage users", "Inbox".
4. **Expect:** Recent activity feed (recent signups, recent sales).
5. Click each action card. **Expect:** navigates to the corresponding section.

### Edge cases

6. **Zero metrics:** Fresh DB. **Expect:** zeros render cleanly, no NaN/undefined.
7. **Slow metrics query:** Throttle network. **Expect:** loading state, then data, not blank.

### Mobile

8. Cards stack at 360px. Metrics readable.

### Security

9. Non-admin user navigating to `/admin` → redirect to `/admin/login`.
10. `/api/admin/metrics` returns 403 to non-admin token.

---

## TC-D2 · `/admin/inbox`

### Golden path

1. Admin → Inbox.
2. **Expect:** List of contact-form submissions or support tickets, sorted by recency.
3. **Expect:** Each row: subject, sender, snippet, timestamp, status (New/Read/Replied).
4. Click a message. **Expect:** detail view with full body.
5. Mark as read or reply (if implemented). **Expect:** persists.

### Edge cases

6. **Empty inbox:** empty state.
7. **Long message:** scrollable, no layout break.
8. **Bulk actions:** select multiple → mark read. **Expect:** all flip.

### Security

9. Inbox accessible only by admin.

---

## TC-D3 · `/admin/moving-sales`

### Golden path

1. Admin → Moving sales.
2. **Expect:** List of all moving sale submissions with status (Pending, Approved, Rejected).
3. Filter to Pending. **Expect:** all pending submissions visible.
4. Click a submission. **Expect:** detail view with seller info, proposed sale details, address.
5. Click "Approve". **Expect:** status flips to Approved. Seller is notified (email/push if configured) and can list items.
6. Click "Reject" on another. **Expect:** modal asking reason. Submit. **Expect:** rejected, seller notified.

### Edge cases

7. **Approve already-approved:** No effect (idempotent).
8. **Reject without reason:** Required field error.
9. **Empty list:** empty state.

### Mobile

10. Rows stack, actions reachable.

### Security

11. `/api/admin/moving-sales` requires admin.
12. Non-admin token → 403.

---

## TC-D4 · `/admin/users`

### Golden path

1. Admin → Users.
2. **Expect:** Table of all users with: email, name, role, neighborhood, status (Active/Suspended), joined date.
3. **Expect:** Search/filter by email.
4. **Expect:** Sort by joined date, by role.
5. Click a user. **Expect:** detail view with their items, claims, sales.
6. Click "Suspend". **Expect:** confirmation. Once confirmed, status = Suspended. User can no longer sign in.

### Edge cases

7. **Suspend own admin account:** Either blocked or warned.
8. **Restore suspended user:** Click Restore. **Expect:** status = Active.
9. **Search no results:** empty state, not error.
10. **Pagination:** With > 50 users, pagination works.

### Security

11. Cannot view password hashes or refresh tokens in any response.
12. Only admin can suspend/restore.

---

## TC-D5 · Approve-moving-sale flow (Playwright candidate)

End-to-end: seller registers → admin approves → seller can list.

1. As Avery (seller), register a moving sale during SUBMISSION phase (TC-B11).
2. As admin, see the pending submission. Approve it.
3. As Avery, **expect:** status changes to Approved. Can now create items.

---

## TC-D6 · Suspend-user flow

1. As admin, suspend Sarah's account.
2. As Sarah (other browser), try to sign in. **Expect:** error "account suspended" or similar.
3. As Sarah, try to use existing tokens to make an API call. **Expect:** 401/403, since user status = Suspended.
4. As admin, restore Sarah. As Sarah, sign in again. **Expect:** works.

---

## TC-D7 · API: `/api/admin`

| Endpoint | Method | Test |
|---|---|---|
| `/api/admin/metrics` | GET | requires admin; returns aggregates |
| `/api/admin/users` | GET | paginated list; filter/sort params |
| `/api/admin/users/:id/suspend` | PATCH | flips status; admin only |
| `/api/admin/users/:id/restore` | PATCH | admin only |
| `/api/admin/moving-sales` | GET | list with status filter |
| `/api/admin/moving-sales/:id/approve` | PATCH | admin only |
| `/api/admin/moving-sales/:id/reject` | PATCH | admin only; requires reason |

Cross-cutting:

1. Non-admin token → all return 403.
2. No PII leak: emails OK to return, password hashes never.

---

## TC-D8 · API: `/api/submissions`

| Endpoint | Method | Test |
|---|---|---|
| `/api/submissions` | GET | admin only; lists all moving-sale submissions |
| `/api/submissions/:id` | GET | admin only; full detail |
| `/api/submissions/:id/approve` | PATCH | admin only |
| `/api/submissions/:id/reject` | PATCH | admin only |

---

# Wave E — Public / marketing / legal

For Wave E, the focus is content correctness, layout, links, performance, and SEO. Functionality is minimal.

## Common checklist (apply to every Wave E page)

For each page:

- [ ] Loads under 2s on 4G
- [ ] No console errors or warnings
- [ ] No broken images (Network shows no 404 for img/svg)
- [ ] All internal links resolve (no 404s)
- [ ] External links open in new tab with `rel="noopener noreferrer"`
- [ ] Header/footer render correctly
- [ ] Mobile: no horizontal scroll at 360px
- [ ] Mobile: tappable targets ≥ 44×44px
- [ ] Tab key reaches all interactive elements in logical order
- [ ] Headings are hierarchical (no skipped levels)
- [ ] Color contrast ≥ 4.5:1 for body text
- [ ] `<title>` and `<meta description>` present and unique
- [ ] OpenGraph tags (`og:title`, `og:image`, `og:description`) present
- [ ] Canonical URL `<link rel="canonical">` matches the actual URL

---

## TC-E1 · `/` homepage

1. Open `/`.
2. **Expect:** Hero, value props, "Featured this week" using real items (not hardcoded mock).
3. **Expect:** Neighborhood selector dropdown lists real neighborhoods.
4. **Expect:** "How it works" section with 3-step flow.
5. **Expect:** "Sign up" / "Sign in" CTAs route to `/join`.
6. **Expect:** Footer links route correctly.
7. Click each main CTA. **Expect:** correct destination.

### Edge

8. **Zero LIVE items state:** "Featured this week" handles gracefully.
9. **DynamicDropCard:** Shows current phase + countdown using real cycle data.

---

## TC-E2 · `/about`

1. Open `/about`.
2. **Expect:** Story sections, founders, roadmap, contact link.
3. **Expect:** No placeholder Lorem ipsum.
4. All images load.

---

## TC-E3 · `/contact`

1. Open `/contact`.
2. **Expect:** Topic picker (8 topics) + form.
3. Pick a topic. Fill form. Submit.
4. **Expect:** Mailto link or form submission. If mailto, opens default mail client with prefilled subject + body.
5. If form submission, posts to `/api/contact` or similar, success toast on response.

### Edge

6. **Empty fields:** field validation.
7. **Invalid email:** rejected.

---

## TC-E4 · `/faq`

1. Open `/faq`.
2. **Expect:** 8 categories, accordion Q&As.
3. **Expect:** Live search filters Q&As.
4. **Expect:** Sticky chip nav for categories.
5. Click a Q. **Expect:** expands. Click again. Collapses.

### Edge

6. **Search no results:** empty state.
7. **Deep link:** `/faq#claim-cancel` or similar. **Expect:** scrolls to that Q.

---

## TC-E5 · `/for-buyers`

1. Open `/for-buyers`.
2. **Expect:** Value props for buyers, screenshots, CTA to sign up.
3. CTA routes to `/join`.

---

## TC-E6 · `/for-sellers`

1. Open `/for-sellers`.
2. **Expect:** Value props for sellers, "Sell with AI" callout, sample timeline of a Drop.
3. CTA routes to seller signup.

---

## TC-E7 · `/how-it-works`

1. Open `/how-it-works`.
2. **Expect:** 3-phase explanation (Submit / Browse / Pickup), illustration per phase.
3. CTAs route correctly.

---

## TC-E8 · `/help-center`

1. Open `/help-center`.
2. **Expect:** Two-way hub: "Get help" + "Help us grow".
3. Links to contact, FAQ, community guidelines work.

---

## TC-E9 · `/privacy-policy`

1. Open `/privacy-policy`.
2. **Expect:** 15 sections, sticky TOC, hero with "Privacy" label.
3. **Expect:** No placeholder content.
4. **Expect:** PIPEDA compliance language present.
5. **Expect:** Effective date is current or recent.
6. Click TOC links. **Expect:** smoothly scrolls to section.

### Mobile

7. TOC collapses to a dropdown on mobile.

---

## TC-E10 · `/community-guidelines`

1. Open `/community-guidelines`.
2. **Expect:** 14 sections + "Four Promises" floating chip bar.
3. Sticky TOC works.
4. Hero illustration renders.

---

## TC-E11 · `/terms-of-service`

1. Open `/terms-of-service`.
2. **Expect:** 22 sections, effective July 1, 2026.
3. Sticky TOC works.
4. Critical clauses (liability, dispute resolution) present.

---

## TC-E12 · Global header / nav

1. On every public page, header shows: logo (links to `/`), nav links (For Buyers / For Sellers / How / FAQ), Sign in / Sign up.
2. Logged in: replace Sign in with user avatar menu.
3. Hover/tap nav items. **Expect:** visible focus/hover state.
4. Mobile: hamburger menu opens overlay with all links.

### Edge

5. **Sticky on scroll:** header stays accessible.
6. **Logged-out viewing logged-in page:** header redirects appropriately.

---

## TC-E13 · Global footer

1. On every public page, footer shows: Company, Resources, Legal, social links.
2. Each link resolves (no 404).
3. Newsletter signup (if exists) works.
4. Copyright year is current.

---

# Wave F — Cross-cutting

These are audits, not click-through scripts. Each TC is a checklist that spans multiple pages.

---

## TC-F1 · Security audit

Re-verify all 20 items from [[security-checklist]] are still satisfied after recent code additions:

### Authentication & sessions

- [ ] JWT secret is in env var, NOT committed
- [ ] Access token TTL ≤ 15 min
- [ ] Refresh token TTL ≤ 7 days
- [ ] Passwords hashed with bcrypt cost ≥ 12
- [ ] Rate limit on login, signup, password change endpoints
- [ ] No email enumeration via login error messages
- [ ] No email enumeration via signup ("already exists" should be specific only post-creation)
- [ ] Google OAuth verifies ID token signature server-side

### Authorization

- [ ] Every protected route uses `requireAuth` middleware
- [ ] Every owner-scoped action (PATCH item, claim, conversation) verifies ownership before mutating
- [ ] Admin endpoints check `role === 'ADMIN'`
- [ ] Suspended users can't authenticate or use existing tokens

### Data exposure

- [ ] No `passwordHash`, `refreshToken`, `googleSub` in any API response
- [ ] Item photos: EXIF metadata stripped or documented
- [ ] User PII (email, address) only in own / admin responses
- [ ] No internal IDs (DB row counts) leaked

### Input validation

- [ ] Zod schemas on every POST/PATCH route
- [ ] String length limits on all text fields
- [ ] HTML escaping on all user-rendered content (titles, descriptions, messages)
- [ ] File upload: MIME and size limits enforced
- [ ] SQL injection probes: all return clean errors (Prisma parameterizes)
- [ ] NoSQL/JSON injection probes (if Prisma JSON fields used)

### Transport

- [ ] HTTPS enforced in prod (`Strict-Transport-Security` header)
- [ ] CORS limited to known origins (not `*`)
- [ ] CSP header set (or documented why not)
- [ ] No mixed-content warnings

### Dependencies

- [ ] `npm audit` shows no high/critical vulnerabilities
- [ ] No `.env` file in git history (`git log --all -- .env`)
- [ ] `.gitignore` includes `.env`, `node_modules`, `.next`

### Deferred items from prior memo

- [ ] Email verification status (deferred per [[deployment-readiness-2026-05-28]])
- [ ] httpOnly cookies vs localStorage tokens (deferred)
- [ ] Audit log consistency (deferred)
- [ ] `/me` user status check (deferred)
- [ ] Status field index (deferred)

For each unchecked item: file a P1 or P2 bug.

---

## TC-F2 · Accessibility audit

For each Wave A-E page:

- [ ] Run axe-core via Chrome DevTools "Accessibility" panel. Zero violations of impact ≥ "Serious".
- [ ] Tab through entire page from top. **Expect:** focus visible at all times, logical order, never traps.
- [ ] Test screen reader (NVDA on Windows / VoiceOver on Mac) on 3 critical flows: signup, claim an item, send a message.
- [ ] All images have `alt` (or empty alt if decorative).
- [ ] All form inputs have associated `<label>` (visible or aria-label).
- [ ] All buttons have accessible names (text content or aria-label).
- [ ] Modal traps focus while open, returns focus on close.
- [ ] `<html lang="en">` is set.
- [ ] Headings hierarchical (h1 → h2 → h3, no skipped levels).
- [ ] Color contrast ratio ≥ 4.5:1 for body, ≥ 3:1 for large text.
- [ ] No information conveyed by color alone.
- [ ] Animations respect `prefers-reduced-motion`.
- [ ] Tab order matches visual order (no `tabindex > 0` hacks).

Log any miss as P2 (visual blocking) or P3 (polish).

---

## TC-F3 · Performance audit

### Lighthouse

Run on `/`, `/buyer`, `/admin`, `/for-sellers`, `/faq`. Pass criteria:

- [ ] LCP (Largest Contentful Paint) < 2.5s on mobile
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] TBT (Total Blocking Time) < 300ms
- [ ] Initial JS bundle < 250KB gzipped per page
- [ ] Images optimized (WebP/AVIF where possible, lazy-loaded below fold)
- [ ] Fonts use `font-display: swap`
- [ ] No render-blocking 3rd-party scripts

### Backend perf

- [ ] Enable Prisma `log: ['query']` temporarily. Walk through every key flow. **Expect:** no query > 200ms.
- [ ] Verify N+1 queries are absent (claims with `include: { item, buyer }` etc.).
- [ ] Check indexes on hot columns: `items.status`, `items.sellerId`, `claims.buyerId`, `claims.sellerId`, `users.email`.

### Real-world test

- [ ] Throttle to Slow 3G + Mid-tier CPU 4× slowdown. Walk through Discover → Claim. **Expect:** usable, no jank.

---

## TC-F4 · Mobile responsive sweep

For each Wave A-E page, test at:

- 360px (iPhone SE, smallest common)
- 768px (iPad portrait)
- 1280px (laptop)

Checklist per viewport:

- [ ] No horizontal scroll
- [ ] All text readable (no overlap, no tiny font)
- [ ] All buttons/links reachable with thumb (no nav under fold without scroll)
- [ ] Modals usable (don't extend past viewport)
- [ ] Forms usable (input zoom not triggered iOS Safari — `font-size: 16px+` on inputs)
- [ ] Tables either scroll horizontally with indicator OR collapse to card layout

Test orientation: portrait + landscape on 360px and 768px.

---

## TC-F5 · Cross-browser

Top 10 pages × browsers: Chrome 131, Safari 18, Firefox 132. Also iOS Safari on critical flows.

Top 10 pages: `/`, `/join`, `/buyer` Discover, `/buyer` Saved, `/buyer` Messages, item detail, claim modal, `/admin`, `/for-sellers`, `/faq`.

For each (page × browser):

- [ ] Renders correctly
- [ ] No console errors specific to that browser
- [ ] Real-time sockets work
- [ ] Form submission works

Common browser-specific traps to probe:

- Safari: date inputs, `appearance: none`, sticky positioning
- Firefox: flexbox edge cases, `gap` in flex
- iOS Safari: 100vh, address bar shifts, input zoom, scroll bouncing

---

## TC-F6 · Code-quality sweep

Run from `dropyard_frontend/` and `dropyard_backend/`:

### Dead code & duplicates

- [ ] `npx ts-prune` (or `knip`) — list of unused exports. Audit and remove.
- [ ] Search for `console.log`, `console.warn`, `// TODO`, `// FIXME`, `// HACK`. Remove or address.
- [ ] Identify the 3 buyer dashboards mentioned in [[dropyard-project-state]]: v1 in `components/previews/`, FINAL in `components/previews/`, dead inline in `app/buyer/page.tsx`. Pick one canonical, delete the others.
- [ ] Same audit for seller dashboard.
- [ ] Search for component duplicates: any two components with > 80% similar JSX should be unified.

### Imports & exports

- [ ] No unused imports (ESLint should catch with `no-unused-vars`).
- [ ] No re-exports kept "for backwards compatibility" with nothing importing.

### Types

- [ ] No `any` types in production code (search `: any` and `as any`).
- [ ] No `@ts-ignore` / `@ts-expect-error` without an explanation comment.

### Test coverage

- [ ] Run `npm run test` if test suites exist. **Expect:** all pass.
- [ ] Identify untested critical functions: dropCycle.ts phase logic, JWT signing/verification, claim transition state machine.

### Git hygiene

- [ ] No commented-out code blocks > 5 lines.
- [ ] No `.DS_Store`, `.idea/`, `Thumbs.db` committed.
- [ ] `.env` not in repo (confirm `git log --all --full-history -- .env` is empty).

---

## TC-F7 · Empty / loading / error states

For each major page in Wave A-E:

- [ ] **Loading state:** Throttle network to Slow 3G. Watch initial page load. **Expect:** skeleton/spinner, not blank screen.
- [ ] **Empty state:** Use a fresh account with no data. **Expect:** every list/grid shows a friendly empty state with CTA, not just "[]".
- [ ] **Error state:** Block the relevant API endpoint in DevTools. **Expect:** error UI ("Couldn't load — try again") with retry button. NEVER a blank screen or stack trace.
- [ ] **Offline state:** Set DevTools to Offline. **Expect:** "You're offline" banner. Cached data still readable if applicable.
- [ ] **Slow response (10s):** Mock API to delay 10s. **Expect:** loading state persists, no premature timeout error.
- [ ] **Server 500:** Force 500 from API. **Expect:** user-facing "Something went wrong, we're looking into it" — never raw stack trace.

---

## TC-F8 · First-time-user / fresh incognito

Run as a tester who has never used DropYard:

1. Open fresh incognito.
2. Land on `/`. Read everything. Does the value prop make sense in < 30s?
3. Click "Sign up". Complete signup form.
4. Land on onboarding (if any). Complete it without confusion.
5. Browse as a buyer for 2 minutes. Identify 3 items worth claiming.
6. Try to claim one. Hit any confusion → log as P2 UX bug.
7. Switch to seller mode (if applicable to this account). Try to list an item end-to-end.
8. Note any moment of "I don't know what to do next" — that's the bug.

This is a UX test, not a defect test. Findings are about clarity, friction, missing affordances.

---

## TC-F9 · SEO / meta tags

For each public page in Wave E (E1-E11):

- [ ] `<title>` tag present, unique per page, under 60 chars
- [ ] `<meta name="description">` present, unique per page, 150-160 chars
- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1">`
- [ ] `<link rel="canonical">` matches the actual URL (no trailing slash mismatch)
- [ ] `<meta property="og:title">`, `og:description`, `og:image`, `og:url`, `og:type`
- [ ] `<meta name="twitter:card" content="summary_large_image">` and twitter:* tags
- [ ] Structured data: at minimum, `Organization` schema on `/`, `WebSite` schema with sitelinks search
- [ ] `robots.txt` present and correct (allows public, disallows `/admin/`, `/api/`)
- [ ] `sitemap.xml` present and lists all public URLs
- [ ] `next-sitemap` or manual generation runs in build

---

## TC-F10 · Production-data smoke test

**Run only after Waves A-E and F1-F9 are all green.**

Two real (not demo) accounts, on two different devices, on the actual production URL.

1. You + a friend each sign up with real emails.
2. Friend (as seller) registers a moving sale. You (as admin) approve from your `/admin` panel.
3. Friend lists 2 items. You see them in Discover within 2s.
4. You claim 1 item. Friend confirms within 2 min.
5. You message the friend. They reply within 2 min.
6. Friend marks pickup complete.
7. You leave a review. Friend sees the review on their History.

Checklist throughout:

- [ ] No console errors
- [ ] No surprise 500s in Network
- [ ] No data leaks (you don't see other users' items in inappropriate places)
- [ ] No real-time event miss
- [ ] No charge surprises (if payments are integrated)
- [ ] Both users can sign out and sign back in cleanly

If this test passes end-to-end with zero P0/P1 issues, **DropYard is ready for general availability.**

---

# Running guide

## Time estimates per wave

| Wave | First run (with bugs) | Re-test pass | After all fixes |
|---|---|---|---|
| A — Foundation | 2 hours | 45 min | 30 min |
| B — Seller core | 6-8 hours | 2 hours | 1.5 hours |
| C — Buyer core | 5-7 hours | 1.5 hours | 1 hour |
| D — Admin | 3 hours | 1 hour | 45 min |
| E — Public | 4 hours | 1.5 hours | 1 hour |
| F — Cross-cutting | 6-10 hours | n/a | re-run on every release |

Total to first full-green: ~30-40 hours of testing time spread across A-F, depending on bug count.

## Tester workflow per session

1. Open `QA_MATRIX.md`. Find lowest-wave Not Started row.
2. Open `TEST_CASES.md`. Jump to the relevant TC.
3. Open fresh incognito + DevTools. Position 2 browsers side-by-side if real-time test.
4. Execute every step. Mark ✅/❌ per column in matrix.
5. Any ❌ → open `BUG_LOG.md`, copy the template, fill it, save. Note bug # in matrix.
6. After completing a row: re-read matrix progress summary, fix any P0/P1 bugs before next row.
7. End-of-day: commit `QA_MATRIX.md` + `BUG_LOG.md` updates to git so the team sees progress.

## Communication protocol

- **P0 bug** → message developer immediately. Halt testing on that wave.
- **P1 bug** → log, continue testing other unrelated rows.
- **P2/P3 bug** → log, batch for end-of-week review.
- **Re-test queue** → after a fix lands, the tester who found the bug re-runs the failing steps + the surrounding test case.

## When can we say "done"?

DropYard is ready for general availability when:

1. All 63 rows in `QA_MATRIX.md` show "Passed" status
2. `BUG_LOG.md` has zero Open / In Progress P0 or P1 bugs
3. TC-F10 (production-data smoke) is green
4. The 5 Playwright specs (signup, post-item, claim end-to-end, confirm-pickup, admin-approve-sale) are green in CI

Until all 4 conditions are met, the project is in QA. Once they are met, ship.
