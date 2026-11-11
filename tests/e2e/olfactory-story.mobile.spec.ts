import { test, expect } from "@playwright/test";

test("mobile shows all notes without animating the pump", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const size of [{ width: 320, height: 568 }, { width: 375, height: 667 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(size);
    await page.goto("/familias-olfativas/");
    const story = page.locator(".olfactory-story");
    const pump = story.locator(".olfactory-pump-button");
    await expect(story).not.toHaveClass(/is-scroll-ready/);
    await expect(story.locator(".olfactory-note")).toHaveCount(3);
    for (const note of await story.locator(".olfactory-note").all()) await expect(note).toBeVisible();
    await story.locator(".olfactory-note").last().scrollIntoViewIfNeeded();
    await expect(pump).toHaveCSS("transform", "none");
    expect(await pump.evaluate(el => el.getAnimations().length)).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const spacing = await story.evaluate(el => ({ bottom: el.getBoundingClientRect().bottom, footer: el.querySelector(".olfactory-scene-footer")!.getBoundingClientRect().bottom, guide: document.querySelector("#guia-familias")!.getBoundingClientRect().top }));
    expect(spacing.bottom - spacing.footer).toBeLessThanOrEqual(12);
    expect(Math.abs(spacing.guide - spacing.bottom)).toBeLessThanOrEqual(1);
    await expect(story.locator(".olfactory-mobile-spray")).toHaveCount(0);
    await story.screenshot({ path: "artifacts/visual-review/olfactory-static-mobile-" + size.width + ".png" });
    await story.getByRole("link", { name: "Explore as famílias olfativas" }).click();
    await expect(page).toHaveURL(/#guia-familias$/);
  }
});
