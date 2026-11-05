import type { Product } from "./catalog";

function familyKey(value?: string | null) {
  return (value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/chipre/g, "chypre").replace(/frutad[oa]|frutal/g, "frutal")
    .trim().split(/\s+/).sort().join(" ");
}

function shuffle(items: Product[], random: () => number) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function recommendProducts(current: Product, catalog: Product[], random = Math.random) {
  const seen = new Set([current.id]);
  const candidates = catalog.filter(p => {
    if (p.slug === current.slug || seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
  const family = familyKey(current.family);
  const similar = candidates.filter(p => family && familyKey(p.family) === family);
  const others = candidates.filter(p => !similar.includes(p));
  return [...shuffle(similar, random), ...shuffle(others, random)].slice(0, 6);
}
