import Image from "next/image";
import type { Product } from "@/features/catalog/lib/catalog";

export function ProductArt({ product }: { product: Product }) {
  if (product.photo)
    return (
      <div className="product-art has-photo">
        <Image
          src={product.photo.src}
          alt={product.photo.alt}
          fill
          sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 25vw"
        />
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
