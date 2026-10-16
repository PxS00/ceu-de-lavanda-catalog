import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { notFound } from "next/navigation";
import { products, formatPrice, categories } from "@/lib/catalog";
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
  const category = categories.find((item) => item.slug === product.category);
  const hasPendingDetails =
    !product.description || !product.notes?.length ||
    product.priceCents == null || !product.availability;
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
            {category && (
              <div>
                <dt>Categoria</dt>
                <dd><Link href={`/catalogo/${category.slug}/`}>{category.name}</Link></dd>
              </div>
            )}
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
          {hasPendingDetails && (
            <aside className="detail-note" aria-labelledby="pending-title">
              <h2 id="pending-title">Uma descoberta que continua.</h2>
              <p>Este nome já faz parte da coleção. Preço, notas e disponibilidade aparecem aqui à medida que são confirmados.</p>
              <p>Enquanto isso, conheça outros nomes no catálogo.</p>
            </aside>
          )}
          <Link className="button" href="/catalogo/">
            Continuar explorando <ArrowUpRight aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </main>
  );
}
