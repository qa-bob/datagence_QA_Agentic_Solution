# SKILLS.md — Skills & Slash Command Catalog

Slash commands and sub-agents available in this repository when using Claude Code.

---

## Slash Commands

### `/analyze-site`

**File:** `.claude/commands/analyze-site.md`

Crawls the live site defined in `site.config.json` and produces a fully-populated config.

**When to use:**
- Onboarding this site for the first time
- After a site redesign to refresh `site.config.json`
- Before running `/generate-full-suite` to ensure config is current

**What it does:**
1. Navigates to the site URL with `waitUntil: networkidle`
2. Extracts title, meta description, nav links, form presence, headings, and CTAs
3. Outputs an updated `site.config.json` and a list of any discovered issues

---

### `/run-smoke`

**File:** `.claude/commands/run-smoke.md`

Runs `@smoke` tests and displays a formatted pass/fail summary.

**When to use:**
- Quick health check on the site
- After making changes to smoke tests
- As a pre-merge gate check

**What it does:**
1. Runs `npm run test:smoke`
2. Parses `test-results/results.json`
3. Displays a table with test names, status, and duration
4. For failures, shows the error message and a suggested fix

---

### `/update-baseline`

**File:** `.claude/commands/update-baseline.md`

Captures new visual regression baseline screenshots.

**When to use:**
- After intentional design changes to datagence.io
- After updating viewport sizes in `playwright.config.ts`
- First-time setup before running `@visual` tests

**What it does:**
1. Runs `npm run baseline` (`playwright test --grep @visual --update-snapshots`)
2. Lists updated files from `__snapshots__/`
3. Reminds you to review screenshots before committing

---

### `/generate-report`

**File:** `.claude/commands/generate-report.md`

Parses test results and opens the Playwright HTML report.

**When to use:**
- After a full test run to review results
- When sharing a results summary with stakeholders

**What it does:**
1. Parses `test-results/results.json`
2. Displays a table of results grouped by suite tag
3. Lists failed and flaky tests with error messages and suggestions

---

### `/generate-full-suite`

Analyzes the live site and generates a complete POM + test suite from scratch.

**When to use:**
- First-time setup for a new site
- After a major site redesign that breaks existing selectors

**What it does:**
1. Runs `/analyze-site` to populate `site.config.json`
2. Generates page object classes for all discovered pages
3. Writes test files for smoke, navigation, forms, functional, visual, and responsive suites
4. Runs `npx tsc --noEmit` to verify TypeScript compiles

---

## Sub-Agents

### `site-analyzer`

**File:** `.claude/agents/site-analyzer.md`

Crawls a live website and produces a valid `site.config.json`. Invoked automatically by `/analyze-site` and `/generate-full-suite`.

**Capabilities:**
- Navigate to URLs and wait for SPA hydration
- Extract nav links, forms, headings, and meta tags
- Dismiss cookie consent banners before inspection
- Detect auth-gated content and set `auth.required: true`
- Follow redirect chains to find canonical URL

---

### `test-generator`

**File:** `.claude/agents/test-generator.md`

Reads `site.config.json` and generates site-specific Playwright test files in `tests/custom/`.

**Capabilities:**
- Read and parse `site.config.json`
- Generate valid TypeScript Playwright test files
- Apply correct `@tag` annotations to all tests
- Follow POM conventions (selectors in page objects, not specs)
- Identify gaps in the shared test suites for site-specific coverage

---

## Path-Scoped Rules

Rules in `.claude/rules/` load automatically when Claude Code edits matching files:

| File | Triggers when editing | Purpose |
|------|----------------------|---------|
| `.claude/rules/page-objects.md` | `src/pages/**/*.ts` | POM conventions, locator strategy, class structure |
| `.claude/rules/testing.md` | `tests/**/*.spec.ts` | Test writing rules, fixture imports, tagging |
| `.claude/rules/typescript.md` | `**/*.ts` | TypeScript strict-mode requirements, path aliases |

---

## Adding a New Skill

1. Create `.claude/commands/<skill-name>.md` with instructions in markdown
2. Add an entry to this `SKILLS.md` file
3. Reference it in `CLAUDE.md` under the Slash Commands table
