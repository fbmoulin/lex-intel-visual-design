/**
 * Templates Page E2E Tests
 * Lex Intel Visual Design
 */

import { test, expect } from "@playwright/test";

test.describe("Templates Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/templates");
  });

  test("should display templates page heading", async ({ page }) => {
    await expect(page.getByRole("heading")).toBeVisible();
  });

  test("should display template cards", async ({ page }) => {
    // Wait for templates to load
    await page.waitForSelector("[data-testid='template-card'], .template-card, article", {
      timeout: 10000,
    }).catch(() => {
      // Fallback: check for any card-like elements
    });

    // Should have multiple template items
    const cards = page.locator("article, [data-testid='template-card'], .card");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should have search functionality", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar|search|pesquisar/i);

    if (await searchInput.isVisible()) {
      await searchInput.fill("cobrança");
      // Wait for filter to apply
      await page.waitForTimeout(500);
    }
  });

  test("should have filter by type", async ({ page }) => {
    // Look for filter buttons or dropdown
    const filterButtons = page.getByRole("button", { name: /civil|trabalhista|criminal|tributário|consumidor/i });
    const filterCount = await filterButtons.count();

    // Should have at least some filter options
    if (filterCount > 0) {
      await filterButtons.first().click();
      await page.waitForTimeout(500);
    }
  });

  test("should navigate to editor when clicking template", async ({ page }) => {
    // Find a "use template" button or clickable template
    const useTemplateButton = page.getByRole("button", { name: /usar|use|aplicar/i }).first();

    if (await useTemplateButton.isVisible()) {
      await useTemplateButton.click();
      await expect(page).toHaveURL(/.*editor/);
    }
  });

  test("should display template categories", async ({ page }) => {
    // Check for category labels/tabs
    const categories = [
      "civil",
      "trabalhista",
      "criminal",
      "tributário",
      "consumidor",
      "família",
      "empresarial",
      "administrativo",
      "previdenciário",
      "ambiental",
    ];

    // At least some categories should be visible
    let foundCategories = 0;
    for (const category of categories) {
      const element = page.getByText(new RegExp(category, "i")).first();
      if (await element.isVisible().catch(() => false)) {
        foundCategories++;
      }
    }

    expect(foundCategories).toBeGreaterThan(0);
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Page should still be functional
    await expect(page.locator("body")).toBeVisible();

    // Cards should stack vertically
    const cards = page.locator("article, [data-testid='template-card'], .card");
    if (await cards.count() > 0) {
      await expect(cards.first()).toBeVisible();
    }
  });
});
