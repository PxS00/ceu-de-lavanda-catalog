"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/features/catalog/components/product-card";
import type { Product } from "@/features/catalog/lib/catalog";
import { useReveal } from "@/shared/components/reveal";
import { randomSelection } from "../lib/random-selection";

export function RandomPreview({ items }: { items: Product[] }) {
  const [selection, setSelection] = useState(() => items.slice(0, 4));
  const grid = useReveal(JSON.stringify(selection.map(product => product.id)));
  useEffect(() => {
    const timer = window.setTimeout(() => setSelection(randomSelection(items, 4)), 0);
    return () => window.clearTimeout(timer);
  }, [items]);
  return (
    <div className="product-grid" ref={grid}>
      {selection.map((product, index) => <ProductCard product={product} index={index} key={product.id} />)}
    </div>
  );
}
