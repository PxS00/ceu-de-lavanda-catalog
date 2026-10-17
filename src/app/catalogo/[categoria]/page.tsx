import { notFound } from "next/navigation";
import { Catalog } from "@/features/catalog/components/catalog";
import { categories, products } from "@/features/catalog/lib/catalog";

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
      <Catalog
        key={category.slug}
        products={products}
        category={category.slug}
      />
    </main>
  );
}
