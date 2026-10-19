import { formatPrice, type Product } from "../lib/catalog";

export function ProductPrices({
  product,
  className,
}: {
  product: Product;
  className: string;
}) {
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
