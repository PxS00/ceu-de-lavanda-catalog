import { test, expect } from "@playwright/test";

test("family guide expands and collapses the remaining families", async ({ page }) => {
  await page.goto("/familias-olfativas/");
  await expect(page.locator(".family-guide-card:visible")).toHaveCount(4);
  const more = page.locator(".family-guide-more");
  await more.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(more).toHaveAttribute("open", "");
  await expect(more.locator(".family-guide-card").first()).toBeVisible();
  await more.locator("summary").click();
  await expect(more).not.toHaveAttribute("open");
});

test("family discovery opens a shareable filter that combines with search", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Conhecer as famílias olfativas ↗" }).click();
  await expect(page).toHaveURL("/familias-olfativas/");
  const link = page.locator(".family-guide-links a").first();
  const family = (await link.innerText()).replace(" ↗", "");
  await link.click();
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
