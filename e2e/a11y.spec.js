import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { setupPokeApiMocks } from "./helpers/mockApi";

test.describe("Accessibility (A11y) Audits", () => {
  test.beforeEach(async ({ page }) => {
    await setupPokeApiMocks(page);
    await page.goto("/");
  });

  test("Home Page in Grid View has no automatically detectable accessibility violations", async ({ page }) => {
    // Wait for cards to be rendered
    await expect(page.locator('section[aria-label="Pokémon collection"] button').first()).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Home Page in List View has no automatically detectable accessibility violations", async ({ page, isMobile }) => {
    test.skip(isMobile, "List view switcher is disabled on mobile devices");
    const toggleBtn = page.locator("button[aria-label*='Switch to']");
    await toggleBtn.click();
    await expect(page.locator('section[aria-label="Pokémon collection"] button').first()).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Search View has no automatically detectable accessibility violations", async ({ page }) => {
    const searchInput = page.getByRole("searchbox", { name: /search pokémon by name or id/i });
    await searchInput.fill("pikachu");
    await searchInput.press("Enter");
    await expect(page.locator('button[aria-label*="View details for pikachu"]')).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Open Pokémon Details Modal dialog has no automatically detectable accessibility violations", async ({ page }) => {
    await page.locator('button[aria-label*="View details for bulbasaur"]').click();
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
