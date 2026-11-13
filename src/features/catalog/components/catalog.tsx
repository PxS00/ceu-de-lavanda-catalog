"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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
import { whatsappUrl } from "@/shared/contact";
import { WhatsAppIcon } from "@/features/contact/whatsapp-icon";

const CATEGORY_DESCRIPTIONS: Record<CategorySlug, string> = {
  perfumes: "Encontre um perfume para marcar seus momentos.",
  "body-splash": "Descubra fragrâncias leves para acompanhar seu dia.",
  "perfume-capilar": "Perfume seus cabelos com uma fragrância especial.",
};
const PAGE_SIZE = 12;
const DEFAULT_FILTERS = { query: "", initial: "", sort: "az" };
const subscribe = (callback: () => void) => {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
};
const familySnapshot = () => new URLSearchParams(window.location.search).get("familia") ?? "";
const genderSnapshot = () => new URLSearchParams(window.location.search).get("genero") ?? "";
const serverSnapshot = () => "";

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
  const productGrid = useRef<HTMLDivElement>(null);
  const family = useSyncExternalStore(subscribe, familySnapshot, serverSnapshot);
  const gender = useSyncExternalStore(subscribe, genderSnapshot, serverSnapshot);
  const families = [...new Set(products.filter((p) => !category || p.category === category).map((p) => p.family).filter((v): v is string => Boolean(v)))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const filtered = filterProducts(products, query, initial, sort, category, family, gender);
  const categoryName = categories.find((item) => item.slug === category)?.name;
  const categoryPending = Boolean(
    category && !products.some((product) => product.category === category),
  );
  const genderPending = Boolean(gender && ["feminino", "masculino", "compartilhavel"].includes(gender) && !products.some((product) => product.gender === gender && (!category || product.category === category)));
  const initials = [
    ...new Set(products.map((p) => normalize(p.name)[0].toUpperCase())),
  ].sort();
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(1, pageCount));
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
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
  }, [query, initial, sort, page, category, family, gender, grid]);
  function changeUrlFilter(key: "familia" | "genero", value: string) {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
    window.history.pushState(null, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
    setPage(1);
  }
  function changeFamily(value: string) { changeUrlFilter("familia", value); }
  function changeGender(value: string) { changeUrlFilter("genero", value); }
  function updateFilters(changes: Partial<CatalogFilterState>) {
    setFilters((current) => ({ ...current, ...changes }));
    setPage(1);
  }
  function changePage(nextPage: number) {
    setPage(nextPage);
    window.requestAnimationFrame(() => {
      if (!productGrid.current) return;
      const headerHeight = document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 0;
      const top = productGrid.current.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? "instant" : "smooth" });
    });
  }

  function reset() {
    setFilters(DEFAULT_FILTERS);
    const url = new URL(window.location.href);
    url.searchParams.delete("familia");
    url.searchParams.delete("genero");
    window.history.pushState(null, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
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
        <p>{category ? CATEGORY_DESCRIPTIONS[category] : "Encontre a sua próxima descoberta."}</p>
      </Reveal>
      <CatalogFilters
        value={filters}
        onChange={updateFilters}
        category={category}
        categoryPending={categoryPending}
        initials={initials}
        count={filtered.length}
        family={family}
        families={families}
        onFamilyChange={changeFamily}
        gender={gender}
        onGenderChange={changeGender}
      />
      <div className="catalog-results" ref={grid}>
        <aside className="whatsapp-catalog" aria-labelledby="catalog-contact-title">
          <div>
            <h2 id="catalog-contact-title">Precisa de ajuda para escolher?</h2>
            <p>Conte para a gente o que você procura.</p>
          </div>
          <a className="whatsapp-action" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon /> Fale com a gente pelo WhatsApp
          </a>
        </aside>
        {filtered.length ? (
          <div className="product-grid" ref={productGrid}>
            {pageItems.map((product, index) => (
              <ProductCard product={product} index={index} key={product.id} />
            ))}
          </div>
        ) : (
          <CatalogEmptyState
            categoryPending={categoryPending}
            categoryName={categoryName}
            genderPending={genderPending && !categoryPending}
            onReset={reset}
          />
        )}
      </div>
      <CatalogPagination page={currentPage} pageCount={pageCount} onPageChange={changePage} />
    </section>
  );
}
