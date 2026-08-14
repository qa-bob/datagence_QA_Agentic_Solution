/**
 * src/pages/datagence.page.ts
 *
 * DatagencePage provides selectors and action methods specific to
 * the Datagence marketing homepage (https://datagence.io).
 *
 * Covers: hero section, statistics, Polus HCP features, outcome sections,
 * CTA buttons, resource cards, and footer.
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class DatagencePage extends BasePage {
  // ── Hero ─────────────────────────────────────────────────────────────────────
  readonly mainHeading: Locator;

  // ── CTAs ─────────────────────────────────────────────────────────────────────
  readonly strategizeCta: Locator;
  readonly talkCta: Locator;

  // ── Polus product section ─────────────────────────────────────────────────────
  readonly polusSection: Locator;
  readonly featureItems: Locator;

  // ── Audience outcome sections ─────────────────────────────────────────────────
  readonly healthPlansHeading: Locator;
  readonly hospitalsBillingHeading: Locator;

  // ── Resource/article cards ────────────────────────────────────────────────────
  readonly resourceCards: Locator;

  // ── Footer ────────────────────────────────────────────────────────────────────
  readonly footer: Locator;
  readonly footerLegalLinks: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    this.mainHeading = page.locator('h1').first();

    // Primary CTAs visible in the hero and throughout the page
    this.strategizeCta = page
      .getByRole('link', { name: /strateg/i })
      .or(page.getByRole('button', { name: /strateg/i }))
      .first();

    this.talkCta = page
      .getByRole('link', { name: /let.?s talk/i })
      .or(page.getByRole('button', { name: /let.?s talk/i }))
      .first();

    // Polus HCP section — match by section containing "Polus"
    this.polusSection = page
      .locator('section')
      .filter({ hasText: /polus/i })
      .first();

    // The six Polus pipeline capabilities: Ingest, Validate, Resolve, Enrich, Log, Publish
    this.featureItems = page.locator('li, [class*="item"], [class*="feature"], [class*="step"]').filter({
      hasText: /^(Ingest|Validate|Resolve|Enrich|Log|Publish)$/i,
    });

    // Audience-specific outcome headings
    this.healthPlansHeading = page
      .getByRole('heading', { name: /health plans/i })
      .first();

    this.hospitalsBillingHeading = page
      .getByRole('heading', { name: /hospitals|billing/i })
      .first();

    // Resource / featured article cards
    this.resourceCards = page.locator('article, [class*="card"], [class*="resource"]').filter({
      has: page.locator('a[href]'),
    });

    this.footer = page.locator('footer').first();

    this.footerLegalLinks = page
      .locator('footer')
      .getByRole('link', { name: /privacy|data policy|legal|terms/i });
  }

  // ── Actions ──────────────────────────────────────────────────────────────────

  async getMainHeadingText(): Promise<string> {
    return (await this.mainHeading.textContent()) ?? '';
  }

  async getStrategizeCtaHref(): Promise<string | null> {
    return this.strategizeCta.getAttribute('href');
  }

  /** Returns all visible text on the page body — used for statistic checks. */
  async getBodyText(): Promise<string> {
    return this.page.evaluate<string>(() => document.body.innerText);
  }

  /** Returns true when the given pattern matches visible page text. */
  async bodyContains(pattern: RegExp): Promise<boolean> {
    const text = await this.getBodyText();
    return pattern.test(text);
  }

  async getPolusFeaturesCount(): Promise<number> {
    return this.featureItems.count();
  }

  async getResourceCardCount(): Promise<number> {
    return this.resourceCards.count();
  }

  async getFooterText(): Promise<string> {
    return (await this.footer.textContent()) ?? '';
  }

  async hasFooterLegalLinks(): Promise<boolean> {
    return (await this.footerLegalLinks.count()) > 0;
  }
}
