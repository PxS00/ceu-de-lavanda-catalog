import { test, expect } from "@playwright/test";

// Smoke checks prevent structural regressions; an axe-core audit is a separate CI gate.
for (const path of ["/", "/catalogo/", "/produtos/acquare/"]) {
  test(`navegação e semântica acessíveis em ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("main#conteudo")).toHaveCount(1);
    await expect(page.locator("main h1")).toHaveCount(1);
    expect(await page.locator("img:not([alt])").count()).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.keyboard.press("Tab");
    const first = await page.locator(":focus").getAttribute("href");
    expect(first).toBe("#conteudo");
    await page.keyboard.press("Enter");
    expect(new URL(page.url()).hash).toBe("#conteudo");
  });
}
