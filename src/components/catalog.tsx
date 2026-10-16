"use client";

import { useState } from "react";
import Link from "next/link";
import {
  filterProducts,
  formatPrice,
  normalize,
  type Product,
} from "@/lib/catalog";
import { ProductArt } from "./product-art";

const PAGE_SIZE = 12;

export function Catalog({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [initial, setInitial] = useState("");
  const [sort, setSort] = useState("az");
  const [page, setPage] = useState(1);
  const filtered = filterProducts(products, query, initial, sort);
  const initials = [
    ...new Set(products.map((p) => normalize(p.name)[0].toUpperCase())),
  ].sort();
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
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
      <div className="section-heading">
        <div>
          <p className="eyebrow">ESCOLHA A SUA PRÓXIMA DESCOBERTA</p>
          <h2 id="collection-title">
            Nossa coleção
            <span className="title-dot" aria-hidden="true">.</span>
          </h2>
        </div>
        <p>
          Encontre um nome que combina com você.
          <br />
          <span>Os detalhes estão chegando, o encanto já começa.</span>
        </p>
      </div>
      <div className="catalog-toolbar">
        <label className="search-field">
          <svg
            aria-hidden="true"
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 5 5" />
          </svg>
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
          Ordenar por{" "}
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
          {filtered.length}{" "}
          {filtered.length === 1 ? "fragrância" : "fragrâncias"}
        </p>
      </div>
      {filtered.length ? (
        <div className="product-grid">
          {filtered
            .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
            .map((product) => (
              <Link
                className="product-card"
                href={`/produtos/${product.slug}/`}
                key={product.id}
              >
                <ProductArt product={product} />
                <div className="product-card-title">
                  <h3>{product.name}</h3>
                  <span aria-hidden="true">↗</span>
                </div>
                <p>{formatPrice(product.priceCents)}</p>
                <span className="product-link">Explorar fragrância</span>
              </Link>
            ))}
        </div>
      ) : (
        <div className="empty-state">
          <span aria-hidden="true">✳</span>
          <h3>Nenhum nome por aqui.</h3>
          <p>Tente outra busca ou explore a coleção completa.</p>
          <button className="button" onClick={reset}>
            Limpar filtros <span aria-hidden="true">↗</span>
          </button>
        </div>
      )}
      {pageCount > 1 && (
        <nav className="pagination" aria-label="Páginas do catálogo">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            ← Anterior
          </button>
          <span aria-live="polite">
            {page} de {pageCount}
          </span>
          <button
            disabled={page === pageCount}
            onClick={() => setPage(page + 1)}
          >
            Próxima →
          </button>
        </nav>
      )}
      <p className="catalog-note">
        <span aria-hidden="true">✳</span> Uma coleção em construção. Novos
        detalhes serão revelados em breve.
      </p>
    </section>
  );
}
