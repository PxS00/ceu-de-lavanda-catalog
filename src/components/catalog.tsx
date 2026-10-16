"use client";

import { useState, type CSSProperties } from "react";
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
  formatPrice,
  normalize,
  categories,
  type CategorySlug,
  type Product,
} from "@/lib/catalog";
import { ProductArt } from "./product-art";

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
      <Reveal className="section-heading">
        <div>
          <p className="eyebrow">ESCOLHA A SUA PRÓXIMA DESCOBERTA</p>
          <h2 id="collection-title">
            Nossa coleção
            <span className="title-dot" aria-hidden="true">
              .
            </span>
          </h2>
        </div>
        <p>
          Encontre um nome que combina com você.
          <br />
          <span>Os detalhes estão chegando, o encanto já começa.</span>
        </p>
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
          <SlidersHorizontal aria-hidden="true" /> Ordenar por{" "}
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
      {filtered.length ? (
        <div className="product-grid" ref={grid}>
          {pageItems.map((product, index) => (
            <Link
              className="product-card"
              data-reveal
              style={
                {
                  "--reveal-delay": `${(index % 4) * 60}ms`,
                } as CSSProperties
              }
              href={`/produtos/${product.slug}/`}
              key={product.id}
            >
              <ProductArt product={product} />
              <div className="product-card-title">
                <h3>{product.name}</h3>
                <ArrowUpRight aria-hidden="true" />
              </div>
              <p>{formatPrice(product.priceCents)}</p>
              <span className="product-link">Explorar fragrância</span>
            </Link>
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
