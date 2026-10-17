import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function CatalogEmptyState({
  categoryPending,
  categoryName,
  onReset,
}: {
  categoryPending: boolean;
  categoryName?: string;
  onReset: () => void;
}) {
  return (
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
        <button className="button" onClick={onReset}>
          Limpar filtros <ArrowUpRight aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
