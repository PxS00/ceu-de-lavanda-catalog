import { test, expect } from "@playwright/test";

test("each spray plays visibly after a normal scroll and can replay", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/familias-olfativas/");
  const story = page.locator(".olfactory-story");
  const pump = story.locator(".olfactory-pump-button");
  const spray = story.locator(page.viewportSize()!.width <= 1050 ? ".olfactory-pump-trails" : ".olfactory-trails");
  await expect(story).toHaveClass(/is-scroll-ready/);
  const scrollTo = async (progress: number) => story.evaluate((el, p) => {
    const scene = el.querySelector(".olfactory-scene") as HTMLElement;
    const stickyTop = Number.parseFloat(getComputedStyle(scene).top) || 0;
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + (el.clientHeight - scene.offsetHeight) * p - stickyTop, behavior: "instant" });
  }, progress);
  await scrollTo(0);
  await expect(spray.locator("path").first()).toHaveCSS("opacity", "0");
  for (const [progress, stage] of [[.1, 0], [.45, 1], [.78, 2]] as const) {
    await scrollTo(progress);
    await expect(story).toHaveAttribute("data-stage", String(stage));
    await expect.poll(() => pump.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m42)).toBeGreaterThan(3);
    await expect(spray.locator("path").nth(stage)).toHaveCSS("opacity", "1");
    await page.screenshot({ path: `artifacts/visual-review/spray-${testInfo.project.name}-${stage}.png` });
    await expect(spray.locator("path").nth(stage)).toHaveCSS("opacity", "0");
    await expect(pump).toHaveCSS("transform", `matrix(1, 0, 0, 1, 0, ${stage === 2 ? 7 : 0})`);
  }
  await scrollTo(1.3);
  await expect(pump).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 7)");
  await scrollTo(0);
  await expect(pump).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  await scrollTo(.1);
  await Promise.all([
    expect.poll(() => spray.locator("path").first().evaluate(el => Number(getComputedStyle(el).opacity)), { intervals: [50] }).toBeGreaterThan(.25),
    expect.poll(() => pump.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m42), { intervals: [50] }).toBeGreaterThan(3),
  ]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await story.getByRole("link", { name: "Explore as famílias olfativas" }).click();
  await expect(page).toHaveURL(/#guia-familias$/);
  await expect(page.getByRole("heading", { name: "Qual aroma combina com você?" })).toBeInViewport();
});

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
