import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
        <p>
          Um nome. Uma descoberta.
          <br />
          Um novo encanto.
        </p>
        <nav aria-label="Navegação do rodapé">
          <Link href="/catalogo/">
            Explore a coleção <ArrowUpRight aria-hidden="true" />
          </Link>
          <Link href="/#sobre">
            Sobre a marca <ArrowUpRight aria-hidden="true" />
          </Link>
        </nav>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} Céu de Lavanda</span>
        <span>Sinta o toque da lavanda.</span>
      </div>
    </footer>
  );
}
