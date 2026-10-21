import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Reveal } from "@/shared/components/reveal";
import { categories, type Product } from "../lib/catalog";
import { ProductArt } from "./product-art";
import { ProductPrices } from "./product-prices";

export function ProductDetail({ product }: { product: Product }) {
  const category = categories.find((item) => item.slug === product.category);
  const hasPendingDetails =
    (!product.volumePrices?.length && product.priceCents == null) ||
    !product.availability;
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
          {product.productType && (
            <p className="detail-family">{product.productType}</p>
          )}
          {product.family && (
            <p className="detail-family">Família olfativa · {product.family}</p>
          )}
          {product.tagline && (
            <p className="detail-tagline">{product.tagline}</p>
          )}
          <p className="detail-description">
            {product.description ??
              "Cada descoberta tem seu tempo. A descrição desta fragrância será revelada em breve."}
          </p>
          <ProductPrices product={product} className="detail-price" />
          <dl>
            {category && (
              <div>
                <dt>Categoria</dt>
                <dd><Link href={`/catalogo/${category.slug}/`}>{category.name}</Link></dd>
              </div>
            )}
            {!product.volumePrices?.length && Boolean(product.volumeOptions?.length) && (
              <div>
                <dt>Volumes disponíveis</dt>
                <dd>{product.volumeOptions?.join(" · ")}</dd>
              </div>
            )}
            {!product.notePyramid && (
              <div>
                <dt>Notas olfativas</dt>
                <dd>
                  {product.notes?.length
                    ? product.notes.join(" · ")
                    : "Em breve, mais detalhes"}
                </dd>
              </div>
            )}
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
          {product.notePyramid && (
            <section className="note-pyramid" aria-labelledby="note-pyramid-title">
              <h2 id="note-pyramid-title">Pirâmide olfativa</h2>
              <dl>
                <div>
                  <dt>Saída</dt>
                  <dd>{product.notePyramid.top.join(" · ")}</dd>
                </div>
                <div>
                  <dt>Corpo</dt>
                  <dd>{product.notePyramid.heart.join(" · ")}</dd>
                </div>
                <div>
                  <dt>Fundo</dt>
                  <dd>{product.notePyramid.base.join(" · ")}</dd>
                </div>
              </dl>
            </section>
          )}
          {hasPendingDetails && (
            <aside className="detail-note" aria-labelledby="pending-title">
              <h2 id="pending-title">Uma descoberta que continua.</h2>
              <p>Preço e disponibilidade serão informados assim que forem confirmados.</p>
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

