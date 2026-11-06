export const contact = {
  whatsapp: "5511934640404",
  phoneDisplay: "+55 11 93464-0404",
  email: "gr.ceudelavanda@gmail.com",
  siteUrl: "https://ceu-de-lavanda.pages.dev",
  instagram: "https://www.instagram.com/ceu_de_lavanda/" as string | null,
  tiktok: "https://www.tiktok.com/@ceu_de_lavanda" as string | null,
};

export function whatsappUrl(product?: { name: string; slug: string }): string {
  const message = product
    ? `Olá! Gostaria de saber mais sobre o perfume ${product.name}. Vi no catálogo: ${contact.siteUrl}/produtos/${product.slug}/`
    : "Olá! Gostaria de conhecer as fragrâncias da Céu de Lavanda.";
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
