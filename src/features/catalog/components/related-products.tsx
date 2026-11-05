import { products, type Product } from "../lib/catalog";
import { recommendProducts } from "../lib/recommendations";
import { ProductCard } from "./product-card";
import { RelatedCarousel } from "./related-carousel";

export function RelatedProducts({ product }: { product: Product }) {
  const suggestions = recommendProducts(product, products);
  if (!suggestions.length) return null;
  return (
    <section className="related-products" aria-labelledby="related-title">
      <p className="eyebrow">CONTINUE A DESCOBERTA</p>
      <h2 id="related-title">Outras fragrâncias para descobrir</h2>
      <RelatedCarousel key={product.id}>
        {suggestions.map((item, index) => <li key={item.id}><ProductCard product={item} index={index} /></li>)}
      </RelatedCarousel>
    </section>
  );
}
