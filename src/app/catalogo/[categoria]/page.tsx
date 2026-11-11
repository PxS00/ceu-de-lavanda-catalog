import { notFound } from "next/navigation";
import { Catalog } from "@/features/catalog/components/catalog";
import { categories, products } from "@/features/catalog/lib/catalog";
import { pageMetadata } from "@/features/seo/lib/metadata";

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
  const category = categories.find((entry) => entry.slug === categoria);
  if (!category) return { title: "Categoria não encontrada", robots: { index: false } };
  const hasProducts = products.some((product) => product.category === category.slug);
  return {
    ...pageMetadata({
      title: category.name,
      description: `Conheça a coleção de ${category.name.toLocaleLowerCase("pt-BR")} da Céu de Lavanda e encontre fragrâncias para descobrir.`,
      path: `/catalogo/${category.slug}/`,
    }),
    // A página continua acessível, mas não deve ser indexada enquanto estiver sem produtos.
    ...(hasProducts ? {} : { robots: { index: false, follow: false } }),
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const category = categories.find((item) => item.slug === categoria);
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
