## What this PR does

<!-- Describe the tests added, changed, or fixed. Be specific: which pages, which features. -->

## Why

<!-- Link the issue or explain the motivation. What gap in coverage does this fill? -->

Closes #

## Test files changed

<!-- List each test file and the key scenarios it covers -->

- [ ] `tests/` — 

## Page objects changed

<!-- List any page object classes added or modified -->

- [ ] `src/pages/` — 

## Verification checklist

**Required — all must be checked before merging:**

- [ ] `npm run typecheck` passes (no TypeScript errors)
- [ ] `npm run lint` passes (no ESLint errors)
- [ ] `npm run test:smoke` passes against `https://datagence.io`
- [ ] All new tests are tagged with at least one of `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- [ ] Selectors are in page object classes — no raw `page.locator()` calls in test bodies
- [ ] No form is submitted, no account created, no real credentials entered
- [ ] No URL is hardcoded — `baseURL` or `siteConfig.url` used throughout

## Visual baseline changes

<!-- If this PR updates visual baselines, attach before/after screenshots. Otherwise write N/A. -->

N/A

## Notes for reviewers

<!-- Anything the reviewer should know: edge cases, known flakiness, site behavior worth noting -->
