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
      <div className="product-card-title">
        <h3>{product.name}</h3>
        <ArrowUpRight aria-hidden="true" />
      </div>
      {product.productType && (
        <p className="product-type">{product.productType}</p>
      )}
      <ProductPrices product={product} className="product-prices" />
      {product.availability && (
        <p className="product-availability">
          {product.availability === "available" ? "Disponível" : "Indisponível"}
        </p>
      )}
      <span className="product-link">Explorar fragrância</span>
    </Link>
  );
}
