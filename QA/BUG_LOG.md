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

_None yet._

## Recently closed

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
