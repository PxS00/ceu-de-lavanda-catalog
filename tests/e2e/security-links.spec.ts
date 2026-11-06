import { test, expect } from "@playwright/test";

test("footer links offer independent checks of the configured domain", async ({ page }) => {
  await page.goto("/catalogo/");
  const tls = page.getByRole("link", { name: /Verificar conexão HTTPS/ });
  const safe = page.getByRole("link", { name: /Consultar no Google Safe Browsing/ });
  const tlsUrl = new URL((await tls.getAttribute("href"))!);
  const safeUrl = new URL((await safe.getAttribute("href"))!);
  expect(tlsUrl.hostname).toBe("www.ssllabs.com");
  expect(tlsUrl.searchParams.get("d")).toBe("ceu-de-lavanda.pages.dev");
  expect(safeUrl.hostname).toBe("transparencyreport.google.com");
  expect(safeUrl.searchParams.get("url")).toBe("https://ceu-de-lavanda.pages.dev");
  await expect(tls).toHaveAttribute("target", "_blank");
  await expect(safe).toHaveAttribute("rel", "noopener noreferrer");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
