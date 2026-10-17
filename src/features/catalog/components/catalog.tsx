"use client";

import { useEffect, useState } from "react";
import { Reveal, useReveal } from "@/shared/components/reveal";
import {
  filterProducts,
  normalize,
  categories,
  type CategorySlug,
  type Product,
} from "@/features/catalog/lib/catalog";
import { ProductCard } from "./product-card";
import { CatalogFilters, type CatalogFilterState } from "./catalog-filters";
import { CatalogEmptyState } from "./catalog-empty-state";
import { CatalogPagination } from "./catalog-pagination";

const PAGE_SIZE = 12;
const DEFAULT_FILTERS = { query: "", initial: "", sort: "az" };

export function Catalog({
  products,
  category = "",
}: {
  products: Product[];
  category?: CategorySlug | "";
}) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { query, initial, sort } = filters;
  const [page, setPage] = useState(1);
  const filtered = filterProducts(products, query, initial, sort, category);
  const categoryName = categories.find((item) => item.slug === category)?.name;
  const categoryPending = Boolean(
    category && !products.some((product) => product.category === category),
  );
  const initials = [
    ...new Set(products.map((p) => normalize(p.name)[0].toUpperCase())),
  ].sort();
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const grid = useReveal(
    JSON.stringify(pageItems.map((product) => product.id)),
  );
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || !grid.current?.animate) return;
    const animation = grid.current.animate([{ opacity: 0.75 }, { opacity: 1 }], {
      duration: 180,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
    const stop = () => { if (motion.matches) animation.cancel(); };
    motion.addEventListener("change", stop);
    return () => {
      animation.cancel();
      motion.removeEventListener("change", stop);
    };
  }, [query, initial, sort, page, category, grid]);
  function updateFilters(changes: Partial<CatalogFilterState>) {
    setFilters((current) => ({ ...current, ...changes }));
    setPage(1);
  }

  function reset() {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }

  return (
    <section
      className="catalog wrap"
      id="colecao"
      aria-labelledby="collection-title"
    >
      <Reveal className="catalog-heading">
        <h1 id="collection-title">
          {categoryName ?? "Nossa coleção"}
        </h1>
        <p>Encontre a sua próxima descoberta.</p>
      </Reveal>
      <CatalogFilters
        value={filters}
        onChange={updateFilters}
        category={category}
        categoryPending={categoryPending}
        initials={initials}
        count={filtered.length}
      />
      <div className="catalog-results" ref={grid}>
        {filtered.length ? (
          <div className="product-grid">
            {pageItems.map((product, index) => (
              <ProductCard product={product} index={index} key={product.id} />
            ))}
          </div>
        ) : (
          <CatalogEmptyState
            categoryPending={categoryPending}
            categoryName={categoryName}
            onReset={reset}
          />
        )}
      </div>
      <CatalogPagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </section>
  );
}
