import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/shared/components/reveal";

export function AboutSection() {
  return (
    <section className="about wrap" id="sobre" tabIndex={-1}>
      <p className="eyebrow">O UNIVERSO CÉU DE LAVANDA</p>
      <Reveal>
        <h2>
          O começo de uma
          <br />
          <em className="decorative-text">bela descoberta</em>
        </h2>
        <p>
          Nosso catálogo está florescendo. Por aqui, você já pode explorar os
          nomes da coleção e conhecer o espaço de cada fragrância.
        </p>
        <p>
          Fotografias e informações de cada produto serão adicionadas conforme
          forem confirmadas. Volte para acompanhar os próximos detalhes.
        </p>
        <Link className="text-link" href="/catalogo/">
          Conheça todos os nomes <ArrowUpRight aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  );
}
