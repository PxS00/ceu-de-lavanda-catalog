import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { contact, whatsappUrl } from "@/shared/contact";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-main">
        <Link href="/" aria-label="Céu de Lavanda — início">
          <Image
            src="/brand/wordmark-gold.svg"
            alt="Céu de Lavanda"
            width={344.49}
            height={145.21}
          />
        </Link>
        <div className="footer-message">
          <p>
            Um nome. Uma descoberta.
            <br />
            Um novo encanto.
          </p>
        </div>
        <nav aria-label="Navegação do rodapé">
          <Link href="/catalogo/">
            Explore a coleção <ArrowUpRight aria-hidden="true" />
          </Link>
          <Link href="/#sobre">
            Sobre a marca <ArrowUpRight aria-hidden="true" />
          </Link>
        </nav>
        <div className="footer-contact">
          <h2>Estamos por aqui</h2>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">WhatsApp <span className="sr-only">(abre em nova aba)</span></a>
          <a href={`tel:+${contact.whatsapp}`}>{contact.phoneDisplay}</a>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <div className="footer-social">
            {contact.instagram && <a href={contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram da Céu de Lavanda (abre em nova aba)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>}
            {contact.tiktok && <a href={contact.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok da Céu de Lavanda (abre em nova aba)"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M16.6 1c.3 2.2 1.5 3.5 3.7 3.7v3.1c-1.3.1-2.5-.3-3.7-1.1v6.5c0 8.3-9 10.9-12.6 5-2.3-3.8-.9-10.4 6.5-10.7v3.3c-.6.1-1.3.2-1.9.4-1.8.6-2.8 1.8-2.5 3.8.6 3.8 7.4 4.9 6.9-2.6V1z"/></svg></a>}
          </div>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} Céu de Lavanda</span>
        <span>Sinta o toque da lavanda.</span>
      </div>
    </footer>
  );
}
