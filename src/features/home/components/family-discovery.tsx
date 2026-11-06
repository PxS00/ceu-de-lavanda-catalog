import Link from "next/link";
import { products } from "@/features/catalog/lib/catalog";

export function FamilyDiscovery() {
  const counts = new Map<string, number>();
  for (const product of products) {
    if (product.family) counts.set(product.family, (counts.get(product.family) ?? 0) + 1);
  }
  const families = [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "pt-BR")).slice(0, 4);
  if (!families.length) return null;
  return <section className="family-discovery wrap" aria-labelledby="family-title">
    <p className="eyebrow">SIGA OS SEUS SENTIDOS</p>
    <h2 id="family-title">Descubra pela família olfativa</h2>
    <div className="family-discovery-grid">
      {families.map(([family, count]) => <Link className="family-discovery-card" href={`/catalogo/?familia=${encodeURIComponent(family)}`} key={family}>
        <span className="family-discovery-mark" aria-hidden="true">✦</span>
        <h3>{family}</h3>
        <p>{count} {count === 1 ? "fragrância" : "fragrâncias"}</p>
        <span>Explorar fragrâncias ↗</span>
      </Link>)}
    </div>
  </section>;
}
