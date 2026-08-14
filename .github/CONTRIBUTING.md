# Contributing

This repository is a Playwright + TypeScript test suite for [https://datagence.io](https://datagence.io). All contributions must maintain the existing architecture and quality standards.

---

## Getting Started

See [README.md](../README.md) for full setup instructions. Quick start:

```bash
npm install
npx playwright install chromium
npm run typecheck   # Verify TypeScript before starting
npm run test:smoke  # Confirm the site is reachable
```

---

## Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| New tests | `test/<feature>` | `test/polus-features` |
| Bug fix | `fix/<description>` | `fix/mobile-nav-toggle` |
| Refactor | `refactor/<area>` | `refactor/base-page` |
| Chore | `chore/<task>` | `chore/update-playwright` |

---

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
test(functional): add Polus HCP features section tests
fix(navigation): handle mobile nav toggle when CSS-only
chore(deps): upgrade @playwright/test to 1.45.0
refactor(base-page): extract screenshot helper into visual-helper utility
```

---

## Pull Request Process

1. **Branch from `main`** — never commit directly to `main`
2. **One concern per PR** — don't mix new tests with framework refactors
3. **TypeScript must compile:** `npm run typecheck` must pass
4. **Lint must pass:** `npm run lint` must pass
5. **Smoke tests must pass:** `npm run test:smoke` must pass against `https://datagence.io`
6. **Fill out the PR template** — describe what was added and how to verify it
7. **Get at least one approval** before merging

---

## Code Style

### Page Objects

Every page object class must:
- Live in `src/pages/` and extend `BasePage`
- Declare all locators as `readonly Locator` properties
- Define locators in the constructor (not in methods)
- Only contain methods that represent user actions
- Never contain `expect()` assertions

```typescript
// CORRECT
export class DatagencePage extends BasePage {
  readonly heroHeading: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heroHeading = page.locator('h1').first();
  }

  async getHeroText(): Promise<string> {
    return (await this.heroHeading.textContent()) ?? '';
  }
}

// WRONG — raw locator in test body
test('hero is present', async ({ page }) => {
  const heading = page.locator('h1').first(); // use a page object method instead
});
```

### Tests

- Import `{ test, expect }` from `@fixtures/site.fixture`, not `@playwright/test`
- Tag every test with at least one suite tag in the test name string
- Keep tests independent — no shared mutable state between tests
- Use descriptive names that describe the expected outcome

```typescript
// CORRECT
import { test, expect } from '@fixtures/site.fixture';

test('homepage hero heading is not empty @functional', async ({ datagencePage }) => {
  const text = await datagencePage.getHeroText();
  expect(text.length).toBeGreaterThan(0);
});

// WRONG — unclear name, wrong import
import { test, expect } from '@playwright/test';
test('check heading', async ({ page }) => { ... });
```

### TypeScript

- Use path aliases — not long relative imports
- Declare return types on all public page object methods
- Handle `null | undefined` explicitly — don't use `!` blindly

```typescript
// CORRECT
import { BasePage } from '@pages/base.page';
async getNavLinks(): Promise<Array<{ text: string; href: string }>> { ... }

// WRONG
import { BasePage } from '../../src/pages/base.page';
async getNavLinks() { ... }
```

---

## Test Tagging Reference

Every test must have at least one tag in its name string:

| Tag | When to use |
|-----|-------------|
| `@smoke` | Site loads, HTTPS, title present, no critical JS errors |
| `@navigation` | Nav links, mobile menu, routing, logo link |
| `@forms` | Form fields, labels, HTML5 validation (never submission) |
| `@functional` | Business logic: hero content, Polus features, CTAs, statistics |
| `@visual` | Screenshot regression with `toHaveScreenshot()` |
| `@responsive` | Viewport layout, font sizes, image accessibility |

---

## What to Avoid

| Action | Why |
|--------|-----|
| Submitting any form | Avoids sending real data to backend systems |
| Creating accounts or logging in | Not needed for public site testing |
| Hardcoding `https://datagence.io` | URL must come from `site.config.json` |
| Using `page.waitForTimeout()` | Use Playwright auto-waiting instead |
| Putting `expect()` in page objects | Assertions belong in test files |
| Using `any` type | TypeScript strict mode is enforced |

---

## Pre-Submit Checklist

Run these before opening a PR:

```bash
npm run typecheck    # Must pass — no TypeScript errors
npm run lint         # Must pass — no lint errors
npm run test:smoke   # Must pass — site reachable and loads correctly
```

---

## Questions

Open a GitHub issue with the `question` label, or comment on the relevant PR.
