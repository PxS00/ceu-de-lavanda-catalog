import { test, expect } from "@playwright/test";

test("family discovery opens a shareable filter that combines with search", async ({ page }) => {
  await page.goto("/");
  const link = page.locator(".family-discovery-card").first();
  const family = await link.locator("h3").innerText();
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
