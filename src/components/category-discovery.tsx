import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/catalog";
import { Reveal } from "./reveal";

export function CategoryDiscovery() {
  return (
    <section
      className="category-discovery wrap"
      aria-labelledby="category-title"
    >
      <Reveal className="section-heading">
        <h2 id="category-title">Uma coleção, três caminhos.</h2>
      </Reveal>
      <Reveal className="category-grid">
        {categories.map((category) => (
          <Link
            className="category-card"
            key={category.slug}
            href={`/catalogo/${category.slug}/`}
          >
            <div className="category-art">
              <Image
                src="/brand/emblem.svg"
                alt=""
                width={111.56}
                height={176.35}
              />
              <span>Fotografia em breve</span>
            </div>
            <div className="category-card-title">
              <h3>{category.name}</h3>
              <ArrowUpRight aria-hidden="true" />
            </div>
            <span className="category-link">Explorar categoria</span>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
