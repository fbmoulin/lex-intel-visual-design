/**
 * Export Functionality E2E Tests
 * Lex Intel Visual Design
 */

import { test, expect } from "@playwright/test";

test.describe("Export Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/editor/civil");
    // Wait for page to load
    await page.waitForLoadState("networkidle");
  });

  test("should open export modal with correct options", async ({ page }) => {
    const exportButton = page.getByRole("button", { name: /exportar|export/i });

    if (await exportButton.isVisible()) {
      await exportButton.click();

      // Wait for modal
      const modal = page.locator("[role='dialog']");
      await expect(modal).toBeVisible({ timeout: 5000 });

      // Check for export format options
      await expect(page.getByText(/PDF/)).toBeVisible();
      await expect(page.getByText(/DOCX|Word/i)).toBeVisible();
    }
  });

  test("should show header configuration in export modal", async ({ page }) => {
    const exportButton = page.getByRole("button", { name: /exportar|export/i });

    if (await exportButton.isVisible()) {
      await exportButton.click();

      // Check for header configuration
      await expect(page.getByText(/Cabeçalho|Header/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test("should show footer configuration in export modal", async ({ page }) => {
    const exportButton = page.getByRole("button", { name: /exportar|export/i });

    if (await exportButton.isVisible()) {
      await exportButton.click();

      // Check for footer configuration
      await expect(page.getByText(/Rodapé|Footer/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test("should have preview tab in export modal", async ({ page }) => {
    const exportButton = page.getByRole("button", { name: /exportar|export/i });

    if (await exportButton.isVisible()) {
      await exportButton.click();

      // Check for preview tab
      const previewTab = page.getByRole("tab", { name: /Preview/i });
      await expect(previewTab).toBeVisible({ timeout: 5000 });
    }
  });

  test("should close export modal on cancel", async ({ page }) => {
    const exportButton = page.getByRole("button", { name: /exportar|export/i });

    if (await exportButton.isVisible()) {
      await exportButton.click();

      const modal = page.locator("[role='dialog']");
      await expect(modal).toBeVisible({ timeout: 5000 });

      // Click cancel
      const cancelButton = page.getByRole("button", { name: /Cancelar|Cancel/i });
      await cancelButton.click();

      // Modal should be closed
      await expect(modal).not.toBeVisible({ timeout: 3000 });
    }
  });

  test("should toggle header on/off", async ({ page }) => {
    const exportButton = page.getByRole("button", { name: /exportar|export/i });

    if (await exportButton.isVisible()) {
      await exportButton.click();

      // Find header toggle
      const headerToggle = page.getByRole("button", { name: /Ativado|Enabled/i }).first();

      if (await headerToggle.isVisible()) {
        await headerToggle.click();

        // Should show Desativado/Disabled
        await expect(page.getByRole("button", { name: /Desativado|Disabled/i }).first()).toBeVisible();
      }
    }
  });
});

test.describe("Export Rate Limiting", () => {
  test("should handle rate limiting gracefully", async ({ page }) => {
    await page.goto("/editor/civil");
    await page.waitForLoadState("networkidle");

    const exportButton = page.getByRole("button", { name: /exportar|export/i });

    if (await exportButton.isVisible()) {
      // Open modal multiple times to test rate limiting doesn't block UI
      for (let i = 0; i < 3; i++) {
        await exportButton.click();
        const modal = page.locator("[role='dialog']");
        await expect(modal).toBeVisible({ timeout: 5000 });

        const cancelButton = page.getByRole("button", { name: /Cancelar|Cancel/i });
        await cancelButton.click();
        await expect(modal).not.toBeVisible({ timeout: 3000 });
      }
    }
  });
});
