import { Building2, ShieldCheck } from "lucide-react";
import { contact } from "@/shared/contact";

export function SiteVerification() {
  const domain = new URL(contact.siteUrl).hostname;
  return (
    <section className="site-verification" aria-labelledby="verification-title">
      <h2 id="verification-title">Transparência</h2>
      <div className="verification-links">
        <a href={"https://www.ssllabs.com/ssltest/analyze.html?d=" + encodeURIComponent(domain)} target="_blank" rel="noopener noreferrer" aria-label="Consultar HTTPS Qualys SSL Labs (abre em nova aba)">
          <ShieldCheck aria-hidden="true" /><span><small>CONSULTAR HTTPS </small><strong>Qualys SSL Labs</strong></span>
        </a>
        {contact.companyName && contact.cnpj && (
          <a href={"https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_Solicitacao.asp?cnpj=" + contact.cnpj.replace(/\D/g, "")} target="_blank" rel="noopener noreferrer" aria-label="Consultar CNPJ Receita Federal (abre em nova aba)">
            <Building2 aria-hidden="true" /><span><small>CONSULTAR CNPJ </small><strong>Receita Federal</strong></span>
          </a>
        )}
      </div>
    </section>
  );
}
