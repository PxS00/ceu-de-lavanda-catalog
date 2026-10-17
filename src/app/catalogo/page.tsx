import { Catalog } from "@/components/catalog";
import { products } from "@/lib/catalog";

export const metadata = { title: "Catálogo de fragrâncias" };

export default function CatalogPage() {
  return (
    <main id="conteudo">
      <Catalog products={products} />
    </main>
  );
}
