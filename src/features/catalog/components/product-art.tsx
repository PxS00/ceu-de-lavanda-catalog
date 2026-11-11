import Image from "next/image";
import type { Product } from "@/features/catalog/lib/catalog";

export function ProductArt({
  product,
  variant = "card",
}: {
  product: Product;
  variant?: "card" | "detail";
}) {
  if (product.photo)
    return (
      <div className="product-art has-photo">
        <div className="product-photo-frame">
          <Image
            src={product.photo.src}
            alt={product.photo.alt}
            fill
            sizes={variant === "detail" ? "(max-width: 760px) 100vw, 48vw" : "(max-width: 600px) 90vw, (max-width: 900px) 45vw, 25vw"}
            priority={variant === "detail"}
          />
        </div>
      </div>
    );
  return (
    <div className="product-art">
      <span className="placeholder-label">CÉU DE LAVANDA</span>
      <Image src="/brand/emblem.svg" alt="" width={111.56} height={176.35} />
      <span className="placeholder-caption">Fotografia em breve</span>
    </div>
  );
}
