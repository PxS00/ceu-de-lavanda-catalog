import type { Metadata } from "next";
import type { Product } from "@/features/catalog/lib/catalog";

const DEFAULT_ORIGIN = "https://ceu-de-lavanda.pages.dev";
export const brandName = "Céu de Lavanda";
export const homeDescription = "Conheça a coleção Céu de Lavanda e descubra fragrâncias artesanais, famílias olfativas e perfumes para diferentes momentos.";

export function siteOrigin(): string {
  const value = process.env.CATALOG_SITE_URL?.trim();
  if (!value) return DEFAULT_ORIGIN;
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("CATALOG_SITE_URL deve ser uma origem HTTPS, sem caminho ou credenciais.");
  }
  return url.origin;
}

export function siteUrl(path: string): string {
  return new URL(path, siteOrigin()).toString();
}

// Indexação exige uma aprovação explícita de release e um domínio próprio confirmado.
// A proteção X-Robots-Tag de *.pages.dev continua atuando independentemente deste flag.
export function indexingApproved(): boolean {
  return process.env.CATALOG_INDEXABLE === "true" &&
    Boolean(process.env.CATALOG_SITE_URL) &&
    !new URL(siteOrigin()).hostname.endsWith(".pages.dev");
}

type PageInfo = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

export function pageMetadata({ title, description, path, image }: PageInfo): Metadata {
  const url = siteUrl(path);
  const imageUrl = siteUrl(image ?? "/campaigns/ceu-de-lavanda-hero.webp");
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: brandName,
      title: `${title} | ${brandName}`,
      description,
      url,
      images: [{ url: imageUrl, alt: image ? title : brandName }],
    },
    twitter: { card: "summary_large_image", title: `${title} | ${brandName}`, description, images: [imageUrl] },
  };
}

export function productDescription(product: Product): string {
  const opening = product.tagline?.trim() || product.description?.trim();
  if (opening) return opening.length <= 160 ? opening : `${opening.slice(0, 157).trimEnd()}…`;
  return product.family
    ? `Conheça ${product.name}, fragrância da família olfativa ${product.family}, na coleção Céu de Lavanda.`
    : `Conheça ${product.name}, fragrância da coleção Céu de Lavanda.`;
}

export function productMetadata(product: Product): Metadata {
  return pageMetadata({
    title: product.name,
    description: productDescription(product),
    path: `/produtos/${product.slug}/`,
    image: product.photo?.src,
  });
}

export function productJsonLd(product: Product) {
  const prices = (product.volumePrices ?? []).filter((p) => Number.isSafeInteger(p.priceCents) && p.priceCents > 0);
  const offers = product.availability ? prices.map(({ volume, priceCents }) => ({
    "@type": "Offer",
    url: siteUrl(`/produtos/${product.slug}/`),
    name: `${product.name} — ${volume}`,
    price: (priceCents / 100).toFixed(2),
    priceCurrency: "BRL",
    availability: product.availability === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
  })) : [];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    url: siteUrl(`/produtos/${product.slug}/`),
    ...(productDescription(product) ? { description: productDescription(product) } : {}),
    ...(product.photo ? { image: [siteUrl(product.photo.src)] } : {}),
    ...(product.category ? { category: product.category } : {}),
    brand: { "@type": "Brand", name: brandName },
    ...(offers.length ? { offers } : {}),
  };
}
