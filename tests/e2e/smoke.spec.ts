import { expect, test } from "@playwright/test";

test.describe("Home smoke", () => {
  test("renders landing hero and navigation", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Lex Intel Visual Design" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Templates/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Come/i })
    ).toBeVisible();
  });

  test("navigates to templates page", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /Templates/i }).click();
    await expect(page).toHaveURL(/\/templates/);
    await expect(
      page.getByRole("heading", { name: /Templates/i })
    ).toBeVisible();
  });
});
