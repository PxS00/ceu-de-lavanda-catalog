import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { contact } from "@/shared/contact";
import { SiteVerification } from "./site-verification";
import { CopyCnpj } from "./copy-cnpj";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-main">
        <nav aria-label="Navegação do rodapé">
          <h2>Explore</h2>
          <Link href="/catalogo/">
            Explore a coleção <ArrowUpRight aria-hidden="true" />
          </Link>
          <Link href="/#sobre">
            Sobre a marca <ArrowUpRight aria-hidden="true" />
          </Link>
        </nav>
        <div className="footer-contact">
          <h2>Contato</h2>
          <a href={`tel:+${contact.whatsapp}`}>{contact.phoneDisplay}</a>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
        <SiteVerification />
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} Céu de Lavanda</span>
        {contact.companyName && contact.cnpj && <div className="verification-company">
          <span>{contact.companyName}</span><CopyCnpj cnpj={contact.cnpj} />
        </div>}
      </div>
    </footer>
  );
}
