import { expect, test } from "@playwright/test";

for (const width of [320, 375, 390, 430]) {
  test(`mobile ribbon fits and rotates accessibly at ${width}px`, async ({ page }, info) => {
    test.skip(info.project.name !== "mobile");
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.clock.install();
    await page.goto("/");
    const strip = page.locator(".phrase-strip");
    await expect(strip).toHaveAttribute("data-carousel", "true");
    await page.evaluate(() => document.fonts.ready);
    const phrases = strip.locator("p");
    for (let index = 0; index < 3; index++) {
      const phrase = phrases.nth(index);
      await expect(phrase).toBeVisible();
      const fit = await phrase.evaluate(element => {
        const box = element.getBoundingClientRect();
        const parent = element.parentElement!.getBoundingClientRect();
        return { fits: element.scrollWidth <= element.clientWidth + 1 && box.left >= parent.left && box.right <= parent.right, height: box.height, line: parseFloat(getComputedStyle(element).lineHeight), pageWidth: document.documentElement.scrollWidth <= innerWidth };
      });
      expect(fit.fits && fit.pageWidth).toBe(true);
      expect(fit.height).toBeLessThanOrEqual(fit.line + 1);
      if (index < 2) await page.clock.runFor(5000);
    }
    const pause = page.getByRole("button", { name: "Pausar troca de frases" });
    await pause.focus();
    await page.clock.runFor(6000);
    await expect(phrases.nth(2)).toBeVisible();
    await pause.press("Enter");
    await expect(page.getByRole("button", { name: "Retomar troca de frases" })).toBeVisible();
    await page.locator("h1").click({ force: true });
    await page.clock.runFor(6000);
    await expect(phrases.nth(2)).toBeVisible();
    await page.getByRole("button", { name: "Retomar troca de frases" }).click();
    await page.locator("h1").click({ force: true });
    await page.clock.runFor(5000);
    await expect(phrases.nth(0)).toBeVisible();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(strip).toHaveAttribute("data-carousel", "false");
    for (const phrase of await phrases.all()) await expect(phrase).toBeVisible();
    await expect(page.getByRole("button", { name: /troca de frases/ })).toHaveCount(0);
  });
}
