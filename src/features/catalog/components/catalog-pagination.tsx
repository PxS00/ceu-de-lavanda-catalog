import { ArrowLeft, ArrowRight } from "lucide-react";

export function CatalogPagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <nav className="pagination" aria-label="Páginas do catálogo">
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        <ArrowLeft aria-hidden="true" /> Anterior
      </button>
      <span aria-live="polite">
        {page} de {pageCount}
      </span>
      <button
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        Próxima <ArrowRight aria-hidden="true" />
      </button>
    </nav>
  );
}
