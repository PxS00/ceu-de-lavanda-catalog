import { ArrowUpRight, Building2, LockKeyhole, ShieldCheck } from "lucide-react";
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
      <div className="verification-cards">
        <article className="verification-card">
          <ShieldCheck className="verification-icon" aria-hidden="true" />
          <div className="verification-content"><span className="verification-source">Google Safe Browsing</span><strong>Consulta de segurança</strong><span>Verifique o endereço no Google</span>
            <a href={safeBrowsingUrl.toString()} target="_blank" rel="noopener noreferrer">Consultar no Google Safe Browsing <ArrowUpRight aria-hidden="true" /><span className="sr-only"> (abre em nova aba)</span></a>
          </div>
        </article>
        <article className="verification-card">
          <LockKeyhole className="verification-icon" aria-hidden="true" />
          <div className="verification-content"><span className="verification-source">SSL Labs</span><strong>Conexão HTTPS</strong><span>Consulte o certificado</span>
            <a href={tlsUrl.toString()} target="_blank" rel="noopener noreferrer">Verificar conexão HTTPS <ArrowUpRight aria-hidden="true" /><span className="sr-only"> (abre em nova aba)</span></a>
          </div>
        </article>
        {contact.companyName && contact.cnpj && (
          <article className="verification-card">
            <Building2 className="verification-icon" aria-hidden="true" />
            <div className="verification-content"><span className="verification-source">Receita Federal</span><strong>Dados da empresa</strong><span>{contact.companyName}</span><span>CNPJ: {contact.cnpj}</span>
              <a href="https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/" target="_blank" rel="noopener noreferrer">Consultar CNPJ na Receita Federal <ArrowUpRight aria-hidden="true" /><span className="sr-only"> (abre em nova aba)</span></a>
              <CopyCnpj cnpj={contact.cnpj} />
              <span>Informe o CNPJ na página de consulta.</span>
            </div>
          </article>
        )}
      </div>
      <p className="verification-caption">Cada consulta abre em um serviço independente.</p>
    </section>
  );
}
