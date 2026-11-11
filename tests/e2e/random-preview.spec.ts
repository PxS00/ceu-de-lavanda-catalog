import { test, expect } from "@playwright/test";
import catalogProducts from "../../src/features/catalog/data/products.json";
import { randomSelection } from "../../src/features/home/lib/random-selection";

test("homepage samples four products on each visit, preserving unique links", async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => location.search.includes("second") ? 0.999 : 0; });
  for (const value of [0, 0.999]) {
    await page.goto(value === 0 ? "/?first" : "/?second");
    const cards = page.locator(".collection-preview .product-card");
    const expected = randomSelection(catalogProducts, 4, () => value).map(product => `/produtos/${product.slug}/`);
    await expect.poll(() => cards.evaluateAll(nodes => nodes.map(node => node.getAttribute("href")))).toEqual(expected);
    expect(new Set(expected).size).toBe(Math.min(4, catalogProducts.length));
  }
});
