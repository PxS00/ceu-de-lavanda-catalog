import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description: "Esta página não foi encontrada. Explore a coleção Céu de Lavanda no catálogo.",
  robots: { index: false, follow: false },
  alternates: null,
  openGraph: null,
  twitter: null,
};

export default function NotFound() {
  return (
    <main id="conteudo" className="empty-state wrap">
      <p className="eyebrow">404 · PÁGINA NÃO ENCONTRADA</p>
      <h1>Uma nova direção.</h1>
      <p>Esta página não está no nosso catálogo.</p>
      <Link className="button" href="/catalogo/">
        Explorar a coleção <ArrowUpRight aria-hidden="true" />
      </Link>
    </main>
  );
}
