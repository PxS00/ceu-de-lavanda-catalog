import { test, expect } from "@playwright/test";

test("WhatsApp links follow the current product and return to general context", async ({ page }) => {
  await page.goto("/produtos/acquare/");
  const button = page.locator(".whatsapp-float");
  await expect(button).toHaveAccessibleName("Conversar no WhatsApp sobre Acquaré");
  const productUrl = new URL((await button.getAttribute("href"))!);
  expect(productUrl.pathname).toBe("/5511934640404");
  expect(productUrl.searchParams.get("text")).toContain("Acquaré");
  expect(productUrl.searchParams.get("text")).toContain("/produtos/acquare/");
  await expect(page.getByRole("link", { name: "Falar sobre Acquaré no WhatsApp" })).toHaveAttribute("href", productUrl.href);
  await page.getByRole("link", { name: /Continuar explorando/ }).click();
  await expect(button).toHaveAccessibleName("Conversar no WhatsApp");
  await expect(page.getByRole("link", { name: "Fale com a gente pelo WhatsApp" })).toBeVisible();
  expect(new URL((await button.getAttribute("href"))!).searchParams.get("text")).not.toContain("Acquaré");
});
