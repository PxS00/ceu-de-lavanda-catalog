import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { editorial, decorative } from "./typography";
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
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${editorial.variable} ${decorative.variable}`}
    >
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
