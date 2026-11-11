import { ArrowUpRight, Building2, LockKeyhole, ShieldCheck } from "lucide-react";
import { contact } from "@/shared/contact";
import { CopyCnpj } from "./copy-cnpj";

export function SiteVerification() {
  const domain = new URL(contact.siteUrl).hostname;
  const cards = [
    { source: "Google Safe Browsing", title: "Consulta de segurança", detail: "Verificação independente", icon: ShieldCheck,
      href: "https://transparencyreport.google.com/safe-browsing/search?url=" + encodeURIComponent(contact.siteUrl),
      label: "a segurança no Google Safe Browsing", tone: "lavender" },
    { source: "Qualys SSL Labs", title: "Conexão HTTPS", detail: "Consulte o certificado SSL", icon: LockKeyhole,
      href: "https://www.ssllabs.com/ssltest/analyze.html?d=" + encodeURIComponent(domain),
      label: "a conexão HTTPS no Qualys SSL Labs", tone: "gold" },
    ...(contact.companyName && contact.cnpj ? [
      { source: "Receita Federal", title: "Dados da empresa", detail: "CNPJ " + contact.cnpj, icon: Building2,
        href: "https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_Solicitacao.asp?cnpj=" + contact.cnpj.replace(/\D/g, ""),
        label: "o CNPJ na Receita Federal", tone: "lavender" },
    ] : []),
  ];
  return (
    <section className="wrap site-verification" aria-labelledby="verification-title">
      <h2 id="verification-title">Transparência · confira você mesmo</h2>
      <div className="verification-cards">
        {cards.map(({ source, title, detail, icon: Icon, href, label, tone }) => (
          <article className={"verification-card verification-" + tone} key={source}>
            <span className="verification-badge"><Icon aria-hidden="true" /></span>
            <div className="verification-content">
              <span className="verification-source">{source}</span>
              <strong>{title}</strong>
              <span>{detail}</span>
            </div>
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={"Conferir " + label + " (abre em nova aba)"}>
              <ArrowUpRight aria-hidden="true" /><span>Conferir</span>
            </a>
          </article>
        ))}
      </div>
      <p className="verification-caption">Cada cartão abre a consulta em um serviço independente.</p>
      {contact.companyName && contact.cnpj && <div className="verification-company">
        <span>{contact.companyName}</span><CopyCnpj cnpj={contact.cnpj} />
        <span>O CNPJ abre preenchido. Confirme a verificação da Receita para consultar.</span>
      </div>}
    </section>
  );
}
