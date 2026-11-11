import { test, expect } from "@playwright/test";

for (const javaScriptEnabled of [true, false]) {
  test.describe(`inspirations removed (JavaScript ${javaScriptEnabled})`, () => {
    test.use({ javaScriptEnabled });
    test("home omits the ribbon and preserves adjacent sections", async ({ page }) => {
      for (const reducedMotion of ["reduce", "no-preference"] as const) {
        await page.emulateMedia({ reducedMotion });
        await page.goto("/");
        await expect(page.locator(".inspirations, #inspirations-title")).toHaveCount(0);
        await expect(page.getByText("Aromas que despertam lembranças", { exact: true })).toHaveCount(0);
        await expect(page.locator(".phrase-strip")).toBeAttached();
        await page.locator("#preview-title").scrollIntoViewIfNeeded();
        await expect(page.locator("#preview-title")).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
    });
  });
}
