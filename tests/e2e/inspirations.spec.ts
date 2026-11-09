import { test, expect } from "@playwright/test";

test("inspirations remain readable, pausable and non-interactive", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const section = page.locator(".inspirations");
  await expect(section.locator(".inspirations-list li")).toHaveCount(15);
  await expect(section.locator(".inspirations-list a")).toHaveCount(0);
  const button = section.getByRole("button", { name: "Pausar movimento das inspirações" });
  await expect(button).toBeVisible();
  await expect(section.locator(".inspirations-row")).toHaveCount(page.viewportSize()!.width <= 760 ? 3 : 2);
  await expect(section.locator(".inspirations-item img").first()).toHaveAttribute("src", /lavender-ornament-gold/);
  await button.click();
  await expect(section.locator(".inspirations-motion")).toHaveAttribute("data-paused", "true");
  await expect(section.getByRole("button", { name: "Retomar movimento das inspirações" })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(section.locator(".inspirations-motion")).toHaveCount(0);
  await expect(section.locator(".inspirations-list")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("mobile shows three continuous rows and adapts when resized", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const width of [320, 375, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    const section = page.locator(".inspirations");
    const rows = section.locator(".inspirations-row");
    await expect(rows).toHaveCount(3);
    for (const row of await rows.all()) {
      const groups = row.locator(".inspirations-group");
      await expect(groups).toHaveCount(2);
      expect(await groups.first().textContent()).toEqual(await groups.last().textContent());
    }
    const names = await section.locator(".inspirations-row .inspirations-group:first-child .inspirations-item > span").allTextContents();
    expect(new Set(names).size).toBe(15);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await section.screenshot({ path: "artifacts/visual-review/inspirations-mobile-" + width + ".png" });
  }
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(page.locator(".inspirations-row")).toHaveCount(2);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".inspirations-row")).toHaveCount(3);
});
