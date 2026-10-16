import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Céu de Lavanda · Um universo de descobertas",
    template: "%s | Céu de Lavanda",
  },
  description:
    "Explore a coleção Céu de Lavanda. Descubra os nomes das fragrâncias e acompanhe os próximos detalhes do nosso catálogo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <div className="announcement">
          Um universo de fragrâncias para descobrir{" "}
          <span aria-hidden="true">✧</span>
        </div>
        <header className="site-header wrap">
          <Link className="logo" href="/" aria-label="Céu de Lavanda — início">
            <Image
              src="/brand/emblem.svg"
              alt=""
              width={111.56}
              height={176.35}
              priority
            />
            <span>Céu de Lavanda</span>
          </Link>
          <nav aria-label="Navegação principal">
            <Link href="/">Início</Link>
            <Link href="/catalogo/">Fragrâncias</Link>
            <Link href="/#sobre">Nosso universo</Link>
          </nav>
          <Link className="header-link" href="/catalogo/">
            Explorar catálogo <span aria-hidden="true">↗</span>
          </Link>
        </header>
        {children}
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
              <Link href="/catalogo/">Explore a coleção ↗</Link>
              <Link href="/#sobre">Nosso universo ↗</Link>
            </nav>
          </div>
          <div className="wrap footer-bottom">
            <span>© {new Date().getFullYear()} Céu de Lavanda</span>
            <span>Sinta o toque da lavanda.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
