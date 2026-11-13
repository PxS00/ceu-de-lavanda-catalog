import { test, expect } from "@playwright/test";

test("footer verification links and CNPJ copy work", async ({ page }) => {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/catalogo/");
  await expect(page.getByText("G. APARECIDA ROSSONI LTDA 00061673")).toBeVisible();
  const company = page.getByRole("link", { name: /Conferir o CNPJ na Receita Federal/ });
  await expect(company).toHaveAttribute("href", "https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_Solicitacao.asp?cnpj=68748613000145");
  await page.getByRole("button", { name: /Copiar CNPJ/ }).click();
  await expect(page.locator(".verification-company").getByRole("status")).toHaveText("CNPJ copiado.");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("68.748.613/0001-45");
  const tls = page.getByRole("link", { name: /Conferir a conexão HTTPS no Qualys SSL Labs/ });
  const tlsUrl = new URL((await tls.getAttribute("href"))!);
  expect(tlsUrl.hostname).toBe("www.ssllabs.com");
  expect(tlsUrl.searchParams.get("d")).toBe("ceu-de-lavanda.pages.dev");
  await expect(tls).toHaveAttribute("target", "_blank");
  await expect(company).toHaveAttribute("rel", "noopener noreferrer");

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
