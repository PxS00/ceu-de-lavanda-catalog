export const contact = {
  whatsapp: "5511934640404",
  email: "gr.ceudelavanda@gmail.com",
  siteUrl: "https://ceu-de-lavanda.pages.dev",
} as const;

export function whatsappUrl(product?: { name: string; slug: string }): string {
  const message = product
    ? `Olá! Gostaria de saber mais sobre o perfume ${product.name}. Vi no catálogo: ${contact.siteUrl}/produtos/${product.slug}/`
    : "Olá! Gostaria de conhecer as fragrâncias da Céu de Lavanda.";
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
