import { ArrowUpRight } from "lucide-react";
import { contact } from "@/shared/contact";
import { CopyCnpj } from "./copy-cnpj";

export function SiteVerification() {
  const domain = new URL(contact.siteUrl).hostname;
  const tlsUrl = new URL("https://www.ssllabs.com/ssltest/analyze.html");
  tlsUrl.searchParams.set("d", domain);
  const safeBrowsingUrl = new URL("https://transparencyreport.google.com/safe-browsing/search");
  safeBrowsingUrl.searchParams.set("url", contact.siteUrl);

  return (
    <section className="wrap site-verification" aria-labelledby="verification-title">
      <h2 id="verification-title">Consulte você mesmo</h2>
      {contact.companyName && contact.cnpj && (
        <div className="company-details">
          <p>{contact.companyName}</p>
          <p>CNPJ: {contact.cnpj}</p>
          <div className="verification-links">
            <a href="https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/" target="_blank" rel="noopener noreferrer">
              Consultar CNPJ na Receita Federal <ArrowUpRight aria-hidden="true" /><span className="sr-only"> (abre em nova aba)</span>
            </a>
            <CopyCnpj cnpj={contact.cnpj} />
          </div>
          <p className="company-hint">Informe o CNPJ na página de consulta.</p>
        </div>
      )}
      <div className="verification-links">
        <a href={tlsUrl.toString()} target="_blank" rel="noopener noreferrer">
          Verificar conexão HTTPS <ArrowUpRight aria-hidden="true" /><span className="sr-only"> (abre em nova aba)</span>
        </a>
        <a href={safeBrowsingUrl.toString()} target="_blank" rel="noopener noreferrer">
          Consultar no Google Safe Browsing <ArrowUpRight aria-hidden="true" /><span className="sr-only"> (abre em nova aba)</span>
        </a>
      </div>
    </section>
  );
}
