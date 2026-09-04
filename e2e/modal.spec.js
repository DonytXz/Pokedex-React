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
    await expect(modal).toContainText("Height: 0.7m");
    await expect(modal).toContainText("Weight: 6.9kg");
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

  test("ensures modal has no horizontal scroll and chart stays properly bounded across view toggle", async ({ page }) => {
    await page.locator('button[aria-label*="View details for bulbasaur"]').click();
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    // Verify modal has no horizontal scroll
    const hasHorizontalScroll = await modal.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(hasHorizontalScroll).toBe(false);

    // Verify close button is fully contained within modal bounding box
    const modalBox = await modal.boundingBox();
    const closeBtn = page.getByRole("button", { name: /close pokémon details/i });
    const btnBox = await closeBtn.boundingBox();

    expect(btnBox.x).toBeGreaterThanOrEqual(modalBox.x);
    expect(btnBox.x + btnBox.width).toBeLessThanOrEqual(modalBox.x + modalBox.width + 2);
    expect(btnBox.y).toBeGreaterThanOrEqual(modalBox.y);

    // Verify Bar Chart canvas is bounded within modal
    const canvas = modal.locator("canvas");
    await expect(canvas).toBeVisible();
    let canvasBox = await canvas.boundingBox();
    expect(canvasBox.width).toBeLessThanOrEqual(modalBox.width);
    expect(canvasBox.height).toBeLessThan(350);

    // Toggle to Radar View
    await modal.locator('label[for="chart-toggle"]').click();
    await expect(modal).toContainText("Radar View");

    // Verify Radar View has no horizontal scroll and remains bounded
    const hasHorizontalScrollRadar = await modal.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(hasHorizontalScrollRadar).toBe(false);

    canvasBox = await canvas.boundingBox();
    expect(canvasBox.width).toBeLessThanOrEqual(modalBox.width);
    expect(canvasBox.height).toBeLessThan(350);
  });

  test("navigates between pokémon using Next and Previous arrow buttons", async ({ page }) => {
    await page.locator('button[aria-label*="View details for bulbasaur"]').click();
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    const prevBtn = page.getByRole("button", { name: "Previous Pokémon" });
    const nextBtn = page.getByRole("button", { name: "Next Pokémon" });

    // Bulbasaur is index 0 on page 0
    await expect(prevBtn).toBeDisabled();
    await expect(nextBtn).not.toBeDisabled();
    await expect(page.locator("#modal-pokemon-name")).toHaveText("bulbasaur");

    // Click Next -> moves to ivysaur
    await nextBtn.click();
    await expect(page.locator("#modal-pokemon-name")).toHaveText("ivysaur");
    await expect(prevBtn).not.toBeDisabled();

    // Click Prev -> moves back to bulbasaur
    await prevBtn.click();
    await expect(page.locator("#modal-pokemon-name")).toHaveText("bulbasaur");
    await expect(prevBtn).toBeDisabled();
  });

  test("navigates between pokémon using keyboard ArrowLeft and ArrowRight keys", async ({ page }) => {
    await page.locator('button[aria-label*="View details for bulbasaur"]').click();
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    await expect(page.locator("#modal-pokemon-name")).toHaveText("bulbasaur");

    // Press ArrowRight -> moves to ivysaur
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#modal-pokemon-name")).toHaveText("ivysaur");

    // Press ArrowRight again -> moves to venusaur
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#modal-pokemon-name")).toHaveText("venusaur");

    // Press ArrowLeft -> moves back to ivysaur
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator("#modal-pokemon-name")).toHaveText("ivysaur");
  });

  test("navigates across page boundaries when navigating next from the last pokémon or prev from the first", async ({ page }) => {
    // Open Pidgeot (18th pokemon, last on page 0) - exact match so pidgeotto isn't matched
    await page.locator('button[aria-label*="View details for pidgeot,"]').click();
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await expect(page.locator("#modal-pokemon-name")).toHaveText("pidgeot");

    const nextBtn = page.getByRole("button", { name: "Next Pokémon" });
    await expect(nextBtn).not.toBeDisabled();

    // Click Next from pidgeot -> advances to page 1 and opens rattata
    await nextBtn.click();
    await expect(page.locator("#modal-pokemon-name")).toHaveText("rattata");

    // On page 1, rattata is the first pokemon. Previous button is enabled because page 0 exists.
    const prevBtn = page.getByRole("button", { name: "Previous Pokémon" });
    await expect(prevBtn).not.toBeDisabled();

    // Click Previous from rattata -> returns to page 0 and opens pidgeot
    await prevBtn.click();
    await expect(page.locator("#modal-pokemon-name")).toHaveText("pidgeot");
  });

  test("navigates between pokémon via touch swipe gestures and keeps arrow buttons visible", async ({ page }) => {
    await page.locator('button[aria-label*="View details for bulbasaur"]').click();
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    // Verify arrow buttons are present and visible
    const prevBtn = page.getByRole("button", { name: "Previous Pokémon" });
    const nextBtn = page.getByRole("button", { name: "Next Pokémon" });
    await expect(prevBtn).toBeVisible();
    await expect(nextBtn).toBeVisible();

    await expect(page.locator("#modal-pokemon-name")).toHaveText("bulbasaur");

    // Swipe Left (deltaX = -150) -> Navigates to Next Pokémon (ivysaur)
    await modal.evaluate((el) => {
      const t1 = new Touch({ identifier: 1, target: el, clientX: 250, clientY: 200 });
      const t2 = new Touch({ identifier: 1, target: el, clientX: 100, clientY: 200 });
      el.dispatchEvent(new TouchEvent("touchstart", { touches: [t1], bubbles: true }));
      el.dispatchEvent(new TouchEvent("touchend", { changedTouches: [t2], bubbles: true }));
    });

    await expect(page.locator("#modal-pokemon-name")).toHaveText("ivysaur");

    // Swipe Right (deltaX = +150) -> Navigates to Previous Pokémon (bulbasaur)
    await modal.evaluate((el) => {
      const t1 = new Touch({ identifier: 2, target: el, clientX: 100, clientY: 200 });
      const t2 = new Touch({ identifier: 2, target: el, clientX: 250, clientY: 200 });
      el.dispatchEvent(new TouchEvent("touchstart", { touches: [t1], bubbles: true }));
      el.dispatchEvent(new TouchEvent("touchend", { changedTouches: [t2], bubbles: true }));
    });

    await expect(page.locator("#modal-pokemon-name")).toHaveText("bulbasaur");
  });
});


