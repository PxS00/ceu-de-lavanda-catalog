import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/shared/components/reveal";
import { products } from "@/features/catalog/lib/catalog";
import { RandomPreview } from "./random-preview";

const previewItems = products.map(({ id, slug, name, photo, volumeOptions, volumePrices, priceCents, availability }) => ({
  id, slug, name, photo, volumeOptions, volumePrices, priceCents, availability,
}));

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
          <h2 id="preview-title">Nomes para despertar a curiosidade</h2>
        </div>
      </Reveal>
      <RandomPreview items={previewItems} />
      <div className="preview-footer">
        <p>Uma pequena seleção. Outras descobertas esperam por você.</p>
        <Link className="button" href="/catalogo/">
          Ver catálogo completo <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
