import { test, expect } from "@playwright/test";

test("footer links offer independent checks of the configured domain", async ({ page }) => {
  await page.goto("/catalogo/");
  await expect(page.getByText("68.748.613/0001-45")).toBeVisible();
  await expect(page.getByText("G. APARECIDA ROSSONI LTDA 00061673")).toBeVisible();
  await expect(page.getByRole("link", { name: /Conferir o CNPJ na Receita Federal/ })).toHaveAttribute("href", "https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_Solicitacao.asp?cnpj=68748613000145");
  await expect(page.getByRole("button", { name: "Copiar CNPJ" })).toBeVisible();
  const tls = page.getByRole("link", { name: /Conferir a conexão HTTPS no Qualys SSL Labs/ });
  const safe = page.getByRole("link", { name: /Conferir a segurança no Google Safe Browsing/ });
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
