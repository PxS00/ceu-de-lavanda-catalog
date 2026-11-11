import { expect, test } from "@playwright/test";

// Runs only in the existing mobile project (no skips and no duplicate browser).
test("keyboard-only mobile menu restores focus on Escape and supports Enter navigation", async ({ page }, testInfo) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Abrir navegação" });

  // First Tab reaches the skip link; subsequent Tabs must reach the menu trigger.
  await page.keyboard.press("Tab");
  await expect(page.locator('a[href="#conteudo"]')).toBeFocused();
  let tabsToMenu = 0;
  while (!(await toggle.evaluate((node) => document.activeElement === node)) && tabsToMenu < 5) {
    await page.keyboard.press("Tab");
    tabsToMenu++;
  }
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveCSS("outline-style", "solid");

  await page.keyboard.press("Enter");
  const menu = page.getByRole("dialog", { name: "CÉU DE LAVANDA" });
  await expect(menu).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(menu.getByRole("button", { name: "Fechar navegação" })).toBeFocused();

  // Escape must close the native dialog and return focus to the invoking button.
  await page.keyboard.press("Escape");
  await expect(menu).not.toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(menu).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(menu.getByRole("link", { name: "Início", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(menu.getByRole("link", { name: "Catálogo", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/catalogo\/$/);
  await expect(menu).not.toBeVisible();

  await testInfo.attach("mobile-menu-keyboard", {
    body: JSON.stringify({
      viewport: testInfo.project.name,
      tabsToMenu,
      verified: ["skip link first", "visible focus", "Enter opens", "Escape closes", "focus returns", "Tab order", "Enter navigates"],
    }, null, 2),
    contentType: "application/json",
  });
});
