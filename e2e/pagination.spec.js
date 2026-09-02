import { test, expect } from "@playwright/test";
import { setupPokeApiMocks } from "./helpers/mockApi";

test.describe("Pagination Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await setupPokeApiMocks(page);
    await page.goto("/");
  });

  test("displays pagination controls with correct initial state", async ({ page }) => {
    const pagination = page.getByRole("navigation", { name: "Pagination" });
    await expect(pagination).toBeVisible();

    const prevButton = page.getByRole("button", { name: /previous page/i });
    const nextButton = page.getByRole("button", { name: /next page/i });
    const page1Button = page.getByRole("button", { name: "Page 1" });

    // Previous is disabled on page 1
    await expect(prevButton).toBeDisabled();
    // Next is enabled
    await expect(nextButton).toBeEnabled();
    // Page 1 is active
    await expect(page1Button).toHaveAttribute("aria-current", "page");
  });

  test("navigates to next page and updates card results", async ({ page }) => {
    const nextButton = page.getByRole("button", { name: /next page/i });
    const page2Button = page.getByRole("button", { name: "Page 2" });
    const prevButton = page.getByRole("button", { name: /previous page/i });

    // Navigate to Page 2
    await nextButton.click();

    // Page 2 is now active
    await expect(page2Button).toHaveAttribute("aria-current", "page");
    // Previous button is now enabled
    await expect(prevButton).toBeEnabled();

    // Verify Page 2 cards (e.g., Pikachu #025, Rattata #019)
    const cards = page.locator('section[aria-label="Pokémon collection"] button[aria-label*="View details for"]');
    await expect(cards).toHaveCount(18);
    await expect(cards.first()).toContainText("rattata");
    await expect(page.locator('button[aria-label*="View details for pikachu"]')).toBeVisible();
  });

  test("navigates back to previous page using Previous button", async ({ page }) => {
    const nextButton = page.getByRole("button", { name: /next page/i });
    const prevButton = page.getByRole("button", { name: /previous page/i });
    const page1Button = page.getByRole("button", { name: "Page 1" });

    // Go to page 2
    await nextButton.click();
    await expect(page.locator('button[aria-label*="View details for pikachu"]')).toBeVisible();

    // Go back to page 1
    await prevButton.click();
    await expect(page1Button).toHaveAttribute("aria-current", "page");
    await expect(prevButton).toBeDisabled();

    // Cards should be Bulbasaur etc. again
    const cards = page.locator('section[aria-label="Pokémon collection"] button[aria-label*="View details for"]');
    await expect(cards.first()).toContainText("bulbasaur");
  });

  test("allows jumping to specific page number buttons", async ({ page }) => {
    const page2Button = page.getByRole("button", { name: "Page 2" });
    const page1Button = page.getByRole("button", { name: "Page 1" });

    // Direct click to Page 2
    await page2Button.click();
    await expect(page2Button).toHaveAttribute("aria-current", "page");
    await expect(page.locator('button[aria-label*="View details for pikachu"]')).toBeVisible();

    // Direct click back to Page 1
    await page1Button.click();
    await expect(page1Button).toHaveAttribute("aria-current", "page");
    await expect(page.locator('button[aria-label*="View details for bulbasaur"]')).toBeVisible();
  });
});
