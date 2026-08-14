---
paths:
  - "tests/**/*.spec.ts"
---

# Test Writing Rules

These rules apply when editing any file in `tests/`.

## Imports

Always import from the custom fixture — never directly from `@playwright/test`:

```typescript
// CORRECT
import { test, expect } from '@fixtures/site.fixture';

// WRONG — do not import directly from Playwright
import { test, expect } from '@playwright/test';
```

## Tagging

Every test must include at least one tag in the test name string:

```typescript
test('homepage hero heading is visible @functional', async ({ datagencePage }) => { ... });
test('all nav links resolve without 404 @navigation', async ({ navigationPage }) => { ... });
```

Valid tags: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`

## Test independence

- Tests must not depend on execution order
- Tests must not share mutable page state
- Each test navigates to its required URL in `beforeEach` or in the test body
- Tests that cannot run under certain conditions must call `test.skip()` with a reason

## Selectors in tests

Never call `page.locator()` directly in the test body. Use page object methods:

```typescript
// CORRECT — use the page object
test('hero heading is present @functional', async ({ datagencePage }) => {
  const text = await datagencePage.getHeroText();
  expect(text.length).toBeGreaterThan(0);
});

// WRONG — raw locator in test body
test('hero heading is present @functional', async ({ page }) => {
  const heading = page.locator('h1');  // should be in a page object
  await expect(heading).toBeVisible();
});
```

## Waiting

- Use Playwright auto-waiting (it is built into `expect`, `click`, `fill`, etc.)
- Use `waitForLoadState()` or `waitForSelector()` when you need explicit waits
- Never use `page.waitForTimeout()` — it creates flakiness

## What never to do

- Never submit a form (no POST requests triggered by test actions)
- Never hardcode `https://datagence.io` — use `siteConfig.url` or the `baseURL` config
- Never enter real credentials or create accounts
- Never use `page.waitForTimeout()`
- Never put assertions inside page object methods
