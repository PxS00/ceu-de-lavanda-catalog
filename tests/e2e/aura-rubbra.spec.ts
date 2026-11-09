import { test, expect } from "@playwright/test";

test("new fragrance and corrected genders appear in the catalog", async ({ page }) => {
  await page.goto("/catalogo/perfumes/?genero=masculino");
  const cards = page.locator(".product-card");
  await expect(cards).toHaveCount(2);
  await expect(cards.filter({ hasText: "Imperator" })).toBeVisible();
  await expect(cards.filter({ hasText: "Bourbon Noir" })).toBeVisible();
  await page.goto("/produtos/imperator/");
  await expect(page.locator(".detail-copy")).toContainText("Masculino");
  await expect(page.locator(".detail-copy")).not.toContainText("Compartilhável");
  await page.goto("/produtos/aura-rubbra/");
  await expect(page.getByRole("heading", { name: "Aura Rubbra", exact: true })).toBeVisible();
  await expect(page.locator(".detail-copy")).toContainText("Feminino");
  await expect(page.locator(".detail-copy")).toContainText("Cardamomo Preto");
  await expect(page.getByText("Fotografia em breve").first()).toBeVisible();
});
