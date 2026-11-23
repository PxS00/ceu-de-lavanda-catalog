import { test, expect } from "@playwright/test";

test("each guide card expands its catalog options independently", async ({ page }) => {
  await page.goto("/familias-olfativas/");
  const card = page.locator(".family-guide-card").filter({ has: page.locator(".family-perfumes-toggle") }).first();
  await expect(card.locator(".family-guide-links a:visible")).toHaveCount(3);
  const more = card.locator(".family-perfumes-toggle");
  await more.focus();
  await page.keyboard.press("Enter");
  await expect(more).toHaveAttribute("aria-expanded", "true");
  const links = card.locator(".family-guide-links");
  expect((await more.boundingBox())!.y).toBeGreaterThan((await links.boundingBox())!.y + (await links.boundingBox())!.height);
  await more.click();
  await expect(more).toHaveAttribute("aria-expanded", "false");
});

test("family guide links to actual perfume pages and catalog filter remains shareable", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Conhecer as famílias olfativas ↗" }).click();
  await expect(page).toHaveURL("/familias-olfativas/");
  const link = page.locator(".family-guide-links a").first();
  const name = (await link.innerText()).replace(" ↗", "");
  await link.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
  const family = "Floral";
  await page.goto("/catalogo/?familia=Floral%20Frutada");
  await expect(page.getByRole("combobox", { name: "Família olfativa" })).toHaveValue(family);
  await expect(page.getByRole("option", { name: "Floral Frutada", exact: true })).toHaveCount(0);
  const cards = page.locator(".product-card");
  await expect(cards.first().locator(".product-card-profile")).toHaveText(/ · Floral$/);
  await cards.getByRole("heading", { name: "Acquaré", exact: true }).click();
  await expect(page.locator(".detail-family").filter({ hasText: "Família olfativa" })).toContainText("Floral Frutada");
  await page.goBack();
  await page.reload();
  await expect(page.getByRole("combobox", { name: "Família olfativa" })).toHaveValue(family);
  await page.getByRole("searchbox").fill("inexistente");
  await expect(page.locator(".catalog").getByRole("status")).toHaveText("0 fragrâncias");
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(page.getByRole("combobox", { name: "Família olfativa" })).toHaveValue("");
  await page.goBack();
  await expect(page.getByRole("combobox", { name: "Família olfativa" })).toHaveValue(family);
});

test("family guide groups perfumes by their primary family", async ({ page }) => {
  await page.goto("/familias-olfativas/");
  const aromatic = page.locator("#aromatica");
  await expect(aromatic.getByRole("heading", { name: "Aromática (Fougère)" })).toBeVisible();
  await expect(aromatic).toContainText("Mare di Velluto");
  await expect(aromatic).toContainText("Bleu Maritime");
  await expect(aromatic).not.toContainText("Instinto");
  const floral = page.locator("#floral");
  await expect(floral).toContainText("Acquaré");
  const oriental = page.locator("#oriental");
  await expect(oriental).not.toContainText("Acquaré");
});

test("the guide keeps Frutal and Gourmand visible without primary-family matches", async ({ page }) => {
  await page.goto("/familias-olfativas/");
  for (const [id, name] of [["frutado", "Frutal"]]) {
    const card = page.locator(`#${id}`);
    await expect(card.getByRole("heading", { name, exact: true })).toBeVisible();
    await expect(card).toContainText("Em breve, novas fragrâncias nesta família.");
  }
});

test("Gourmand appears in the guide and filters alongside the primary family", async ({ page }) => {
  await page.goto("/familias-olfativas/");
  await expect(page.locator("#gourmand")).toContainText("Belle Vanille");
  await page.goto("/catalogo/?familia=Gourmand");
  await expect(page.getByRole("combobox", { name: "Família olfativa" })).toHaveValue("Gourmand");
  const card = page.locator(".product-card").filter({ has: page.getByRole("heading", { name: "Belle Vanille", exact: true }) });
  await expect(card.locator(".product-card-profile")).toContainText("Oriental Gourmand");
  await page.getByRole("combobox", { name: "Família olfativa" }).selectOption("Oriental");
  await expect(card).toBeVisible();
});
