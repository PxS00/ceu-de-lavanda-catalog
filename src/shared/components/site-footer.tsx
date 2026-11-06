import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { contact, whatsappUrl } from "@/shared/contact";
import { SocialLinks } from "./social-links";
import { SiteVerification } from "./site-verification";

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
          <SocialLinks className="footer-social" />
        </div>
      </div>
      <SiteVerification />
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} Céu de Lavanda</span>
        <span>Sinta o toque da lavanda.</span>
      </div>
    </footer>
  );
}
