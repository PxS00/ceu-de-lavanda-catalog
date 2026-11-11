import type { Product } from "../lib/catalog";

export function ProductProfile({ product }: { product: Product }) {
  const gender = product.gender === "compartilhavel" ? "Compartilhável"
    : product.gender === "masculino" ? "Masculino"
      : product.gender === "feminino" ? "Feminino" : null;
  return (
    <>
      {gender && <div><dt>Gênero</dt><dd>{gender}</dd></div>}
      {product.style && <div><dt>Estilo</dt><dd>{product.style}</dd></div>}
      {product.suggestedUse && <div><dt>Sugestão de uso</dt><dd>{product.suggestedUse}</dd></div>}
    </>
  );
}
