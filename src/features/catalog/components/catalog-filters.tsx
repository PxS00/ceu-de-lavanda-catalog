import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { categories, type CategorySlug } from "../lib/catalog";

export type CatalogFilterState = { query: string; initial: string; sort: string };

type CatalogFiltersProps = {
  value: CatalogFilterState;
  onChange: (changes: Partial<CatalogFilterState>) => void;
  category: CategorySlug | "";
  categoryPending: boolean;
  initials: string[];
  count: number;
};

export function CatalogFilters({
  value: { query, initial, sort },
  onChange,
  category,
  categoryPending,
  initials,
  count,
}: CatalogFiltersProps) {
  return (
    <>
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
            onChange={(e) => onChange({ query: e.target.value })}
            placeholder="Qual nome você procura?"
            type="search"
          />
        </label>
        <label className="sort-label">
          <span className="sort-caption">
            <SlidersHorizontal aria-hidden="true" /> Ordenar por
          </span>
          <select
            value={sort}
            onChange={(e) => onChange({ sort: e.target.value })}
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
            aria-label="Todos os nomes"
            onClick={() => onChange({ initial: "" })}
          >
            <span className="initial-filter-all-label">Todos os nomes</span>
            <span className="initial-filter-all-short" aria-hidden="true">A–Z</span>
          </button>
          {initials.map((letter) => (
            <button
              key={letter}
              className={initial === letter ? "active" : ""}
              aria-pressed={initial === letter}
              onClick={() => onChange({ initial: letter })}
            >
              {letter}
            </button>
          ))}
        </div>
        <p className="result-count" role="status">
          {categoryPending
            ? "Cadastro em preparação"
            : `${count} ${count === 1 ? "fragrância" : "fragrâncias"}`}
        </p>
      </div>
    </>
  );
}
