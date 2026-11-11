import Link from "next/link";
import { products } from "@/features/catalog/lib/catalog";

export function FamilyDiscovery() {
  if (!products.some((product) => product.family)) return null;
  return <section className="family-discovery wrap" aria-labelledby="family-title">
    <p className="eyebrow">SIGA OS SEUS SENTIDOS</p>
    <h2 id="family-title">Descubra pela família olfativa</h2>
    <p>Do fresco ao doce, conheça os perfis e encontre um caminho para a sua próxima escolha.</p>
    <Link className="text-link" href="/familias-olfativas/">Conhecer as famílias olfativas ↗</Link>
  </section>;
}
