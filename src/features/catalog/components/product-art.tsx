import Image from "next/image";
import type { Product } from "@/features/catalog/lib/catalog";

function responsivePhoto(src: string, width: 400 | 800): string {
  return src.replace("/products/", "/products/generated/").replace(/\.webp$/i, "-w" + width + ".webp");
}

export function ProductArt({
  product,
  variant = "card",
}: {
  product: Product;
  variant?: "card" | "detail";
}) {
  const hasResponsiveWebP = product.photo?.src.startsWith("/products/") && /\.webp$/i.test(product.photo.src);
  if (product.photo)
    return (
      <div className="product-art has-photo">
        <div className="product-photo-frame">
          {variant === "detail" || !hasResponsiveWebP ? (
            <Image
              src={product.photo.src}
              alt={product.photo.alt}
              fill
              sizes="(max-width: 760px) 100vw, 48vw"
              priority
            />
          ) : (
            // The static build supplies pre-resized card WebP variants.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={responsivePhoto(product.photo.src, 800)}
              srcSet={responsivePhoto(product.photo.src, 400) + " 400w, " + responsivePhoto(product.photo.src, 800) + " 800w"}
              sizes="(max-width: 600px) 45vw, (max-width: 900px) 45vw, 25vw"
              alt={product.photo.alt}
              width={800}
              height={1000}
              loading="lazy"
              decoding="async"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            />
          )}
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
