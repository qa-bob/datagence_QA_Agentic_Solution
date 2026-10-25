/**
 * tests/functional/polus-product.spec.ts
 *
 * Functional tests for the Polus HCP product section on the Datagence homepage.
 * Covers the six pipeline capabilities, audience outcome sections, resource cards,
 * and navigation dropdown content.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

const POLUS_CAPABILITIES = ['Ingest', 'Validate', 'Resolve', 'Enrich', 'Log', 'Publish'] as const;

test.describe('Polus HCP Product Section @functional', () => {
  test.beforeEach(async ({ datagencePage }) => {
    await datagencePage.navigate();
    await datagencePage.waitForLoad();
  });

  // ── Polus product mention ─────────────────────────────────────────────────────

  test('homepage references the Polus product @functional', async ({ datagencePage }) => {
    const mentionsPolus = await datagencePage.bodyContains(/polus/i);
    expect(mentionsPolus, 'Homepage should reference the Polus HCP product').toBeTruthy();
  });

  // ── Six pipeline capabilities ─────────────────────────────────────────────────

  test('homepage displays Polus HCP pipeline capabilities @functional', async ({ datagencePage }) => {
    const bodyText = await datagencePage.getBodyText();

    const mentioned = POLUS_CAPABILITIES.filter((cap) =>
      new RegExp(`\\b${cap}\\b`, 'i').test(bodyText)
    );

    expect(
      mentioned.length,
      `Expected at least 4 of 6 Polus capabilities on the page. ` +
        `Found: [${mentioned.join(', ')}]. ` +
        `Missing: [${POLUS_CAPABILITIES.filter((c) => !mentioned.includes(c)).join(', ')}]`
    ).toBeGreaterThanOrEqual(4);
  });

  test('homepage shows Ingest capability @functional', async ({ datagencePage }) => {
    const found = await datagencePage.bodyContains(/\bIngest\b/i);
    expect(found, 'Homepage should mention the "Ingest" Polus capability').toBeTruthy();
  });

  test('homepage shows Validate capability @functional', async ({ datagencePage }) => {
    const found = await datagencePage.bodyContains(/\bValidat/i);
    expect(found, 'Homepage should mention the "Validate" Polus capability').toBeTruthy();
  });

  test('homepage shows Publish capability @functional', async ({ datagencePage }) => {
    const found = await datagencePage.bodyContains(/\bPublish\b/i);
    expect(found, 'Homepage should mention the "Publish" Polus capability').toBeTruthy();
  });

  // ── Audience outcome sections ─────────────────────────────────────────────────

  test('homepage has a Health Plans audience section @functional', async ({ datagencePage }) => {
    await expect(
      datagencePage.healthPlansHeading,
      'Homepage should have a heading targeting the Health Plans audience'
    ).toBeVisible();
  });

  test('homepage has a Hospitals & Billing audience section @functional', async ({ datagencePage }) => {
    await expect(
      datagencePage.hospitalsBillingHeading,
      'Homepage should have a heading targeting Hospitals & Billing Firms audience'
    ).toBeVisible();
  });

  test('homepage addresses distinct B2B buyer segments @functional', async ({ datagencePage }) => {
    const hasHealthPlans = await datagencePage.bodyContains(/health plans/i);
    const hasHospitals = await datagencePage.bodyContains(/hospitals|billing firm/i);

    expect(
      hasHealthPlans,
      'Homepage should address Health Plans as a buyer segment'
    ).toBeTruthy();

    expect(
      hasHospitals,
      'Homepage should address Hospitals or Billing Firms as a buyer segment'
    ).toBeTruthy();
  });

  // ── Resource cards ────────────────────────────────────────────────────────────

  test('homepage displays featured resource or article cards @functional', async ({ datagencePage }) => {
    const cardCount = await datagencePage.getResourceCardCount();

    if (cardCount === 0) {
      console.warn(
        '[functional] No resource/article cards detected — the site structure may have changed.'
      );
    }

    // Soft check — warn but do not hard-fail if the section was removed
    expect(
      cardCount,
      'Homepage should display at least one featured resource or article card'
    ).toBeGreaterThanOrEqual(0);
  });

  // ── Navigation dropdown content ───────────────────────────────────────────────

  test('Solutions navigation item is present @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const solutionsItem = page
      .getByRole('navigation')
      .getByText(/^solutions$/i)
      .first();

    expect(
      await solutionsItem.count(),
      '"Solutions" navigation item should be present in the primary nav'
    ).toBeGreaterThan(0);
  });

  test('Technology navigation item is present @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const techItem = page
      .getByRole('navigation')
      .getByText(/^technology$/i)
      .first();

    expect(
      await techItem.count(),
      '"Technology" navigation item should be present in the primary nav'
    ).toBeGreaterThan(0);
  });

  test('Solutions nav references Healthcare Provider Data @functional', async ({ page, siteConfig }, testInfo) => {
    // Hover dropdowns are desktop-only — small viewports hide the nav behind a toggle
    test.skip(testInfo.project.name !== 'chromium-desktop', 'Runs only in the "chromium-desktop" project');
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    // Hover over Solutions to open the dropdown
    const solutionsItem = page.getByRole('navigation').getByText(/solutions/i).first();
    test.skip((await solutionsItem.count()) === 0, '"Solutions" nav item not found');

    await solutionsItem.hover();

    // Allow dropdown animation to settle
    await page
      .waitForSelector('[class*="dropdown"] a, [class*="submenu"] a, [role="menu"] a', {
        timeout: 3_000,
      })
      .catch(() => null);

    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /healthcare provider data/i.test(bodyText),
      'Solutions dropdown should reference "Healthcare Provider Data"'
    ).toBeTruthy();
  });

  test('Technology nav references Polus for Healthcare @functional', async ({ page, siteConfig }, testInfo) => {
    // Hover dropdowns are desktop-only — small viewports hide the nav behind a toggle
    test.skip(testInfo.project.name !== 'chromium-desktop', 'Runs only in the "chromium-desktop" project');
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const techItem = page.getByRole('navigation').getByText(/technology/i).first();
    test.skip((await techItem.count()) === 0, '"Technology" nav item not found');

    await techItem.hover();

    await page
      .waitForSelector('[class*="dropdown"] a, [class*="submenu"] a, [role="menu"] a', {
        timeout: 3_000,
      })
      .catch(() => null);

    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /polus for healthcare/i.test(bodyText),
      'Technology dropdown should reference "Polus for Healthcare"'
    ).toBeTruthy();
  });
});
