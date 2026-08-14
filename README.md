# Datagence — QA Agentic Solution

Playwright + TypeScript automated test suite for [datagence.io](https://datagence.io), powered by Claude Code. Tests cover smoke availability, navigation, forms, functional business logic, visual regression, and responsive layout — without requiring account creation or form submission.

---

## Purpose

This repository provides a comprehensive GUI and regression test suite for the Datagence marketing website. It is structured for **agentic execution** by Claude Code using **Page Object Model (POM)** architecture and **Object-Oriented Programming (OOP)** patterns.

**What is tested:** Every discoverable public feature of [https://datagence.io](https://datagence.io).
**What is not tested:** Authentication flows, form submission, or any action requiring account creation.

---

## Architecture

```
site.config.json            # Site URL, flags (hasContactForm, skipVisual, etc.)
playwright.config.ts        # Playwright projects: chromium-desktop, mobile-chrome, tablet
src/
  pages/                    # Page Object Model classes (one per page/section)
    base.page.ts            # BasePage — shared navigation, screenshot, element helpers
    home.page.ts            # HomePage — hero, headings, CTA buttons
    navigation.page.ts      # NavigationPage — nav visibility, links, mobile menu
    contact.page.ts         # ContactFormPage — form detection, fields, validation
    datagence.page.ts       # DatagencePage — site-specific: Polus features, stats, outcomes
  fixtures/
    site.fixture.ts         # Extends Playwright `test` with pre-built page objects
  utils/
    link-checker.ts         # HTTP reachability helper
    visual-helper.ts        # Cookie banner dismissal, screenshot helpers
  types/
    site-config.types.ts    # SiteConfig TypeScript interface
tests/
  smoke/                    # @smoke — site availability, HTTPS, load time, console errors
  navigation/               # @navigation — nav links, mobile menu, logo link
  forms/                    # @forms — contact form fields, labels, HTML5 validation
  functional/               # @functional — business logic: hero, Polus features, CTAs
  visual/                   # @visual — screenshot regression across viewports
  responsive/               # @responsive — mobile layout, image alt text, viewport meta
.claude/
  agents/                   # Claude Code sub-agent definitions
  commands/                 # Slash command definitions (skill files)
  rules/                    # Path-scoped instruction rules (loaded automatically)
CLAUDE.md                   # Claude Code project instructions
AGENTS.md                   # AI agent rules (shared across all AI coding tools)
SKILLS.md                   # Skill and slash command catalog
```

### Design Principles

| Principle | Implementation |
|-----------|---------------|
| Page Object Model | One class per page/section in `src/pages/`. Locators are `readonly Locator` properties. Methods represent user actions. |
| OOP encapsulation | All page state lives in the class. Tests call methods, not `page.locator()` directly. |
| No assertions in POMs | `expect()` calls belong in test files only. |
| No hardcoded URLs | Always use `baseURL` from `playwright.config.ts` (reads `site.config.json`). |
| No form submission | Test field interaction and validation only — never click submit. |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [Git](https://git-scm.com/)
- [Claude Code](https://claude.ai/code) (optional — for agentic test generation and execution)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd datagence_QA_Agentic_Solution

# 2. Install Node.js dependencies
npm install

# 3. Install Playwright browsers
npx playwright install chromium
```

### Environment Configuration

Copy `.env.example` to `.env` and fill in any overrides:

```bash
cp .env.example .env
```

The site URL is read from `site.config.json`. You can override it at runtime:

```bash
SITE_URL=https://staging.datagence.io npx playwright test
```

---

## Running Tests

```bash
# Run the full test suite
npm test

# Run by category
npm run test:smoke          # Fast availability checks (run first in CI)
npm run test:navigation     # Nav links, mobile menu, routing
npm run test:forms          # Contact form fields and validation
npm run test:visual         # Screenshot regression (requires baselines)
npm run test:responsive     # Layout at mobile/tablet/desktop

# Run with browser visible
npm run test:headed

# Open the interactive HTML report
npm run report

# TypeScript type check (run before committing)
npm run typecheck

# Lint
npm run lint
```

### Update Visual Baselines

Run this after intentional design changes:

```bash
npm run baseline
```

Review updated screenshots in `__snapshots__/` before committing.

---

## Claude Code Skills

When using [Claude Code](https://claude.ai/code), these slash commands are available:

| Command | Description |
|---------|-------------|
| `/analyze-site` | Crawl the live site and update `site.config.json` |
| `/run-smoke` | Run smoke tests and display a pass/fail summary |
| `/update-baseline` | Refresh visual regression baseline screenshots |
| `/generate-report` | Parse results and display a structured test summary |
| `/generate-full-suite` | Analyze the site and generate full POM + test suite |

See [SKILLS.md](./SKILLS.md) for the full skill catalog and sub-agent descriptions.

---

## Claude Code Sub-Agents

Two sub-agents are defined for agentic tasks:

| Agent | File | Purpose |
|-------|------|---------|
| `site-analyzer` | `.claude/agents/site-analyzer.md` | Crawls a live site and produces a populated `site.config.json` |
| `test-generator` | `.claude/agents/test-generator.md` | Reads `site.config.json` and generates site-specific Playwright tests |

---

## CI/CD

GitHub Actions runs on every pull request and push to `main`:

| Trigger | Job | What runs |
|---------|-----|-----------|
| Pull request | `smoke` | `@smoke` tests only (fast gate, ~30 seconds) |
| Push to `main` | `full-suite` | Full suite + typecheck + lint |

Test reports are uploaded as GitHub Actions artifacts on every run.

See `.github/workflows/playwright.yml`.

---

## Contributor Guide

See [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md) for full guidelines. Quick summary:

1. **Branch naming:** `test/<feature>`, `fix/<issue>`, `chore/<task>`
2. **One concern per PR** — don't mix test additions with framework changes
3. **TypeScript must compile:** `npm run typecheck` must pass before pushing
4. **POM rules:** Every new selector belongs in a page object class, not in the test body
5. **No submission:** Never submit forms, create accounts, or enter real credentials
6. **Tag every test:** At least one of `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`

---

## AI Coding Agent Rules

All AI coding tools (Claude Code, GitHub Copilot, Cursor, Devin, etc.) must follow the rules in [AGENTS.md](./AGENTS.md).

Claude Code additionally reads [CLAUDE.md](./CLAUDE.md) for project-specific instructions and slash commands.

### Path-Scoped Rules

Detailed rules for specific areas of the codebase are in `.claude/rules/`:

| File | Scope | Content |
|------|-------|---------|
| `page-objects.md` | `src/pages/**/*.ts` | POM conventions and locator strategies |
| `testing.md` | `tests/**/*.spec.ts` | Test writing rules and tagging requirements |
| `typescript.md` | `**/*.ts` | TypeScript strict-mode requirements |

---

## Test Tag Reference

| Tag | Description | Location |
|-----|-------------|----------|
| `@smoke` | Site loads, HTTPS, title, no critical JS errors | `tests/smoke/` |
| `@navigation` | Nav links, routing, mobile menu | `tests/navigation/` |
| `@forms` | Form fields, labels, HTML5 validation | `tests/forms/` |
| `@functional` | Business logic: hero content, Polus features, CTAs | `tests/functional/` |
| `@visual` | Screenshot regression with `toHaveScreenshot()` | `tests/visual/` |
| `@responsive` | Viewport layout, font sizes, image alt text | `tests/responsive/` |

---

## Site Under Test

| Property | Value |
|----------|-------|
| Company | Datagence |
| URL | https://datagence.io |
| Industry | Healthcare data governance |
| Auth required | No |
| Contact form | Yes |

---

*Part of the Phoenix Startup QA Agentic Solutions project.*
