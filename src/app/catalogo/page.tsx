import { Catalog } from "@/components/catalog";
import { products } from "@/lib/catalog";

export const metadata = { title: "Catálogo de fragrâncias" };

export default function CatalogPage() {
  return (
    <main id="conteudo">
      <div className="catalog-intro wrap">
        <p className="eyebrow">CÉU DE LAVANDA</p>
        <h1>
          Um universo de nomes.
          <br />
          Qual será a sua descoberta?
        </h1>
      </div>
      <Catalog products={products} />
    </main>
  );
}
