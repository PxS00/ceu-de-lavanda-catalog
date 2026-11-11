"use client";

import Link from "next/link";
import { useId, useState } from "react";

export function GuidePerfumes({ perfumes, family }: {
  perfumes: { id: string; slug: string; name: string }[];
  family: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  return (
    <div>
      <div className="family-guide-links" id={id}>
        {(expanded ? perfumes : perfumes.slice(0, 3)).map((product) => (
          <Link href={`/produtos/${product.slug}/`} key={product.id}>{product.name} ↗</Link>
        ))}
      </div>
      {perfumes.length > 3 && <button className="button family-perfumes-toggle"
        type="button" aria-expanded={expanded} aria-controls={id}
        onClick={() => setExpanded(!expanded)}>
        {expanded ? "Mostrar menos" : "Ver todos"}
        <span className="sr-only"> os perfumes de {family}</span>
      </button>}
    </div>
  );
}
