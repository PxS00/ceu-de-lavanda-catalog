import { test, expect } from "@playwright/test";

test("each spray plays visibly after a normal scroll and can replay", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/familias-olfativas/");
  const story = page.locator(".olfactory-story");
  const pump = story.locator(".olfactory-pump-button");
  const spray = story.locator(page.viewportSize()!.width <= 1050 ? ".olfactory-mobile-trails" : ".olfactory-trails");
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

test("the spray fades with the returning pump before the next stage", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/familias-olfativas/");
  const story = page.locator(".olfactory-story");
  const pump = story.locator(".olfactory-pump-button");
  const spray = story.locator(page.viewportSize()!.width <= 1050 ? ".olfactory-mobile-trails" : ".olfactory-trails");
  const scrollTo = async (progress: number) => story.evaluate((el, p) => {
    const scene = el.querySelector(".olfactory-scene") as HTMLElement;
    const stickyTop = Number.parseFloat(getComputedStyle(scene).top) || 0;
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + (el.clientHeight - scene.offsetHeight) * p - stickyTop, behavior: "instant" });
  }, progress);
  await scrollTo(0);
  for (const [progress, index] of [[.1, 0], [.45, 1]] as const) {
    await scrollTo(progress);
    await expect(story).toHaveAttribute("data-stage", String(index));
    const line = spray.locator("path").nth(index);
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
  await expect.poll(() => spray.locator("path").nth(2).evaluate(el => el.getAnimations().length)).toBeGreaterThan(0);
  await story.evaluate(el => {
    for (const target of [el.querySelector(".olfactory-pump-button")!, ...el.querySelectorAll(".olfactory-spray path:nth-child(3)")]) {
      for (const animation of target.getAnimations()) animation.finish();
    }
  });
  await expect(spray.locator("path").nth(2)).toHaveCSS("opacity", "0");
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

test("mobile spray stays near the nozzle without overlapping content", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const size of [{ width: 320, height: 568 }, { width: 375, height: 667 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(size);
    await page.goto("/familias-olfativas/");
    const story = page.locator(".olfactory-story");
    await expect(story).toHaveClass(/is-scroll-ready/);
    await story.evaluate(el => {
      const scene = el.querySelector(".olfactory-scene") as HTMLElement;
      window.scrollTo(0, el.getBoundingClientRect().top + scrollY + (el.clientHeight - scene.offsetHeight) * .45);
    });
    await expect(story).toHaveAttribute("data-stage", "1");
    const layout = await story.evaluate(el => {
      const rect = (selector: string) => el.querySelector(selector)!.getBoundingClientRect();
      const note = rect(".olfactory-note:nth-child(2) dd");
      const footer = rect(".olfactory-scene-footer");
      const heading = rect(".olfactory-heading");
      const nozzle = rect(".olfactory-nozzle");
      const line = el.querySelector<SVGPathElement>(".olfactory-mobile-trails path:nth-child(2)")!;
      const start = line.getPointAtLength(0).matrixTransform(line.getScreenCTM()!);
      const end = line.getPointAtLength(line.getTotalLength()).matrixTransform(line.getScreenCTM()!);
      const art = rect(".olfactory-story-art");
      return { noteBottom: note.bottom, footerTop: footer.top, footerBottom: footer.bottom, headingTop: heading.top, startX: start.x, startY: start.y, nozzleX: nozzle.x + nozzle.width / 2, nozzleY: nozzle.y + nozzle.height / 2, endX: end.x, endY: end.y, artRight: art.right, artBottom: art.bottom, scrollWidth: document.documentElement.scrollWidth };
    });
    expect(layout.headingTop).toBeGreaterThanOrEqual(90);
    expect(layout.noteBottom).toBeLessThanOrEqual(layout.footerTop);
    expect(layout.footerBottom).toBeLessThanOrEqual(size.height);
    expect(Math.abs(layout.startX - layout.nozzleX)).toBeLessThan(2);
    expect(Math.abs(layout.startY - layout.nozzleY)).toBeLessThan(2);
    expect(layout.endX).toBeGreaterThan(layout.startX);
    expect(layout.endX - layout.startX).toBeLessThanOrEqual(80);
    expect(Math.abs(layout.endY - layout.startY)).toBeLessThanOrEqual(20);
    expect(layout.endX).toBeLessThan(layout.artRight);
    expect(layout.endY).toBeLessThan(layout.artBottom);
    expect(layout.scrollWidth).toBeLessThanOrEqual(size.width);
    await page.screenshot({ path: `artifacts/visual-review/olfactory-mobile-${size.width}.png` });
  }
});
