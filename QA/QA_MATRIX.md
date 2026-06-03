# DropYard QA Matrix

**Single source of truth for pre-launch hardening.** Update inline as each cell is verified. One row per page / API group / cross-cutting concern.

**Legend:** ✅ Passed · ⏳ In progress · ❌ Failed (open bug in [BUG_LOG.md](./BUG_LOG.md)) · — Not applicable · ☐ Not started

**Status:** Not Started · In Progress · Passed · Blocked (waiting on bug fix)

**Quality bars per column:**
- **Manual** — clicked through golden path + named edge cases on Chrome desktop AND mobile viewport (360px)
- **Regression** — Playwright spec exists and is green in CI (top 5 critical flows only)
- **A11y** — passes axe-core scan + keyboard-only nav works + 4.5:1 contrast minimum
- **Security** — no OWASP top-10 finding; auth/authz enforced on every protected route
- **Code-quality** — no unused exports, no duplicate components, no `console.log`/dead branches/`// TODO` left

---

## Wave A — Foundation (gate everything else)

| # | Page / Surface | Test cases | Manual | Regression | A11y | Security | Code | Bugs | Status |
|---|---|---|---|---|---|---|---|---|---|
| A1 | `/join` — signup + login + role pick | TC-A1, A2, A3 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| A2 | `/admin/login` | TC-A4 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| A3 | Session refresh / JWT expiry | TC-A5 | ☐ | ☐ | — | ☐ | ☐ | 0 | Not Started |
| A4 | API: `/api/auth` (signup, login, refresh, /me, password) | TC-A6 | ☐ | ☐ | — | ☐ | ☐ | 0 | Not Started |

## Wave B — Seller core

| # | Page / Surface | Test cases | Manual | Regression | A11y | Security | Code | Bugs | Status |
|---|---|---|---|---|---|---|---|---|---|
| B1 | `/buyer` — Overview tab (seller mode) | TC-B1 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| B2 | `/buyer` — My Items tab (Drafts/Queued/Shelf/All) | TC-B2 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| B3 | `/buyer` — Orders/Claims tab | TC-B3 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| B4 | `/buyer` — Pickups tab | TC-B4 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| B5 | `/buyer` — Messages tab (seller side) | TC-B5 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| B6 | `/buyer` — History tab | TC-B6 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| B7 | `/buyer` — Settings tab | TC-B7 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| B8 | Create-item flow (incl. photo upload) | TC-B8 | ☐ | Playwright | ☐ | ☐ | ☐ | 0 | Not Started |
| B9 | Edit-item flow | TC-B9 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| B10 | Confirm-pickup flow (end-to-end) | TC-B10 | ☐ | Playwright | ☐ | ☐ | ☐ | 0 | Not Started |
| B11 | Moving-sale registration | TC-B11 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| B12 | API: `/api/items` (CRUD, recap, mine) | TC-B12 | ☐ | ☐ | — | ☐ | ☐ | 0 | Not Started |
| B13 | API: `/api/uploads` (S3 presign) | TC-B13 | ☐ | ☐ | — | ☐ | ☐ | 0 | Not Started |
| B14 | API: `/api/moving-sale` | TC-B14 | ☐ | ☐ | — | ☐ | ☐ | 0 | Not Started |
| B15 | API: `/api/drop` (cycle phase) | TC-B15 | ☐ | ☐ | — | ☐ | ☐ | 0 | Not Started |

## Wave C — Buyer core

| # | Page / Surface | Test cases | Manual | Regression | A11y | Security | Code | Bugs | Status |
|---|---|---|---|---|---|---|---|---|---|
| C1 | `/buyer` — Discover tab | TC-C1 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| C2 | `/buyer` — Saved tab | TC-C2 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| C3 | `/buyer` — Claims tab (buyer side) | TC-C3 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| C4 | `/buyer` — Messages tab (buyer side) | TC-C4 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| C5 | `/buyer` — History tab (buyer side) | TC-C5 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| C6 | Item detail view (modal/page) | TC-C6 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| C7 | Claim flow end-to-end | TC-C7 | ☐ | Playwright | ☐ | ☐ | ☐ | 0 | Not Started |
| C8 | Cancel-claim flow (buyer) | TC-C8 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| C9 | Watchlist save/unsave | TC-C9 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| C10 | Real-time socket events (both sides) | TC-C10 | ☐ | ☐ | — | ☐ | ☐ | 0 | Not Started |
| C11 | API: `/api/claims` | TC-C11 | ☐ | ☐ | — | ☐ | ☐ | 0 | Not Started |
| C12 | API: `/api/watchlist` | TC-C12 | ☐ | ☐ | — | ☐ | ☐ | 0 | Not Started |
| C13 | API: `/api/conversations` | TC-C13 | ☐ | ☐ | — | ☐ | ☐ | 0 | Not Started |

## Wave D — Admin

| # | Page / Surface | Test cases | Manual | Regression | A11y | Security | Code | Bugs | Status |
|---|---|---|---|---|---|---|---|---|---|
| D1 | `/admin` — dashboard root | TC-D1 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| D2 | `/admin/inbox` | TC-D2 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| D3 | `/admin/moving-sales` | TC-D3 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| D4 | `/admin/users` | TC-D4 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| D5 | Approve-moving-sale flow | TC-D5 | ☐ | Playwright | ☐ | ☐ | ☐ | 0 | Not Started |
| D6 | Suspend-user flow | TC-D6 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| D7 | API: `/api/admin` | TC-D7 | ☐ | ☐ | — | ☐ | ☐ | 0 | Not Started |
| D8 | API: `/api/submissions` | TC-D8 | ☐ | ☐ | — | ☐ | ☐ | 0 | Not Started |

## Wave E — Public / marketing / legal

| # | Page / Surface | Test cases | Manual | Regression | A11y | Security | Code | Bugs | Status |
|---|---|---|---|---|---|---|---|---|---|
| E1 | `/` (homepage) | TC-E1 | ☐ | ☐ | ☐ | ☐ | ☐ | 0 | Not Started |
| E2 | `/about` | TC-E2 | ☐ | — | ☐ | — | ☐ | 0 | Not Started |
| E3 | `/contact` | TC-E3 | ☐ | — | ☐ | ☐ | ☐ | 0 | Not Started |
| E4 | `/faq` | TC-E4 | ☐ | — | ☐ | — | ☐ | 0 | Not Started |
| E5 | `/for-buyers` | TC-E5 | ☐ | — | ☐ | — | ☐ | 0 | Not Started |
| E6 | `/for-sellers` | TC-E6 | ☐ | — | ☐ | — | ☐ | 0 | Not Started |
| E7 | `/how-it-works` | TC-E7 | ☐ | — | ☐ | — | ☐ | 0 | Not Started |
| E8 | `/help-center` | TC-E8 | ☐ | — | ☐ | — | ☐ | 0 | Not Started |
| E9 | `/privacy-policy` | TC-E9 | ☐ | — | ☐ | — | — | 0 | Not Started |
| E10 | `/community-guidelines` | TC-E10 | ☐ | — | ☐ | — | — | 0 | Not Started |
| E11 | `/terms-of-service` | TC-E11 | ☐ | — | ☐ | — | — | 0 | Not Started |
| E12 | Global header / nav | TC-E12 | ☐ | — | ☐ | — | ☐ | 0 | Not Started |
| E13 | Global footer | TC-E13 | ☐ | — | ☐ | — | ☐ | 0 | Not Started |

## Wave F — Cross-cutting (run last)

| # | Concern | Scope | Status | Bugs |
|---|---|---|---|---|
| F1 | Security audit | Extends [[security-checklist]] — re-verify all 20 items + new code added since 2026-05-28 | Not Started | 0 |
| F2 | Accessibility audit | axe-core scan on every Wave A-E page + keyboard-only nav + screen-reader smoke (NVDA or VoiceOver) on 3 critical flows | Not Started | 0 |
| F3 | Performance audit | Lighthouse on top 5 pages (target LCP < 2.5s, CLS < 0.1, bundle < 250KB initial), Prisma slow-query scan | Not Started | 0 |
| F4 | Mobile responsive sweep | 360 / 768 / 1280 px on every Wave A-E page; portrait + landscape | Not Started | 0 |
| F5 | Cross-browser | Chrome / Safari / Firefox on top 10 pages; iOS Safari on critical flows | Not Started | 0 |
| F6 | Code-quality sweep | Remove dead code, duplicate components (e.g. 3 buyer dashboards per [[dropyard-project-state]]), unused exports/imports, `console.log`, `// TODO` | Not Started | 0 |
| F7 | Empty/loading/error states | Slow 3G throttling on every Wave A-E page; force network errors; observe skeletons/spinners/error messages | Not Started | 0 |
| F8 | First-time-user / fresh incognito | Clear cookies+localStorage, walk through signup → first item → first claim | Not Started | 0 |
| F9 | SEO/meta tags | `<title>`, `<meta description>`, OpenGraph tags, canonical URLs on all 8 marketing + 3 legal pages | Not Started | 0 |
| F10 | Production data smoke | After all above passes, run a real end-to-end flow on prod with 2 real accounts (you + a friend), in 2 browsers, simultaneously | Not Started | 0 |

---

## Progress summary

| Wave | Total rows | Passed | In progress | Blocked | Not started |
|---|---|---|---|---|---|
| A — Foundation | 4 | 0 | 0 | 0 | 4 |
| B — Seller | 15 | 0 | 0 | 0 | 15 |
| C — Buyer | 13 | 0 | 0 | 0 | 13 |
| D — Admin | 8 | 0 | 0 | 0 | 8 |
| E — Public | 13 | 0 | 0 | 0 | 13 |
| F — Cross-cutting | 10 | 0 | 0 | 0 | 10 |
| **Total** | **63** | **0** | **0** | **0** | **63** |

## How to use this matrix

1. Pick the next row with status "Not Started" in the lowest active wave.
2. Open `TEST_CASES.md` and execute every TC- listed in the row.
3. For each column you're testing: mark ☐ → ⏳ while working → ✅ if pass, ❌ if bug found.
4. If ❌: open a row in `BUG_LOG.md`, copy the bug number into the matrix Bugs column.
5. Don't advance to the next wave until the current wave has zero P0/P1 open bugs.
6. Once all 63 rows are ✅ (or — where N/A), the row reads "Passed". Project ready for general availability.
