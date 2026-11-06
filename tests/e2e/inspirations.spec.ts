import { test, expect } from "@playwright/test";

test("inspirations remain readable, pausable and non-interactive", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const section = page.locator(".inspirations");
  await expect(section.locator(".inspirations-list li")).toHaveCount(15);
  await expect(section.locator(".inspirations-list a")).toHaveCount(0);
  const button = section.getByRole("button", { name: "Pausar movimento" });
  await expect(button).toBeVisible();
  await expect(section.locator(".inspirations-row")).toHaveCount(2);
  await expect(section.locator(".inspirations-item img").first()).toHaveAttribute("src", /lavender-ornament-gold/);
  await button.click();
  await expect(section.locator(".inspirations-motion")).toHaveAttribute("data-paused", "true");
  await expect(section.getByRole("button", { name: "Retomar movimento" })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(section.locator(".inspirations-motion")).toHaveCount(0);
  await expect(section.locator(".inspirations-list")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
