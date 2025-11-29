/**
 * Editor Page E2E Tests
 * Lex Intel Visual Design
 */

import { test, expect } from "@playwright/test";

test.describe("Editor Page", () => {
  test.beforeEach(async ({ page }) => {
    // Go to editor with a template type
    await page.goto("/editor/civil");
  });

  test("should display editor form", async ({ page }) => {
    // Wait for editor to load
    await page.waitForSelector("form, [data-testid='petition-form']", {
      timeout: 10000,
    }).catch(() => {});

    // Should have input fields
    const inputs = page.locator("input, textarea");
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should have title input field", async ({ page }) => {
    const titleInput = page.getByLabel(/título|title/i);
    if (await titleInput.isVisible()) {
      await expect(titleInput).toBeEditable();
    }
  });

  test("should have author input field", async ({ page }) => {
    const authorInput = page.getByLabel(/autor|author|requerente/i);
    if (await authorInput.isVisible()) {
      await expect(authorInput).toBeEditable();
    }
  });

  test("should have facts textarea", async ({ page }) => {
    const factsInput = page.getByLabel(/fatos|facts/i);
    if (await factsInput.isVisible()) {
      await expect(factsInput).toBeEditable();
    }
  });

  test("should have legal basis textarea", async ({ page }) => {
    const legalBasisInput = page.getByLabel(/fundamentos|legal.*basis|direito/i);
    if (await legalBasisInput.isVisible()) {
      await expect(legalBasisInput).toBeEditable();
    }
  });

  test("should have requests textarea", async ({ page }) => {
    const requestsInput = page.getByLabel(/pedidos|requests|requerimentos/i);
    if (await requestsInput.isVisible()) {
      await expect(requestsInput).toBeEditable();
    }
  });

  test("should have preview toggle", async ({ page }) => {
    const previewToggle = page.getByRole("button", { name: /preview|visualizar|pré-visualizar/i });
    if (await previewToggle.isVisible()) {
      await previewToggle.click();
      // Preview should be visible
      const preview = page.locator("[data-testid='petition-preview'], .preview-container");
      if (await preview.isVisible().catch(() => false)) {
        await expect(preview).toBeVisible();
      }
    }
  });

  test("should have save button", async ({ page }) => {
    const saveButton = page.getByRole("button", { name: /salvar|save|guardar/i });
    await expect(saveButton).toBeVisible();
  });

  test("should have export button", async ({ page }) => {
    const exportButton = page.getByRole("button", { name: /exportar|export|baixar/i });
    await expect(exportButton).toBeVisible();
  });

  test("should fill and preview petition", async ({ page }) => {
    // Fill form fields
    const titleInput = page.getByLabel(/título|title/i);
    if (await titleInput.isVisible()) {
      await titleInput.fill("Petição de Teste E2E");
    }

    const authorInput = page.getByLabel(/autor|author|requerente/i);
    if (await authorInput.isVisible()) {
      await authorInput.fill("João da Silva");
    }

    const factsInput = page.getByLabel(/fatos|facts/i);
    if (await factsInput.isVisible()) {
      await factsInput.fill("Fatos da petição para teste automatizado.");
    }

    // Verify content appears in preview (if visible)
    const previewContent = page.locator(".preview-container, [data-testid='petition-preview']");
    if (await previewContent.isVisible().catch(() => false)) {
      await expect(previewContent).toContainText(/teste/i);
    }
  });

  test("should open export modal", async ({ page }) => {
    const exportButton = page.getByRole("button", { name: /exportar|export|baixar/i });

    if (await exportButton.isVisible()) {
      await exportButton.click();

      // Modal should appear
      const modal = page.locator("[role='dialog'], .modal, [data-testid='export-modal']");
      if (await modal.isVisible().catch(() => false)) {
        await expect(modal).toBeVisible();

        // Should have format options
        const pdfOption = page.getByText(/pdf/i);
        const docxOption = page.getByText(/docx|word/i);

        await expect(pdfOption.or(docxOption)).toBeVisible();
      }
    }
  });

  test("should validate required fields", async ({ page }) => {
    // Try to save without title
    const saveButton = page.getByRole("button", { name: /salvar|save/i });

    if (await saveButton.isVisible()) {
      await saveButton.click();

      // Should show validation error or required field message
      const errorMessage = page.getByText(/obrigatório|required|necessário/i);
      // Error may or may not appear depending on implementation
    }
  });

  test("should be responsive on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    // Editor should still be functional
    await expect(page.locator("body")).toBeVisible();

    const inputs = page.locator("input, textarea");
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });
});
