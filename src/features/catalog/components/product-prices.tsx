import { formatPrice, getStartingPrice, type Product } from "../lib/catalog";

export function ProductPrices({
  product,
  className,
  variant = "detail",
}: {
  product: Product;
  className: string;
  variant?: "detail" | "starting";
}) {
  if (variant === "starting") {
    const price = getStartingPrice(product);
    return (
      <p className={className}>
        {price != null ? <>A partir de <strong>{formatPrice(price)}</strong></> : formatPrice(null)}
      </p>
    );
  }
  return (
    <p className={className}>
      {product.volumePrices?.length
        ? product.volumePrices.map(({ volume, priceCents }) => (
            <span className="price-option" key={volume}>
              <span>{volume}</span>{" "}
              <strong>{formatPrice(priceCents)}</strong>
            </span>
          ))
        : formatPrice(product.priceCents)}
    </p>
  );
}
