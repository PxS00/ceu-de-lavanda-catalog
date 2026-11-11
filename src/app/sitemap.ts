import type { MetadataRoute } from "next";
import { categories, products } from "@/features/catalog/lib/catalog";
import { siteUrl } from "@/features/seo/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/catalogo/",
    "/familias-olfativas/",
    ...categories.map(({ slug }) => `/catalogo/${slug}/`),
    ...products.map(({ slug }) => `/produtos/${slug}/`),
  ];
  return routes.map((path) => ({
    url: siteUrl(path),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : path.startsWith("/produtos/") ? 0.6 : 0.8,
  }));
}
