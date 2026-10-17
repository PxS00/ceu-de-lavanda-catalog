import { Catalog } from "@/features/catalog/components/catalog";
import { products } from "@/features/catalog/lib/catalog";

export const metadata = { title: "Catálogo de fragrâncias" };

export default function CatalogPage() {
  return (
    <main id="conteudo">
      <Catalog products={products} />
    </main>
  );
}
