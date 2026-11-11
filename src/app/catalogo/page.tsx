import { Catalog } from "@/features/catalog/components/catalog";
import { products } from "@/features/catalog/lib/catalog";
import { pageMetadata } from "@/features/seo/lib/metadata";

export const metadata = pageMetadata({
  title: "Catálogo de fragrâncias",
  description: "Explore os perfumes e as famílias olfativas da Céu de Lavanda. Encontre sua próxima fragrância na coleção.",
  path: "/catalogo/",
});

export default function CatalogPage() {
  return (
    <main id="conteudo">
      <Catalog products={products} />
    </main>
  );
}
