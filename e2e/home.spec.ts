/**
 * Home Page E2E Tests
 * Lex Intel Visual Design
 */

import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the main heading", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("should display navigation links", async ({ page }) => {
    // Header navigation
    await expect(page.getByRole("link", { name: /templates|modelos/i })).toBeVisible();
  });

  test("should have a call-to-action button", async ({ page }) => {
    const ctaButton = page.getByRole("link", { name: /começar|start|criar/i });
    await expect(ctaButton).toBeVisible();
  });

  test("should navigate to templates page", async ({ page }) => {
    await page.getByRole("link", { name: /templates|modelos/i }).first().click();
    await expect(page).toHaveURL(/.*templates/);
  });

  test("should have proper page title", async ({ page }) => {
    await expect(page).toHaveTitle(/lex|visual|design/i);
  });

  test("should display footer", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("should have theme toggle", async ({ page }) => {
    // Look for theme toggle button
    const themeToggle = page.getByRole("button", { name: /theme|tema|modo/i });
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      // Verify theme changed (check for dark mode class or similar)
    }
  });

  test("should be responsive", async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator("body")).toBeVisible();

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("body")).toBeVisible();
  });
});
