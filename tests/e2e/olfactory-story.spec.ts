import { test, expect } from "@playwright/test";

test("each spray plays visibly after a normal scroll and can replay", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/familias-olfativas/");
  const story = page.locator(".olfactory-story");
  const pump = story.locator(".olfactory-pump-button");
  const spray = (stage: number) => story.locator(`.olfactory-trails path:nth-child(${stage + 1})`);
  await expect(story).toHaveClass(/is-scroll-ready/);
  const scrollTo = async (progress: number) => story.evaluate((el, p) => {
    const scene = el.querySelector(".olfactory-scene") as HTMLElement;
    const stickyTop = Number.parseFloat(getComputedStyle(scene).top) || 0;
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + (el.clientHeight - scene.offsetHeight) * p - stickyTop, behavior: "instant" });
  }, progress);
  await scrollTo(0);
  await expect(spray(0)).toHaveCSS("opacity", "0");
  for (const [progress, stage] of [[.1, 0], [.45, 1], [.78, 2]] as const) {
    await scrollTo(progress);
    await expect(story).toHaveAttribute("data-stage", String(stage));
    await expect.poll(() => pump.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m42)).toBeGreaterThan(3);
    await expect(spray(stage)).toHaveCSS("opacity", "1");
    await page.screenshot({ path: `artifacts/visual-review/spray-${testInfo.project.name}-${stage}.png` });
    await expect(spray(stage)).toHaveCSS("opacity", "0");
    await expect(pump).toHaveCSS("transform", `matrix(1, 0, 0, 1, 0, ${stage === 2 ? 7 : 0})`);
  }
  await scrollTo(1.3);
  await expect(pump).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 7)");
  await scrollTo(0);
  await expect(pump).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  await scrollTo(.1);
  await Promise.all([
    expect.poll(() => spray(0).evaluate(el => Number(getComputedStyle(el).opacity)), { intervals: [50] }).toBeGreaterThan(.25),
    expect.poll(() => pump.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m42), { intervals: [50] }).toBeGreaterThan(3),
  ]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await story.getByRole("link", { name: "Explore as famílias olfativas" }).click();
  await expect(page).toHaveURL(/#guia-familias$/);
  await expect(page.getByRole("heading", { name: "Qual aroma combina com você?" })).toBeInViewport();
});

test("the spray fades with the returning pump before the next stage", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/familias-olfativas/");
  const story = page.locator(".olfactory-story");
  const pump = story.locator(".olfactory-pump-button");
  const spray = (stage: number) => story.locator(`.olfactory-trails path:nth-child(${stage + 1})`);
  const scrollTo = async (progress: number) => story.evaluate((el, p) => {
    const scene = el.querySelector(".olfactory-scene") as HTMLElement;
    const stickyTop = Number.parseFloat(getComputedStyle(scene).top) || 0;
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + (el.clientHeight - scene.offsetHeight) * p - stickyTop, behavior: "instant" });
  }, progress);
  await scrollTo(0);
  for (const [progress, index] of [[.1, 0], [.45, 1]] as const) {
    await scrollTo(progress);
    await expect(story).toHaveAttribute("data-stage", String(index));
    const line = spray(index);
    await expect.poll(() => line.evaluate(el => el.getAnimations().length)).toBeGreaterThan(0);
    await expect.poll(() => line.evaluate(el => el.getAnimations()[0]?.effect?.getTiming().duration)).toBe(1800);
    const state = await story.evaluate((el, stage) => {
      const targets = [el.querySelector(".olfactory-pump-button")!, ...el.querySelectorAll(`.olfactory-spray path:nth-child(${stage + 1})`)];
      for (const target of targets) for (const animation of target.getAnimations()) { animation.pause(); animation.currentTime = 1550; }
      const pump = el.querySelector(".olfactory-pump-button")!;
      const line = el.querySelector(`.olfactory-spray path:nth-child(${stage + 1})`)!;
      return { pressure: new DOMMatrix(getComputedStyle(pump).transform).m42, opacity: Number(getComputedStyle(line).opacity) };
    }, index);
    expect(state.pressure).toBeGreaterThan(0);
    expect(state.pressure).toBeLessThan(7);
    expect(state.opacity).toBeGreaterThan(0);
    expect(state.opacity).toBeLessThan(1);
    await story.evaluate((el, stage) => {
      for (const target of [el.querySelector(".olfactory-pump-button")!, ...el.querySelectorAll(`.olfactory-spray path:nth-child(${stage + 1})`)]) {
        for (const animation of target.getAnimations()) animation.finish();
      }
    }, index);
    await expect(line).toHaveCSS("opacity", "0");
    await expect(pump).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  }
  await scrollTo(.78);
  await expect(story).toHaveAttribute("data-stage", "2");
  await expect.poll(() => spray(2).evaluate(el => el.getAnimations().length)).toBeGreaterThan(0);
  await story.evaluate(el => {
    for (const target of [el.querySelector(".olfactory-pump-button")!, ...el.querySelectorAll(".olfactory-spray path:nth-child(3)")]) {
      for (const animation of target.getAnimations()) animation.finish();
    }
  });
  await expect(spray(2)).toHaveCSS("opacity", "0");
  await expect(pump).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 7)");
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

test("mobile shows all notes without animating the pump", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const size of [{ width: 320, height: 568 }, { width: 375, height: 667 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(size);
    await page.goto("/familias-olfativas/");
    const story = page.locator(".olfactory-story");
    const pump = story.locator(".olfactory-pump-button");
    await expect(story).not.toHaveClass(/is-scroll-ready/);
    await expect.poll(() => story.locator(".olfactory-scene").evaluate(el => getComputedStyle(el, "::before").animationName)).toBe("olfactory-mobile-mist");
    await expect(story.locator(".olfactory-note")).toHaveCount(3);
    for (const note of await story.locator(".olfactory-note").all()) await expect(note).toBeVisible();
    await story.locator(".olfactory-note").last().scrollIntoViewIfNeeded();
    await expect(pump).toHaveCSS("transform", "none");
    expect(await pump.evaluate(el => el.getAnimations().length)).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await story.screenshot({ path: "artifacts/visual-review/olfactory-static-mobile-" + size.width + ".png" });
    await story.getByRole("link", { name: "Explore as famílias olfativas" }).click();
    await expect(page).toHaveURL(/#guia-familias$/);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => page.locator(".olfactory-scene").evaluate(el => getComputedStyle(el, "::before").animationName)).toBe("none");
});
