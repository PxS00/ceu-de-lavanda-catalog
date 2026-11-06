import { test, expect } from "@playwright/test";

test("each guide card expands its catalog options independently", async ({ page }) => {
  await page.goto("/familias-olfativas/");
  const card = page.locator(".family-guide-card").filter({ has: page.locator(".family-guide-more") }).first();
  await expect(card.locator(".family-guide-links a:visible")).toHaveCount(3);
  const more = card.locator(".family-guide-more");
  await more.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(more).toHaveAttribute("open", "");
  await expect(more.locator("a").first()).toBeVisible();
  await more.locator("summary").click();
  await expect(more).not.toHaveAttribute("open");
});

test("family guide links to actual perfume pages and catalog filter remains shareable", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Conhecer as famílias olfativas ↗" }).click();
  await expect(page).toHaveURL("/familias-olfativas/");
  const link = page.locator(".family-guide-links a").first();
  const name = (await link.innerText()).replace(" ↗", "");
  await link.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
  const family = "Floral Frutada";
  await page.goto("/catalogo/?familia=" + encodeURIComponent(family));
  await expect(page.getByRole("combobox", { name: "Família olfativa" })).toHaveValue(family);
  await page.reload();
  await expect(page.getByRole("combobox", { name: "Família olfativa" })).toHaveValue(family);
  await page.getByRole("searchbox").fill("inexistente");
  await expect(page.locator(".catalog").getByRole("status")).toHaveText("0 fragrâncias");
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(page.getByRole("combobox", { name: "Família olfativa" })).toHaveValue("");
  await page.goBack();
  await expect(page.getByRole("combobox", { name: "Família olfativa" })).toHaveValue(family);
});
