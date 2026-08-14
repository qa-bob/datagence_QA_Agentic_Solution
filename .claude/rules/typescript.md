---
paths:
  - "**/*.ts"
---

# TypeScript Rules

These rules apply to all `.ts` files in this project.

## Strict mode

`tsconfig.json` has `"strict": true`. This means:
- No implicit `any` — all types must be declared or inferable
- Strict null checks — handle `null | undefined` explicitly
- Strict function types — parameter and return types must match

## Path aliases

Use the configured aliases — never relative paths that go up more than one level:

```typescript
// CORRECT
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';
import { test, expect } from '@fixtures/site.fixture';
import { checkLinks } from '@utils/link-checker';

// WRONG
import { BasePage } from '../../src/pages/base.page';
```

## Return types on public methods

Always declare return types on public page object methods:

```typescript
// CORRECT
async getNavLinks(): Promise<Array<{ text: string; href: string }>> { ... }
async isNavVisible(): Promise<boolean> { ... }

// WRONG — missing return type
async getNavLinks() { ... }
```

## Null handling

Use the nullish coalescing operator or optional chaining — avoid `!` unless you are certain:

```typescript
// PREFER
const text = (await locator.textContent()) ?? '';

// ONLY when count() was confirmed > 0 immediately above
const count = await locator.count();
if (count > 0) {
  const text = (await locator.textContent())!;
}
```

## No implicit any

If TypeScript infers `any`, add an explicit type annotation:

```typescript
// CORRECT
const bodyText = await page.evaluate<string>(() => document.body.innerText);

// WRONG — infers any
const bodyText = await page.evaluate(() => document.body.innerText);
```

## Verify before finishing

Run `npx tsc --noEmit` before finishing any task. Fix all type errors — never leave the codebase in a state that fails type checking.
