import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { notFound } from "next/navigation";
import { products, formatPrice } from "@/lib/catalog";
import { ProductArt } from "@/components/product-art";

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
  return (
    <main id="conteudo" className="wrap detail-main">
      <nav className="breadcrumbs" aria-label="Caminho da página">
        <Link href="/">Início</Link>
        <ChevronRight aria-hidden="true" />
        <Link href="/catalogo/">Fragrâncias</Link>
        <ChevronRight aria-hidden="true" />
        <span aria-current="page">{product.name}</span>
      </nav>
      <div className="product-detail">
        <ProductArt product={product} />
        <Reveal className="detail-copy">
          <p className="eyebrow">A COLEÇÃO · CÉU DE LAVANDA</p>
          <h1>{product.name}</h1>
          <p className="detail-description">
            {product.description ??
              "Cada descoberta tem seu tempo. A descrição desta fragrância será revelada em breve."}
          </p>
          <p className="detail-price">{formatPrice(product.priceCents)}</p>
          <dl>
            <div>
              <dt>Notas olfativas</dt>
              <dd>
                {product.notes?.length
                  ? product.notes.join(" · ")
                  : "Em breve, mais detalhes"}
              </dd>
            </div>
            <div>
              <dt>Disponibilidade</dt>
              <dd>
                {product.availability === "available"
                  ? "Disponível"
                  : product.availability === "unavailable"
                    ? "Indisponível"
                    : "Ainda não informada"}
              </dd>
            </div>
          </dl>
          <p className="detail-note">
            Nosso catálogo está florescendo. Publicamos as informações de cada
            produto à medida que são confirmadas.
          </p>
          <Link className="button" href="/catalogo/">
            Continuar explorando <ArrowUpRight aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </main>
  );
}
