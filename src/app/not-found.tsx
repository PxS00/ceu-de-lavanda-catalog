import Link from "next/link";

export default function NotFound() {
  return (
    <main id="conteudo" className="empty-state wrap">
      <p className="eyebrow">404 · PÁGINA NÃO ENCONTRADA</p>
      <h1>Uma nova direção.</h1>
      <p>Esta página não está no nosso catálogo.</p>
      <Link className="button" href="/catalogo/">
        Explorar a coleção ↗
      </Link>
    </main>
  );
}
