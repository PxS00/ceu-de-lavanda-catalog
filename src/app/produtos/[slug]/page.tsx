import { notFound } from "next/navigation";
import { products } from "@/features/catalog/lib/catalog";
import { ProductDetail } from "@/features/catalog/components/product-detail";
import { productJsonLd, productMetadata } from "@/features/seo/lib/metadata";

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
  const product = products.find((entry) => entry.slug === slug);
  return product ? productMetadata(product) : { title: "Produto não encontrado", robots: { index: false } };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((entry) => entry.slug === slug);
  if (!product) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(productJsonLd(product)).replace(/</g, "\\u003c"),
      }} />
      <ProductDetail product={product} />
    </>
  );
}
