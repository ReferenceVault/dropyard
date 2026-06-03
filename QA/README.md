# DropYard QA — Pre-launch hardening

Three files, one mission: ship a build that real users can't break.

## The three artifacts

| File | Purpose | Updated when |
|---|---|---|
| [QA_MATRIX.md](./QA_MATRIX.md) | The dashboard — every page/API/concern as one row, status per quality bar | After every test session (mark ☐ → ✅ / ❌) |
| [TEST_CASES.md](./TEST_CASES.md) | The procedure — step-by-step click scripts, written for a tester unfamiliar with the code | Once per wave (authored just before that wave runs) |
| [BUG_LOG.md](./BUG_LOG.md) | The defect register — every bug found, fix commit, status | When a bug is found, fixed, or re-verified |

## How a testing session works

1. Open `QA_MATRIX.md`. Find the next "Not Started" row in the lowest active wave.
2. Open `TEST_CASES.md`. Run every `TC-` listed in the row's "Test cases" column.
3. As you execute each step, mentally compare actual vs "Expect".
4. Pass → mark the matrix column ✅. Fail → file a row in `BUG_LOG.md` with the exact step, screenshot, console output. Mark matrix column ❌.
5. Don't move to the next wave until the current one has zero open P0/P1 bugs.

## The order matters

Waves are gated. Wave A breakages block Wave B; you can't test "claim flow" if "login" is broken. Always work top-down. Cross-cutting Wave F (security, a11y, perf) runs last because it audits the *current* state — if you do it before Wave A fixes land, you re-audit afterward anyway.

## Quality bars

A column reads ✅ only when ALL of these are true for that row:

- **Manual:** golden path + every named edge case verified on Chrome desktop AND mobile (360px viewport)
- **Regression:** Playwright spec authored, committed, green in CI (for the 5 flows that get automation)
- **A11y:** axe-core scan clean + tab-only navigation reaches every interactive element + WCAG AA contrast
- **Security:** no OWASP top-10 finding; auth/authz enforced; no PII or secrets in responses
- **Code-quality:** no dead code/duplicate components/`console.log`/unused exports/dangling `// TODO`

Anything less is ⏳ "in progress", not done.

## Test accounts

All demo accounts share password `Demo@1234`. From [`prisma/seedDemo.ts`](../../dropyard_backend/prisma/seedDemo.ts):

- **Seller:** `demo-seller@dropyard.local` (Avery Demo)
- **Buyers:** sarah / james / priya / tom / david / hassan / lindsay `.demo@dropyard.local`
- **Admin:** `info@asvntech.com` / `Apple@1234`

Re-seed dev DB any time with `npx tsx prisma/seedDemo.ts` from `dropyard_backend/`.

## Conventions

- Bug IDs are zero-padded: BUG-001, BUG-002, ...
- Test case IDs are wave-prefixed: TC-A1, TC-B7, TC-F3
- Severity is one of P0 / P1 / P2 / P3 (defined in `BUG_LOG.md`)
- Update matrix progress summary table at the bottom of `QA_MATRIX.md` after each session

## Definition of done (project-wide)

When all 63 rows in `QA_MATRIX.md` show "Passed" status, AND `BUG_LOG.md` has zero Open / In Progress P0 or P1 bugs, AND the prod-data smoke test (F10) is green — **DropYard is ready for general availability.**
