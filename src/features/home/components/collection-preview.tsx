import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/features/catalog/components/product-card";
import { products } from "@/features/catalog/lib/catalog";

export function CollectionPreview() {
  return (
    <section
      className="collection-preview wrap"
      id="colecao"
      aria-labelledby="preview-title"
    >
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
  );
}
