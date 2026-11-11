import { test, expect } from "@playwright/test";

test("reduced motion presents every note without animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/familias-olfativas/");
  const story = page.locator(".olfactory-story");
  await story.scrollIntoViewIfNeeded();
  await expect(story).not.toHaveClass(/is-scroll-ready/);
  await expect(story.locator(".olfactory-pump-button")).toHaveCSS("transform", "none");
  for (const note of await story.locator(".olfactory-note").all()) await expect(note).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("notes remain readable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(new URL("/familias-olfativas/", baseURL!).href);
  const story = page.locator(".olfactory-story");
  await story.scrollIntoViewIfNeeded();
  await expect(story.locator(".olfactory-note")).toHaveCount(3);
  for (const note of await story.locator(".olfactory-note").all()) await expect(note).toBeVisible();
  await context.close();
});

