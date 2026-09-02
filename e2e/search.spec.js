import { test, expect } from "@playwright/test";
import { setupPokeApiMocks } from "./helpers/mockApi";

test.describe("Search Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await setupPokeApiMocks(page);
    await page.goto("/");
  });

  test("searches Pokémon by name with debounce", async ({ page }) => {
    const searchInput = page.getByRole("searchbox", { name: /search pokémon by name or id/i });
    const liveStatus = page.locator('div[role="status"].sr-only');

    // Type query "char"
    await searchInput.fill("char");

    // Wait for debounced search and filtered results
    const cards = page.locator('section[aria-label="Pokémon collection"] button[aria-label*="View details for"]');
    await expect(cards).toHaveCount(3);

    await expect(cards.nth(0)).toContainText("charmander");
    await expect(cards.nth(1)).toContainText("charmeleon");
    await expect(cards.nth(2)).toContainText("charizard");

    // Live status announcement
    await expect(liveStatus).toContainText("Found 3 Pokémon matching search.");
  });

  test("searches Pokémon by ID number", async ({ page }) => {
    const searchInput = page.getByRole("searchbox", { name: /search pokémon by name or id/i });
    await searchInput.fill("25");

    const cards = page.locator('section[aria-label="Pokémon collection"] button[aria-label*="View details for"]');
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("pikachu");
    await expect(cards.first()).toContainText("#025");
  });

  test("triggers immediate search on Enter key press", async ({ page }) => {
    const searchInput = page.getByRole("searchbox", { name: /search pokémon by name or id/i });
    await searchInput.fill("squirtle");
    await searchInput.press("Enter");

    const cards = page.locator('section[aria-label="Pokémon collection"] button[aria-label*="View details for"]');
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("squirtle");
  });

  test("displays 'No Pokémon found' message for non-matching queries", async ({ page }) => {
    const searchInput = page.getByRole("searchbox", { name: /search pokémon by name or id/i });
    const liveStatus = page.locator('div[role="status"].sr-only');

    await searchInput.fill("unknownmon");
    await searchInput.press("Enter");

    const noResults = page.getByText("No Pokémon found.");
    await expect(noResults).toBeVisible();
    await expect(liveStatus).toContainText("No Pokémon found matching search.");
  });

  test("clearing search restores the paginated list and pagination controls", async ({ page }) => {
    const searchInput = page.getByRole("searchbox", { name: /search pokémon by name or id/i });
    const pagination = page.getByRole("navigation", { name: "Pagination" });

    // Perform search
    await searchInput.fill("mewtwo");
    await searchInput.press("Enter");

    // Pagination is hidden during search
    await expect(pagination).not.toBeVisible();

    // Clear search
    await searchInput.fill("");

    // Initial 18 cards restored
    const cards = page.locator('section[aria-label="Pokémon collection"] button[aria-label*="View details for"]');
    await expect(cards).toHaveCount(18);

    // Pagination is visible again
    await expect(pagination).toBeVisible();
  });
});
