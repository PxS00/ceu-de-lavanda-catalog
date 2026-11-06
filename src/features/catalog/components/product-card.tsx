import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { formatPrice, type Product } from "@/features/catalog/lib/catalog";
import { ProductArt } from "./product-art";

export function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const gender = product.gender === "compartilhavel" ? "Compartilhável" : product.gender;
  const profile = [gender, product.family].filter(Boolean).join(" · ");
  const prices = (product.volumePrices ?? [])
    .filter(({ volume, priceCents }) =>
      (!product.volumeOptions?.length || product.volumeOptions.includes(volume)) &&
      Number.isSafeInteger(priceCents) && priceCents > 0
    )
    .map(({ priceCents }) => priceCents);
  const startingPrice = prices.length ? Math.min(...prices) :
    !product.volumePrices?.length && Number.isSafeInteger(product.priceCents) && (product.priceCents ?? 0) > 0
      ? product.priceCents : null;
  return (
    <Link
      className="product-card"
      data-reveal
      style={
        {
          "--reveal-delay": `${(index % 4) * 45}ms`,
        } as CSSProperties
      }
      href={`/produtos/${product.slug}/`}
    >
      <ProductArt product={product} />
      {profile && <p className="product-card-profile">{profile}</p>}
      <div className="product-card-title">
        <h3>{product.name}</h3>
        <ArrowUpRight aria-hidden="true" />
      </div>
      <p className="product-prices">
        {startingPrice != null ? <>A partir de <strong>{formatPrice(startingPrice)}</strong></> : formatPrice(null)}
      </p>
      {!!product.volumeOptions?.length && <p className="product-card-volumes">{product.volumeOptions.join(" · ")}</p>}
      {product.availability && (
        <p className="product-availability">
          {product.availability === "available" ? "Disponível" : "Indisponível"}
        </p>
      )}
      <span className="product-link">Explorar fragrância</span>
    </Link>
  );
}
