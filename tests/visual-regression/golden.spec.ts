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
  // Lazy-loaded product photos must be fetched before taking full-page screenshots.
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
    for (const image of images) image.loading = "eager";
    await Promise.all(images.map(async (image) => {
      if (!image.complete) {
        await new Promise<void>((resolve, reject) => {
          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener("error", () => reject(new Error("Image failed: " + image.src)), { once: true });
        });
      }
      await image.decode();
    }));
  });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
}

for (const scenario of scenarios) {
  test(`golden: ${scenario.name}`, async ({ page }) => {
    await stabilize(page);
    await page.goto(scenario.url);
    await prepareScreenshot(page);
    await expect(page).toHaveScreenshot(`${scenario.name}.png`, {
      fullPage: true,
      animations: "disabled",
    });
  });
}
