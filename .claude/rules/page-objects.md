---
paths:
  - "src/pages/**/*.ts"
---

# Page Object Rules

These rules apply when editing any file in `src/pages/`.

## Class structure

- Every class must extend `BasePage` from `./base.page`
- Constructor signature: `constructor(page: Page, config: SiteConfig)`
- Call `super(page, config)` as the first statement
- All locators are `readonly Locator` properties defined in the constructor body

## Locators

- Prefer semantic selectors: `getByRole()`, `getByLabel()`, `getByText()`
- Use `page.locator()` only when ARIA/role selectors are unavailable
- Never use `page.waitForTimeout()` inside page objects — rely on Playwright auto-waiting
- All `Locator` properties must be typed explicitly as `readonly Locator`

## Methods

- Methods represent user actions: `openMobileMenu()`, `getNavLinks()`, `findContactForm()`
- Return the most specific useful type: `Locator`, `string`, `boolean`, `string[]`
- Use `async/await` throughout — no `.then()` chains
- No `expect()` calls inside page objects — assertions belong in test files only
- Declare explicit return types on all public methods

## Imports

Use path aliases — not relative paths that go up more than one directory level:

```typescript
import { BasePage } from '@pages/base.page';           // CORRECT
import type { SiteConfig } from '@site-types/site-config.types';  // CORRECT
import { BasePage } from '../../pages/base.page';       // WRONG
```

## Example

```typescript
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class ExamplePage extends BasePage {
  readonly heading: Locator;
  readonly ctaButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heading = page.locator('h1').first();
    this.ctaButton = page.getByRole('link', { name: /get started/i });
  }

  async getHeadingText(): Promise<string> {
    return (await this.heading.textContent()) ?? '';
  }

  async isCtaVisible(): Promise<boolean> {
    return this.ctaButton.isVisible();
  }
}
```
