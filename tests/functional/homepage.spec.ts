/**
 * tests/functional/homepage.spec.ts
 *
 * Functional tests for the Datagence homepage (https://datagence.io).
 * Covers hero content, key statistics, primary CTAs, page structure, and footer.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Homepage — Hero & Content @functional', () => {
  test.beforeEach(async ({ datagencePage }) => {
    await datagencePage.navigate();
    await datagencePage.waitForLoad();
  });

  // ── Main heading ──────────────────────────────────────────────────────────────

  test('homepage has a non-empty primary heading @functional', async ({ datagencePage }) => {
    const headingText = await datagencePage.getMainHeadingText();
    expect(headingText.trim().length, 'The H1 heading should not be empty').toBeGreaterThan(0);
  });

  // ── Statistics ────────────────────────────────────────────────────────────────

  test('homepage displays $17B provider data cost statistic @functional', async ({ datagencePage }) => {
    const hasStat = await datagencePage.bodyContains(/\$17\s*B|\$17\s*billion/i);
    expect(
      hasStat,
      'Homepage should display the $17B annual provider data cost figure'
    ).toBeTruthy();
  });

  test('homepage displays 81% physician directory inaccuracy statistic @functional', async ({ datagencePage }) => {
    const hasStat = await datagencePage.bodyContains(/81\s*%/i);
    expect(
      hasStat,
      'Homepage should display the 81% physician directory inconsistency statistic'
    ).toBeTruthy();
  });

  // ── CTAs ──────────────────────────────────────────────────────────────────────

  test('homepage has a visible "Let\'s Strategize" CTA @functional', async ({ datagencePage }) => {
    await expect(
      datagencePage.strategizeCta,
      '"Let\'s Strategize" CTA should be visible on the homepage'
    ).toBeVisible();
  });

  test('homepage strategy CTA has a valid href @functional', async ({ datagencePage }) => {
    const href = await datagencePage.getStrategizeCtaHref();
    // Acceptable: external URL, relative path, or anchor — just not empty
    if (href !== null) {
      expect(href.trim().length, 'Strategy CTA href should not be blank').toBeGreaterThan(0);
    }
  });

  // ── Page structure ────────────────────────────────────────────────────────────

  test('homepage has multiple content sections @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const sectionCount = await page.locator('section').count();
    expect(
      sectionCount,
      'Homepage should contain multiple distinct <section> elements'
    ).toBeGreaterThan(1);
  });

  test('homepage has multiple subheadings @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const h2Count = await page.locator('h2').count();
    expect(
      h2Count,
      'Homepage should have multiple H2 subheadings structuring the content'
    ).toBeGreaterThan(1);
  });

  // ── Footer ────────────────────────────────────────────────────────────────────

  test('homepage has a footer with content @functional', async ({ datagencePage }) => {
    const footerText = await datagencePage.getFooterText();
    expect(
      footerText.trim().length,
      'Footer should contain visible text content'
    ).toBeGreaterThan(0);
  });

  test('homepage footer has legal / privacy links @functional', async ({ datagencePage }) => {
    const hasLegalLinks = await datagencePage.hasFooterLegalLinks();
    expect(
      hasLegalLinks,
      'Footer should contain at least one legal link (privacy policy or data policy)'
    ).toBeTruthy();
  });

  test('homepage mentions Datagence brand name @functional', async ({ datagencePage }) => {
    const hasBrand = await datagencePage.bodyContains(/datagence/i);
    expect(hasBrand, 'Homepage should mention the Datagence brand name').toBeTruthy();
  });
});
