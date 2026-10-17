import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { formatPrice, type Product } from "@/lib/catalog";
import { ProductArt } from "./product-art";

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
      <p>{formatPrice(product.priceCents)}</p>
      <span className="product-link">Explorar fragrância</span>
    </Link>
  );
}
