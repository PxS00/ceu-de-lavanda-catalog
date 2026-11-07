import Link from "next/link";
import { familyGuide } from "@/features/catalog/data/family-guide";
import { normalize, products } from "@/features/catalog/lib/catalog";
import { GuidePerfumes } from "@/features/catalog/components/guide-perfumes";
import { OlfactoryStory } from "@/features/catalog/components/olfactory-story";

export const metadata = { title: "Guia de famílias olfativas" };

export default function FamilyGuidePage() {
  const cards = familyGuide.map((guide) => {
          const matching = products.filter((product) => product.category === "perfumes" && product.family && guide.terms.some((term) => normalize(product.family ?? "").includes(term)))
            .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
          if (!matching.length) return null;
          return <section className="family-guide-card" id={guide.id} key={guide.id}>
            <p className="eyebrow">{guide.mood}</p>
            <h2>{guide.name}</h2>
            <p>{guide.description}</p>
            <h3>Quando explorar</h3>
            <p>{guide.occasion}</p>
            <h3>No nosso catálogo</h3>
            <GuidePerfumes perfumes={matching.map(({ id, slug, name }) => ({ id, slug, name }))} family={guide.name} />
          </section>;
        }).filter(Boolean);
  return (
    <main id="conteudo">
      <OlfactoryStory />
      <div id="guia-familias" className="wrap family-guide">
      <p className="eyebrow">UM CAMINHO PARA DESCOBRIR</p>
      <h1>Qual aroma combina com você?</h1>
      <p className="family-guide-intro">Conheça as famílias olfativas e explore sensações como frescor, doçura e aconchego. Um perfume pode reunir mais de uma dessas características.</p>
      <p>As sugestões de ocasião são pontos de partida. Seu gosto, o clima e a quantidade aplicada também fazem parte da escolha.</p>
      <div className="family-guide-grid">{cards}</div>
      <Link className="text-link" href="/catalogo/">Explorar todas as fragrâncias ↗</Link>
      </div>
    </main>
  );
}
