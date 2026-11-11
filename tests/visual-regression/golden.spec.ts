import { expect, test, type Page } from "@playwright/test";

const scenarios = [
  { name: "home", url: "/" },
  { name: "catalog", url: "/catalogo/" },
  { name: "product-acquare", url: "/produtos/acquare/" },
] as const;

// Avoid changing snapshots when the four home highlights are randomly selected.
async function stabilize(page: Page) {
  await page.addInitScript(() => {
    Math.random = () => 0.25;
  });
}

async function prepareScreenshot(page: Page) {
  await page.evaluate(() => document.fonts.ready);

  // The homepage replaces its initial four cards after hydration. Make sure
  // those client-rendered images exist before resolving lazy loading.
  await page.locator("img").evaluateAll((images) => {
    for (const image of images) image.loading = "eager";
  });
  await expect.poll(
    () => page.locator("img").evaluateAll((images) =>
      images.every((image) =>
        image.complete &&
        image.naturalWidth > 0 &&
        image.naturalHeight > 0 &&
        Boolean(image.currentSrc),
      ),
    ),
    { timeout: 20_000 },
  ).toBe(true);
  await page.locator("img").evaluateAll(async (images) => {
    await Promise.all(images.map((image) => image.decode()));
  });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
}

for (const scenario of scenarios) {
  test(`golden: ${scenario.name}`, async ({ page }) => {
    await stabilize(page);
    await page.goto(scenario.url);
    if (scenario.name === "home") {
      // Wait for the client-side random selection instead of capturing the SSR fallback.
      await expect(page.locator(".collection-preview .product-grid")).toHaveAttribute("data-selection-ready", "true");
      await expect(page.locator(".collection-preview .product-card")).toHaveCount(4);
    }
    await prepareScreenshot(page);
    await expect(page).toHaveScreenshot(`${scenario.name}.png`, {
      fullPage: true,
      animations: "disabled",
    });
  });
}
