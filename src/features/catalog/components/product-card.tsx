import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import type { Product } from "@/features/catalog/lib/catalog";
import { ProductArt } from "./product-art";
import { ProductPrices } from "./product-prices";

export function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const gender = product.gender === "compartilhavel" ? "Compartilhável" : product.gender;
  const profile = [gender, product.family].filter(Boolean).join(" · ");
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
      <ProductPrices product={product} className="product-prices" variant="starting" />
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
