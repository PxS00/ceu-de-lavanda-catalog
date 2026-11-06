import { expect, test } from "@playwright/test";

for (const width of [320, 390, 768, 1050, 1051, 1440]) {
  test(`hero and ribbon adapt at ${width}px`, async ({ page }, info) => {
    test.skip(info.project.name !== "desktop");
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const ticker = page.locator(".phrase-ticker");
    if (width <= 1050) await expect(ticker).toBeVisible();
    else await expect(ticker).toHaveCount(0);
    if (width <= 760) {
      const copy = page.locator(".hero-copy");
      await expect(copy).toHaveCSS("text-align", "center");
      const centered = await copy.evaluate(el => {
        const box = el.getBoundingClientRect();
        const button = el.querySelector(".button")!.getBoundingClientRect();
        return Math.abs((box.left + box.right) / 2 - (button.left + button.right) / 2);
      });
      expect(centered).toBeLessThan(2);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(ticker).toHaveCount(0);
    for (const phrase of await page.locator(".phrase-strip p").all()) await expect(phrase).toBeVisible();
  });
}
