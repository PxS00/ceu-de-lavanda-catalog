import { notFound } from "next/navigation";
import { products } from "@/features/catalog/lib/catalog";
import { ProductDetail } from "@/features/catalog/components/product-detail";

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title:
      products.find((p) => p.slug === slug)?.name ?? "Produto não encontrado",
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
