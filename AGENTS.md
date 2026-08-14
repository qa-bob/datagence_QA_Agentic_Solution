# AGENTS.md

Rules and conventions for all AI coding agents working in this repository.

This file is read by Claude Code, GitHub Copilot, OpenAI Codex, Devin, Cursor, and other AI development tools. Claude Code imports this file via `CLAUDE.md`.

---

## Repository Purpose

This is a **Playwright + TypeScript automated test suite** for [https://datagence.io](https://datagence.io), the public marketing website for Datagence — a B2B healthcare data governance company. Tests cover all discoverable public features without requiring authentication or form submission.

---

## Architecture

### Page Object Model (POM)

Every page or major section of the site has its own class in `src/pages/`. All classes extend `BasePage`.

```
src/pages/
  base.page.ts         # BasePage — shared navigation, screenshot, layout helpers
  home.page.ts         # HomePage — hero, headings, CTA buttons
  navigation.page.ts   # NavigationPage — nav visibility, links, mobile menu
  contact.page.ts      # ContactFormPage — form detection, fields, validation
  datagence.page.ts    # DatagencePage — site-specific: Polus features, stats, outcomes
```

**POM rules:**
- Locators are `readonly Locator` properties defined in the constructor
- Methods represent user actions: `openMobileMenu()`, `getNavLinks()`, `findContactForm()`
- No `expect()` calls inside page objects — assertions belong in test files only
- Page objects receive `Page` and `SiteConfig` via constructor, call `super(page, config)`

### Tests

```
tests/
  smoke/        # @smoke — fast site availability and load checks
  navigation/   # @navigation — nav links, routing, mobile menus
  forms/        # @forms — form fields, labels, HTML5 validation
  functional/   # @functional — business logic: hero, features, CTAs, statistics
  visual/       # @visual — screenshot regression
  responsive/   # @responsive — viewport layout checks
```

**Test rules:**
- Import `{ test, expect }` from `@fixtures/site.fixture`, not from `@playwright/test`
- Tag every test with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- Never hardcode URLs — use `baseURL` from Playwright config (reads `site.config.json`)
- Use page object methods — not raw `page.locator()` calls in the test body
- Each test must be independent (no shared state between tests)

### TypeScript

- Strict mode is enabled in `tsconfig.json`
- All page object properties must be typed
- No implicit `any` — use explicit types
- Verify with `npx tsc --noEmit` before finishing any task

### Site Configuration

The site under test is defined in `site.config.json`:

```json
{
  "name": "Datagence",
  "url": "https://datagence.io",
  "hasContactForm": true,
  "viewports": ["desktop", "mobile", "tablet"],
  "skipVisual": false,
  "skipForms": false,
  "auth": { "required": false }
}
```

Always read `site.config.json` first before writing tests or selectors.

---

## Absolute Rules

| Rule | Reason |
|------|--------|
| Never submit forms | Avoids sending spam or triggering backend processes |
| Never create accounts or log in | Not needed for public site testing |
| Never hardcode the base URL in tests | URL must come from `site.config.json` via `baseURL` |
| No `expect()` in page objects | Keeps assertions in test scope, not page scope |
| No `page.waitForTimeout()` | Use Playwright auto-waiting or `waitForSelector` instead |
| No `any` type without comment justification | TypeScript strict mode is enforced |
| No raw `page.locator()` calls in test bodies | All selectors belong in page object classes |

---

## Key Files

| File | Purpose |
|------|---------|
| `site.config.json` | Site URL and feature flags — read this first |
| `playwright.config.ts` | Browser projects (desktop, mobile, tablet), timeouts, reporters |
| `src/fixtures/site.fixture.ts` | Custom `test` extending Playwright with pre-built page objects |
| `src/types/site-config.types.ts` | `SiteConfig` TypeScript interface |
| `src/utils/link-checker.ts` | HTTP link reachability helper |
| `src/utils/visual-helper.ts` | Cookie banner dismissal, screenshot helpers |
| `CLAUDE.md` | Claude Code-specific instructions (imports this file) |
| `SKILLS.md` | Skill and slash command catalog |

---

## Workflow — Writing or Updating Tests

1. Read `site.config.json` to get the site URL and flags
2. Inspect the live site before writing any selectors (use a browser tool or web fetch)
3. Write real selectors based on actual HTML — not generic placeholders
4. Create or update the relevant page object in `src/pages/`
5. Write tests using the page object via the custom fixture
6. Run `npx tsc --noEmit` to verify TypeScript compiles cleanly
7. Run `npm run test:smoke` to confirm no regressions

---

## npm Commands

```bash
npm test                    # Full suite
npm run test:smoke          # @smoke only
npm run test:navigation     # @navigation only
npm run test:forms          # @forms only
npm run test:visual         # @visual only (requires baselines)
npm run test:responsive     # @responsive only
npm run baseline            # Update visual snapshots
npm run typecheck           # TypeScript check
npm run lint                # ESLint
```

---

## Path Alias Reference

Use these aliases — never long relative imports:

| Alias | Resolves to |
|-------|------------|
| `@pages/*` | `src/pages/*` |
| `@fixtures/*` | `src/fixtures/*` |
| `@utils/*` | `src/utils/*` |
| `@site-types/*` | `src/types/*` |

---

## Test Tag Reference

| Tag | When to use |
|-----|-------------|
| `@smoke` | Site loads, HTTPS, title, no critical JS errors |
| `@navigation` | Nav links, mobile menu, routing, logo link |
| `@forms` | Form fields, labels, HTML5 validation (never submission) |
| `@functional` | Business logic: hero content, Polus features, CTAs, statistics |
| `@visual` | Screenshot regression with `toHaveScreenshot()` |
| `@responsive` | Viewport layout, font sizes, image alt text |
