import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories, products } from "@/features/catalog/lib/catalog";
import { Reveal } from "@/shared/components/reveal";

const categoryIntroductions = {
  perfumes: { description: "Um convite para encontrar o seu próximo perfume." },
  "body-splash": { description: "Um caminho dedicado à coleção de Body Splash." },
  "perfume-capilar": { description: "Conheça o espaço do perfume capilar, também chamado Hair Mist." },
};

export function CategoryDiscovery() {
  return (
    <section
      className="category-discovery wrap"
      aria-labelledby="category-title"
    >
      <Reveal className="section-heading">
        <div>
          <p className="eyebrow">ENCONTRE O SEU CAMINHO</p>
          <h2 id="category-title">Uma coleção, três caminhos</h2>
        </div>
      </Reveal>
      <Reveal className="category-grid">
        {categories.map((category) => {
          const count = products.filter(product => product.category === category.slug).length;
          return (
          <Link
            className="category-card"
            key={category.slug}
            href={`/catalogo/${category.slug}/`}
          >
            <div className="category-art" aria-hidden="true">
              <Image
                src="/brand/emblem.svg"
                alt=""
                width={111.56}
                height={176.35}
              />
            </div>
            <div className="category-card-title">
              <h3>{category.name}</h3>
            </div>
            <p className="category-count">{count} {count === 1 ? "fragrância" : "fragrâncias"}</p>
            <p className="category-description">{categoryIntroductions[category.slug].description}</p>
            <span className="category-link">Explorar {category.name} <ArrowUpRight aria-hidden="true" /></span>
          </Link>
          );
        })}
      </Reveal>
    </section>
  );
}
