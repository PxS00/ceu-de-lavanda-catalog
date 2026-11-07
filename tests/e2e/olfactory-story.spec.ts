import { test, expect } from "@playwright/test";

test("scroll reveals the three olfactory moments and reverses with the page", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/familias-olfativas/");
  const story = page.locator(".olfactory-story");
  await expect(story).toHaveClass(/is-scroll-ready/);
  await expect(page.locator("main > :first-child")).toHaveClass(/olfactory-story/);
  const scrollDistance = await story.evaluate(el => el.clientHeight - (el.firstElementChild as HTMLElement).offsetHeight);
  expect(scrollDistance).toBeLessThanOrEqual(page.viewportSize()!.height * .75);
  const scrollTo = async (progress: number) => {
    await story.evaluate((el, p) => {
      const scene = el.querySelector(".olfactory-scene") as HTMLElement;
      const stickyTop = Number.parseFloat(getComputedStyle(scene).top) || 0;
      window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + (el.clientHeight - scene.offsetHeight) * p - stickyTop, behavior: "instant" });
    }, progress);
  };
  await scrollTo(0);
  await expect.poll(() => story.locator(".olfactory-pump-button").evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m42)).toBeLessThan(.25);
  await page.screenshot({ path: `artifacts/visual-review/spray-${testInfo.project.name}-rest.png` });
  await scrollTo(.3);
  await expect(story.locator(".olfactory-pump-button")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  await scrollTo(.22);
  const firstConnector = story.locator(page.viewportSize()!.width <= 1050 ? ".olfactory-pump-trails" : ".olfactory-trails").locator("path").first();
  await expect(story.locator(".olfactory-pump-button")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  await expect.poll(() => firstConnector.evaluate(el => Number(getComputedStyle(el).opacity))).toBeLessThan(.1);
  await scrollTo(.32);
  await expect(firstConnector).toHaveCSS("opacity", "0");
  for (const [progress, stage] of [[.1, "0"], [.45, "1"], [.78, "2"]] as const) {
    await scrollTo(progress);
    await expect(story).toHaveAttribute("data-stage", stage);
    const note = story.locator(".olfactory-note").nth(Number(stage));
    await expect(note).toHaveCSS("opacity", "1");
    if (page.viewportSize()!.width <= 1050) {
      await expect(story.locator(".olfactory-note:visible")).toHaveCount(1);
    }
    const bounds = await note.boundingBox();
    const viewport = page.viewportSize()!;
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height);
    const spray = story.locator(viewport.width <= 1050 ? ".olfactory-pump-trails" : ".olfactory-trails");
    await expect(spray.locator("path").nth(Number(stage))).toHaveCSS("opacity", "1");
    for (let index = 0; index < 3; index++) {
      await expect(spray.locator("path").nth(index)).toHaveCSS("opacity", index === Number(stage) ? "1" : "0");
    }
    await expect(story.locator(".olfactory-pump-button")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 7)");
    expect(await story.locator(".olfactory-scene").evaluate(el => Math.abs(el.getBoundingClientRect().top - Number.parseFloat(getComputedStyle(el).top)))).toBeLessThan(2);
    await page.screenshot({ path: `artifacts/visual-review/spray-${testInfo.project.name}-${stage}.png` });
  }
  const finalSpray = story.locator(page.viewportSize()!.width <= 1050 ? ".olfactory-pump-trails" : ".olfactory-trails").locator("path").nth(2);
  await page.waitForTimeout(250);
  await expect(finalSpray).toHaveCSS("opacity", "1");
  await scrollTo(.67);
  await expect(story).toHaveAttribute("data-stage", "2");
  await expect(story.locator(".olfactory-pump-button")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 7)");
  await scrollTo(.99);
  await expect(story.locator(".olfactory-pump-button")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 7)");
  await expect(finalSpray).toHaveCSS("opacity", "1");
  await scrollTo(1.3);
  await expect(story.locator(".olfactory-pump-button")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 7)");
  await expect(story.locator(".olfactory-story-art > img")).toHaveAttribute("src", /olfactory-pump-plate/);
  await expect(story.locator(".olfactory-scene-footer")).toHaveCSS("background-color", "rgb(255, 248, 238)");
  await scrollTo(.1);
  await expect(story).toHaveAttribute("data-stage", "0");
  await expect(story.locator(".olfactory-pump-button")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 7)");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await story.getByRole("link", { name: "Explore as famílias olfativas" }).click();
  await expect(page).toHaveURL(/#guia-familias$/);
  await expect(page.getByRole("heading", { name: "Qual aroma combina com você?" })).toBeInViewport();
});

test("reduced motion presents every note without a pinned scroll scene", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/familias-olfativas/");
  const story = page.locator(".olfactory-story");
  await story.scrollIntoViewIfNeeded();
  await expect(story).not.toHaveClass(/is-scroll-ready/);
  await expect(story.locator(".olfactory-scene")).toHaveCSS("position", "relative");
  await expect(story.locator(".olfactory-mist")).toHaveCount(0);
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
