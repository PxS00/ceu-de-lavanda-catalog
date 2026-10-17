import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CategoryDiscovery } from "@/features/catalog/components/category-discovery";
import { Reveal } from "@/features/catalog/components/reveal";
import Image from "next/image";
import { ProductCard } from "@/features/catalog/components/product-card";
import { products } from "@/features/catalog/lib/catalog";

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
          <Image
            src="/branding/lavender-ornament-gold.svg"
            alt=""
            width={76}
            height={138}
          />
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
          <Image
            src="/branding/lavender-ornament-gold.svg"
            alt=""
            width={76}
            height={138}
          />
        </Reveal>
      </section>
      <CategoryDiscovery />
      <section className="collection-preview wrap" id="colecao" aria-labelledby="preview-title">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow">UM PRIMEIRO OLHAR</p>
            <h2 id="preview-title">Nomes para despertar a curiosidade.</h2>
          </div>
        </Reveal>
        <Reveal className="product-grid">
          {products.slice(0, 4).map((product, index) => (
            <ProductCard product={product} index={index} key={product.id} />
          ))}
        </Reveal>
        <div className="preview-footer">
          <p>Uma pequena seleção. Outras descobertas esperam por você.</p>
          <Link className="button" href="/catalogo/">
            Ver catálogo completo <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>
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
