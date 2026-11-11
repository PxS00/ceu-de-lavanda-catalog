import { test, expect } from "@playwright/test";

test("spray endpoints follow their note borders across desktop sizes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/familias-olfativas/");
  for (const width of [900, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.locator(".olfactory-story").evaluate((story) => {
      const svg = story.querySelector<SVGSVGElement>(".olfactory-spray")!;
      const scene = story.querySelector<HTMLElement>(".olfactory-scene")!;
      const notes = story.querySelector<HTMLElement>(".olfactory-notes")!;
      const errors = [...svg.querySelectorAll("path")].map((path, index) => {
        const point = path.getPointAtLength(path.getTotalLength());
        const note = notes.children[index] as HTMLElement;
        return Math.abs(point.y * scene.clientHeight / 600 - notes.offsetTop - note.offsetTop);
      });
      return Math.max(...errors);
    })).toBeLessThan(1);
  }
});

test("each spray plays visibly after a normal scroll and can replay", async ({ page }, testInfo) => {
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

test("the spray fades with the returning pump before the next stage", async ({ page }) => {
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

test("the olfactory guide preserves layout before and after hydration", async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/familias-olfativas/");
  await expect(page.locator(".olfactory-story")).toHaveClass(/is-scroll-ready/);
  const hydrated = await page.evaluate(() => ({
    sectionHeight: document.querySelector(".olfactory-story")!.getBoundingClientRect().height,
    guideTop: document.querySelector("#guia-familias")!.getBoundingClientRect().top,
  }));

  // A no-JavaScript context captures the exported SSR layout before useEffect.
  const context = await browser.newContext({
    baseURL: "http://127.0.0.1:4173",
    viewport: page.viewportSize()!,
    reducedMotion: "no-preference",
    javaScriptEnabled: false,
  });
  try {
    const staticPage = await context.newPage();
    await staticPage.goto("/familias-olfativas/");
    const beforeHydration = await staticPage.evaluate(() => ({
      sectionHeight: document.querySelector(".olfactory-story")!.getBoundingClientRect().height,
      guideTop: document.querySelector("#guia-familias")!.getBoundingClientRect().top,
    }));
    expect(Math.abs(hydrated.sectionHeight - beforeHydration.sectionHeight)).toBeLessThan(2);
    expect(Math.abs(hydrated.guideTop - beforeHydration.guideTop)).toBeLessThan(2);
  } finally {
    await context.close();
  }
});
