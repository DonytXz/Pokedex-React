import { test, expect } from "@playwright/test";
import { setupPokeApiMocks } from "./helpers/mockApi";

test.describe("Pokémon Details Modal", () => {
  test.beforeEach(async ({ page }) => {
    await setupPokeApiMocks(page);
    await page.goto("/");
  });

  test("opens modal on card click with detailed stats and species info", async ({ page }) => {
    // Click Bulbasaur card
    const bulbasaurCard = page.locator('button[aria-label*="View details for bulbasaur"]');
    await bulbasaurCard.click();

    // Dialog appears
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute("aria-modal", "true");

    // Check title, ID, types, height, weight
    await expect(page.locator("#modal-pokemon-name")).toHaveText("bulbasaur");
    await expect(modal).toContainText("#001");
    await expect(modal).toContainText("Height: 7m");
    await expect(modal).toContainText("Weight: 69kg");
    await expect(modal.locator("span", { hasText: "grass" })).toBeVisible();
    await expect(modal.locator("span", { hasText: "poison" })).toBeVisible();

    // Check species flavor text description
    await expect(modal).toContainText("A strange seed was planted on its back");

    // Check stats canvas chart
    await expect(modal.locator("canvas")).toBeVisible();
  });

  test("toggles between Chart View and Radar View inside modal", async ({ page }) => {
    await page.locator('button[aria-label*="View details for bulbasaur"]').click();
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    // Default view label
    await expect(modal).toContainText("Chart View");

    // Click toggle switch (via label or input)
    const toggle = modal.locator('input[role="switch"]');
    await expect(toggle).toHaveAttribute("aria-checked", "false");

    await modal.locator('label[for="chart-toggle"]').click();

    // View updates to Radar View
    await expect(modal).toContainText("Radar View");
    await expect(toggle).toHaveAttribute("aria-checked", "true");

    // Toggle back
    await modal.locator('label[for="chart-toggle"]').click();
    await expect(modal).toContainText("Chart View");
    await expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  test("closes modal using the close button and restores focus to the triggering card", async ({ page }) => {
    const bulbasaurCard = page.locator('button[aria-label*="View details for bulbasaur"]');
    await bulbasaurCard.click();

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    // Close button has initial focus
    const closeBtn = page.getByRole("button", { name: /close pokémon details/i });
    await expect(closeBtn).toBeFocused();

    // Click close button
    await closeBtn.click();
    await expect(modal).not.toBeVisible();

    // Focus returned to the original card
    await expect(bulbasaurCard).toBeFocused();
  });

  test("closes modal when pressing the Escape key", async ({ page }) => {
    const charmanderCard = page.locator('button[aria-label*="View details for charmander"]');
    await charmanderCard.click();

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();
    await expect(charmanderCard).toBeFocused();
  });

  test("closes modal when clicking the backdrop overlay", async ({ page }) => {
    await page.locator('button[aria-label*="View details for bulbasaur"]').click();

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    // Click the backdrop overlay (outside the modal dialog)
    const backdrop = page.locator(".fixed.inset-0.z-50 > div.absolute.inset-0");
    await backdrop.click({ position: { x: 10, y: 10 } });

    await expect(modal).not.toBeVisible();
  });

  test("traps keyboard focus within the open modal", async ({ page }) => {
    await page.locator('button[aria-label*="View details for bulbasaur"]').click();

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    const closeBtn = page.getByRole("button", { name: /close pokémon details/i });
    const toggleInput = modal.locator('input[role="switch"]');

    await expect(closeBtn).toBeFocused();

    // Tab moves focus through focusable elements inside modal
    await page.keyboard.press("Tab");

    // Verify focus remains inside the modal dialog
    const isInsideModal = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      return dialog && dialog.contains(document.activeElement);
    });
    expect(isInsideModal).toBe(true);
  });

  test("locks document body scroll when modal is active", async ({ page }) => {
    await page.locator('button[aria-label*="View details for bulbasaur"]').click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // Check body overflow style
    const overflowModalOpen = await page.evaluate(() => document.body.style.overflow);
    expect(overflowModalOpen).toBe("hidden");

    // Close modal
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();

    const overflowModalClosed = await page.evaluate(() => document.body.style.overflow);
    expect(overflowModalClosed).toBe("");
  });
});
