import type { MetadataRoute } from "next";
import { siteUrl } from "@/features/seo/lib/metadata";

// Não bloquear crawling: o noindex de previews é exposto em HTML e headers.
// Assim o crawler consegue ler a restrição; robots.txt não é controle de acesso.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: siteUrl("/sitemap.xml"),
  };
}
