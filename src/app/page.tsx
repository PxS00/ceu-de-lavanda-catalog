import Link from "next/link";
import { ArrowUpRight, Sprout } from "lucide-react";
import { Reveal } from "@/components/reveal";
import Image from "next/image";
import { Catalog } from "@/components/catalog";
import { products } from "@/lib/catalog";

export default function Home() {
  return (
    <main id="conteudo">
      <section className="hero wrap">
        <Reveal className="hero-copy">
          <p className="eyebrow">
            <span className="little-line" /> CÉU DE LAVANDA · CATÁLOGO
          </p>
          <h1>
            Um encontro
            <br />
            com o seu
            <br />
            <em className="decorative-text">próximo encanto.</em>
          </h1>
          <p className="hero-description">
            Há nomes que despertam a curiosidade.
            <br />
            Encontre o seu e comece a descobrir.
          </p>
          <Link className="button" href="#colecao">
            Explorar a coleção <ArrowUpRight aria-hidden="true" />
          </Link>
          <span className="hero-footnote">Uma descoberta de cada vez.</span>
        </Reveal>
        <Reveal className="hero-art" aria-hidden="true">
          <span className="art-caption">SINTA O TOQUE DA LAVANDA</span>
          <Image
            src="/brand/emblem-ink.svg"
            alt=""
            width={111.56}
            height={176.35}
            priority
          />
          <span className="art-number">01 — UM UNIVERSO DE DESCOBERTAS</span>
        </Reveal>
      </section>
      <div className="brand-ribbon">
        <span>Presença nos detalhes</span>
        <Sprout aria-hidden="true" />
        <span>Beleza em cada descoberta</span>
        <Sprout aria-hidden="true" />
        <span>O seu próximo encanto</span>
      </div>
      <Catalog products={products} />
      <section className="about wrap" id="sobre" tabIndex={-1}>
        <p className="eyebrow">O UNIVERSO CÉU DE LAVANDA</p>
        <Reveal>
          <h2>
            O começo de uma
            <br />
            <em className="decorative-text">bela descoberta.</em>
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
    </main>
  );
}
