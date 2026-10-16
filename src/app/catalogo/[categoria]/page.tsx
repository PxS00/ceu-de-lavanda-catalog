import { notFound } from "next/navigation";
import { Catalog } from "@/components/catalog";
import { categories, products } from "@/lib/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map(({ slug }) => ({ categoria: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  return {
    title:
      categories.find((category) => category.slug === categoria)?.name ??
      "Categoria não encontrada",
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const category = categories.find((category) => category.slug === categoria);
  if (!category) notFound();
  return (
    <main id="conteudo">
      <div className="catalog-intro wrap">
        <p className="eyebrow">A COLEÇÃO · CÉU DE LAVANDA</p>
        <h1>{category.name}</h1>
      </div>
      <Catalog
        key={category.slug}
        products={products}
        category={category.slug}
      />
    </main>
  );
}
