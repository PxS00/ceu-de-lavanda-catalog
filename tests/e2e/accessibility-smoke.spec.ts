import { test, expect } from "@playwright/test";

test("imagens do guia carregadas sob demanda têm dimensões válidas", async ({ page }) => {
  await page.goto("/familias-olfativas/");
  const images = page.locator('img[loading="lazy"]');
  expect(await images.count()).toBeGreaterThan(0);
  for (const image of await images.all()) {
    await expect(image).toHaveAttribute("width", /^[1-9]\d*$/);
    await expect(image).toHaveAttribute("height", /^[1-9]\d*$/);
  }
});

test("confirmação do Google está presente somente no build do endereço principal", async ({ page }) => {
  await page.goto("/");
  const tag = page.locator('meta[name="google-site-verification"]');
  if (process.env.CATALOG_SITE_URL === "https://ceu-de-lavanda.pages.dev") {
    await expect(tag).toHaveAttribute("content", /.+/);
  } else {
    await expect(tag).toHaveCount(0);
  }
});

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
