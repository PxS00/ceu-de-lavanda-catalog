import data from "../data/products.json" with { type: "json" };

export const categories = [
  { slug: "perfumes", name: "Perfumes" },
  { slug: "body-splash", name: "Body Splash" },
  { slug: "perfume-capilar", name: "Perfume Capilar" },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export type Product = {
  id: string;
  slug: string;
  name: string;
  category?: CategorySlug | null;
  description?: string | null;
  priceCents?: number | null;
  notes?: string[] | null;
  availability?: "available" | "unavailable" | null;
  photo?: { src: string; alt: string } | null;
};

export function validateProducts(input: unknown): asserts input is Product[] {
  if (!Array.isArray(input)) throw new Error("O catálogo deve ser uma lista.");
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const p of input) {
    if (
      !p ||
      typeof p !== "object" ||
      typeof p.id !== "string" ||
      !p.id.trim() ||
      typeof p.name !== "string" ||
      !p.name.trim() ||
      typeof p.slug !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)
    )
      throw new Error("Produto sem id, nome ou slug válido.");
    if (ids.has(p.id) || slugs.has(p.slug))
      throw new Error(`Produto duplicado: ${p.slug}`);
    ids.add(p.id);
    slugs.add(p.slug);
    if (
      p.category != null &&
      !categories.some((category) => category.slug === p.category)
    )
      throw new Error(`Categoria inválida: ${p.slug}`);
    if (
      p.description != null &&
      (typeof p.description !== "string" || !p.description.trim())
    )
      throw new Error(`Descrição inválida: ${p.slug}`);
    if (
      p.priceCents != null &&
      (!Number.isSafeInteger(p.priceCents) || p.priceCents < 0)
    )
      throw new Error(`Preço inválido: ${p.slug}`);
    if (
      p.notes != null &&
      (!Array.isArray(p.notes) ||
        !p.notes.every((n: unknown) => typeof n === "string" && n.trim()))
    )
      throw new Error(`Notas inválidas: ${p.slug}`);
    if (
      p.availability != null &&
      !["available", "unavailable"].includes(p.availability)
    )
      throw new Error(`Disponibilidade inválida: ${p.slug}`);
    if (
      p.photo != null &&
      (typeof p.photo.src !== "string" ||
        !/^\/products\/[a-zA-Z0-9/_-]+\.(png|jpe?g|webp|avif)$/.test(
          p.photo.src,
        ) ||
        typeof p.photo.alt !== "string" ||
        !p.photo.alt.trim())
    )
      throw new Error(`Fotografia inválida: ${p.slug}`);
  }
}

validateProducts(data);
export const products: Product[] = data;

export function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function filterProducts(
  items: Product[],
  query: string,
  initial: string,
  sort: string,
  category: CategorySlug | "" = "",
) {
  return items
    .filter(
      (p) =>
        normalize(p.name).includes(normalize(query)) &&
        (!initial || normalize(p.name).startsWith(normalize(initial))) &&
        (!category || p.category === category),
    )
    .sort((a, b) =>
      sort === "za"
        ? b.name.localeCompare(a.name, "pt-BR")
        : a.name.localeCompare(b.name, "pt-BR"),
    );
}

export function formatPrice(price: number | null | undefined) {
  return price == null
    ? "Preço ainda não informado"
    : new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price / 100);
}
