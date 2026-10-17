"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Reveal, useReveal } from "./reveal";
import Link from "next/link";
import {
  filterProducts,
  normalize,
  categories,
  type CategorySlug,
  type Product,
} from "@/features/catalog/lib/catalog";
import { ProductCard } from "./product-card";

const PAGE_SIZE = 12;

export function Catalog({
  products,
  category = "",
}: {
  products: Product[];
  category?: CategorySlug | "";
}) {
  const [query, setQuery] = useState("");
  const [initial, setInitial] = useState("");
  const [sort, setSort] = useState("az");
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
  function reset() {
    setQuery("");
    setInitial("");
    setSort("az");
    setPage(1);
  }

  return (
    <section
      className="catalog wrap"
      id="colecao"
      aria-labelledby="collection-title"
    >
      <Reveal className="catalog-heading">
        <h1 id="collection-title" className={category ? "category-title" : undefined}>
          {categoryName ?? "Nossa coleção"}
          <span className="title-dot" aria-hidden="true">
            .
          </span>
        </h1>
        <p>Encontre a sua próxima descoberta.</p>
      </Reveal>
      <nav className="category-filters" aria-label="Categorias comerciais">
        <Link href="/catalogo/" aria-current={!category ? "page" : undefined}>
          Todas as categorias
        </Link>
        {categories.map((item) => (
          <Link
            href={`/catalogo/${item.slug}/`}
            key={item.slug}
            aria-current={category === item.slug ? "page" : undefined}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="catalog-toolbar">
        <label className="search-field">
          <Search aria-hidden="true" />
          <span className="sr-only">Buscar fragrância pelo nome</span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Qual nome você procura?"
            type="search"
          />
        </label>
        <label className="sort-label">
          <span className="sort-caption"><SlidersHorizontal aria-hidden="true" /> Ordenar por</span>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="az">Nome: A–Z</option>
            <option value="za">Nome: Z–A</option>
          </select>
        </label>
      </div>
      <div className="filter-row">
        <div
          className="initial-filters"
          role="group"
          aria-label="Filtrar pela inicial"
        >
          <button
            className={!initial ? "active" : ""}
            aria-pressed={!initial}
            onClick={() => {
              setInitial("");
              setPage(1);
            }}
          >
            Todos os nomes
          </button>
          {initials.map((letter) => (
            <button
              key={letter}
              className={initial === letter ? "active" : ""}
              aria-pressed={initial === letter}
              onClick={() => {
                setInitial(letter);
                setPage(1);
              }}
            >
              {letter}
            </button>
          ))}
        </div>
        <p className="result-count" role="status">
          {categoryPending
            ? "Cadastro em preparação"
            : `${filtered.length} ${filtered.length === 1 ? "fragrância" : "fragrâncias"}`}
        </p>
      </div>
      <div className="catalog-results" ref={grid}>
        {filtered.length ? (
          <div className="product-grid">
            {pageItems.map((product, index) => (
              <ProductCard product={product} index={index} key={product.id} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="lavender-mark" aria-hidden="true" />
            <h3>
              {categoryPending
                ? "Uma nova descoberta está por vir."
                : "Nenhum nome por aqui."}
            </h3>
            <p>
              {categoryPending
                ? `Os produtos de ${categoryName} ainda estão sendo cadastrados. Explore os nomes já confirmados na coleção.`
                : "Tente outra busca ou explore a coleção completa."}
            </p>
            {categoryPending ? (
              <Link className="button" href="/catalogo/">
                Ver toda a coleção <ArrowUpRight aria-hidden="true" />
              </Link>
            ) : (
              <button className="button" onClick={reset}>
                Limpar filtros <ArrowUpRight aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>
      {pageCount > 1 && (
        <nav className="pagination" aria-label="Páginas do catálogo">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ArrowLeft aria-hidden="true" /> Anterior
          </button>
          <span aria-live="polite">
            {page} de {pageCount}
          </span>
          <button
            disabled={page === pageCount}
            onClick={() => setPage(page + 1)}
          >
            Próxima <ArrowRight aria-hidden="true" />
          </button>
        </nav>
      )}
    </section>
  );
}
