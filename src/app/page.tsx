import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CategoryDiscovery } from "@/components/category-discovery";
import { Reveal } from "@/components/reveal";
import Image from "next/image";
import { Catalog } from "@/components/catalog";
import { products } from "@/lib/catalog";

export default function Home() {
  return (
    <main id="conteudo">
      <section className="hero wrap">
        <Reveal className="hero-copy">
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
        </Reveal>
        <Reveal className="hero-art" aria-hidden="true">
          <Image
            src="/branding/ceu-de-lavanda-monogram-graphite.svg"
            alt=""
            width={111.56}
            height={176.35}
            priority
          />
        </Reveal>
      </section>
      <section className="brand-ribbon" aria-label="A essência da marca">
        <Reveal className="phrase-strip wrap">
          <p>Presença nos detalhes</p>
          <Image
            src="/branding/lavender-ornament-gold.svg"
            alt=""
            width={76}
            height={138}
          />
          <p>Beleza em cada descoberta</p>
          <Image
            src="/branding/lavender-ornament-gold.svg"
            alt=""
            width={76}
            height={138}
          />
          <p>O seu próximo encanto</p>
        </Reveal>
      </section>
      <CategoryDiscovery />
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
