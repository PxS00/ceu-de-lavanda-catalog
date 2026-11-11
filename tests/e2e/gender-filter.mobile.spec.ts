import { expect, test } from "@playwright/test";

test("shortcuts and filters fit a narrow mobile screen", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  const shortcut = page.getByRole("region", { name: "Encontre o seu jeito de sentir" }).getByRole("link", { name: /Masculinos/ });
  await expect(shortcut).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await shortcut.click();
  await expect(page.getByRole("combobox", { name: "Gênero", exact: true })).toHaveValue("masculino");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
