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

// Stable per-product shuffle: static exports must not change recommendations every build.
function seededRandom(slug: string): () => number {
  let state = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    state = Math.imul(state ^ slug.charCodeAt(i), 16777619) >>> 0;
  }
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export function recommendProducts(current: Product, catalog: Product[], random = seededRandom(current.slug)) {
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
