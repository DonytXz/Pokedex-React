import { test, expect } from "@playwright/test";
import { setupPokeApiMocks } from "./helpers/mockApi";

test.describe("Home Page & Core UI", () => {
  test.beforeEach(async ({ page }) => {
    await setupPokeApiMocks(page);
    await page.goto("/");
  });

  test("renders the Pokédex logo, search bar, layout toggle, and initial grid of cards", async ({ page, isMobile }) => {
    // 1. Verify Logo
    const logo = page.locator('img[alt="Pokémon"]');
    await expect(logo).toBeVisible();

    // 2. Verify Search input
    const searchInput = page.getByRole("searchbox", { name: /search pokémon by name or id/i });
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute("placeholder", "Search by keywords");

    // 3. Verify Layout toggle button (hidden on mobile, visible on desktop/tablet)
    const toggleBtn = page.getByRole("button", { name: /switch to list view/i });
    if (isMobile) {
      await expect(toggleBtn).not.toBeVisible();
    } else {
      await expect(toggleBtn).toBeVisible();
    }

    // 4. Verify 18 Pokémon cards rendered in Grid view
    const cards = page.locator('section[aria-label="Pokémon collection"] button[aria-label*="View details for"]');
    await expect(cards).toHaveCount(18);

    // 5. Verify first card content (Bulbasaur #001)
    const firstCard = cards.first();
    await expect(firstCard).toContainText("bulbasaur");
    await expect(firstCard).toContainText("#001");
    await expect(firstCard.locator("img")).toBeVisible();
  });

  test("supports 'Skip to main content' accessible link", async ({ page }) => {
    const skipLink = page.getByRole("link", { name: /skip to main content/i });
    await expect(skipLink).toBeAttached();

    // Tab to focus the skip link
    await page.keyboard.press("Tab");
    await expect(skipLink).toBeFocused();

    // Trigger skip link
    await page.keyboard.press("Enter");
    const main = page.locator("main#main-content");
    await expect(main).toBeFocused();
  });

  test("toggles between Grid View and List View layout", async ({ page, isMobile }) => {
    test.skip(isMobile, "View switcher is disabled on mobile devices");
    const toggleBtn = page.locator("button[aria-label*='Switch to']");

    // Initial state: Grid view (button offers switch to list view)
    await expect(toggleBtn).toHaveAttribute("aria-label", "Switch to list view");
    await expect(toggleBtn).toHaveAttribute("aria-pressed", "false");

    // Switch to List View
    await toggleBtn.click();
    await expect(toggleBtn).toHaveAttribute("aria-label", "Switch to grid view");
    await expect(toggleBtn).toHaveAttribute("aria-pressed", "true");

    // In List View, cards display extra details like Height and Weight
    const firstCard = page.locator('section[aria-label="Pokémon collection"] button').first();
    await expect(firstCard).toContainText("Height:");
    await expect(firstCard).toContainText("Weight:");
    await expect(firstCard).toContainText("Types:");

    // Switch back to Grid View
    await toggleBtn.click();
    await expect(toggleBtn).toHaveAttribute("aria-label", "Switch to list view");
    await expect(toggleBtn).toHaveAttribute("aria-pressed", "false");
  });
});
