import { expect, test } from "@playwright/test";

for (const width of [320, 375, 390, 430]) {
  test(`continuous mobile ribbon moves and pauses at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const ticker = page.locator(".phrase-ticker");
    await ticker.scrollIntoViewIfNeeded();
    await expect(ticker).toBeVisible();
    await expect(ticker).toHaveAccessibleName(/^Pausar movimento das frases/);
    const track = ticker.locator(".phrase-ticker-track");
    await expect(track).toHaveCSS("animation-name", "phrase-scroll");
    await expect(track).toHaveCSS("animation-iteration-count", "infinite");
    const before = await track.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41);
    await page.waitForTimeout(500);
    const after = await track.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41);
    expect(after).toBeLessThan(before);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await ticker.tap();
    await expect(track).toHaveCSS("animation-play-state", "paused");
    await expect(page.getByRole("button", { name: /^Retomar movimento das frases/ })).toBeVisible();
    await ticker.tap();
    await expect(track).toHaveCSS("animation-play-state", "running");
    await ticker.focus();
    await ticker.press("Space");
    await expect(track).toHaveCSS("animation-play-state", "paused");
    await ticker.press("Space");
    await expect(track).toHaveCSS("animation-play-state", "running");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(ticker).toHaveCount(0);
    const phrases = page.locator(".phrase-strip p");
    for (const phrase of await phrases.all()) await expect(phrase).toBeVisible();
  });
}
