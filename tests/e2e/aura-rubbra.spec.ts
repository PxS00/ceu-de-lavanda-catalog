import { test, expect } from "@playwright/test";

test("new fragrance and corrected genders appear in the catalog", async ({ page }) => {
  await page.goto("/catalogo/perfumes/?genero=masculino");
  const cards = page.locator(".product-card");
  await expect(cards).toHaveCount(2);
  await expect(cards.filter({ hasText: "Imperator" })).toBeVisible();
  await expect(cards.filter({ hasText: "Bourbon Noir" })).toBeVisible();
  for (const name of ["Imperator", "Bourbon Noir"]) {
    const photo = cards.filter({ hasText: name }).getByRole("img", { name: `Frasco do perfume ${name}` });
    await expect(photo).toBeVisible();
    await expect.poll(() => photo.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  }
  await page.goto("/produtos/imperator/");
  await expect(page.locator(".detail-copy")).toContainText("Masculino");
  await expect(page.locator(".detail-copy")).not.toContainText("Compartilhável");
  await page.goto("/produtos/aura-rubbra/");
  await expect(page.getByRole("heading", { name: "Aura Rubbra", exact: true })).toBeVisible();
  await expect(page.locator(".detail-copy")).toContainText("Feminino");
  await expect(page.locator(".detail-copy")).toContainText("Cardamomo Preto");
  await expect(page.getByRole("img", { name: "Frasco do perfume Aura Rubbra" })).toBeVisible();
});
