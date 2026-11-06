import Link from "next/link";
import { familyGuide } from "@/features/catalog/data/family-guide";
import { normalize, products } from "@/features/catalog/lib/catalog";

export const metadata = { title: "Guia de famílias olfativas" };

export default function FamilyGuidePage() {
  const families = [...new Set(products.map((product) => product.family).filter((family): family is string => Boolean(family)))];
  return (
    <main id="conteudo" className="wrap family-guide">
      <p className="eyebrow">UM CAMINHO PARA DESCOBRIR</p>
      <h1>Qual aroma combina com você?</h1>
      <p className="family-guide-intro">Conheça as famílias olfativas e explore sensações como frescor, doçura e aconchego. Um perfume pode reunir mais de uma dessas características.</p>
      <p>As sugestões de ocasião são pontos de partida. Seu gosto, o clima e a quantidade aplicada também fazem parte da escolha.</p>
      <div className="family-guide-grid">
        {familyGuide.map((guide) => {
          const matching = families.filter((family) => guide.terms.some((term) => normalize(family).includes(term)));
          if (!matching.length) return null;
          return <section className="family-guide-card" id={guide.id} key={guide.id}>
            <p className="eyebrow">{guide.mood}</p>
            <h2>{guide.name}</h2>
            <p>{guide.description}</p>
            <h3>Quando explorar</h3>
            <p>{guide.occasion}</p>
            <h3>No nosso catálogo</h3>
            <div className="family-guide-links">
              {matching.map((family) => <Link href={`/catalogo/?familia=${encodeURIComponent(family)}`} key={family}>{family} ↗</Link>)}
            </div>
          </section>;
        })}
      </div>
      <Link className="text-link" href="/catalogo/">Explorar todas as fragrâncias ↗</Link>
    </main>
  );
}
