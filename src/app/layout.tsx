import type { Metadata } from "next";
import { SiteHeader } from "@/shared/components/site-header";
import { SiteFooter } from "@/shared/components/site-footer";
import { FloatingWhatsApp } from "@/features/contact/floating-whatsapp";
import { brandName, homeDescription, indexingApproved, siteOrigin, siteUrl } from "@/features/seo/lib/metadata";
import { editorial, decorative } from "@/shared/fonts/typography";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: {
    default: "Céu de Lavanda | Perfumaria artesanal",
    template: `%s | ${brandName}`,
  },
  description: homeDescription,
  robots: indexingApproved()
    ? { index: true, follow: true }
    : { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: siteUrl("/") },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: brandName,
    title: "Céu de Lavanda | Perfumaria artesanal",
    description: homeDescription,
    url: siteUrl("/"),
    images: [{ url: siteUrl("/campaigns/ceu-de-lavanda-hero.webp"), alt: brandName }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Céu de Lavanda | Perfumaria artesanal",
    description: homeDescription,
    images: [siteUrl("/campaigns/ceu-de-lavanda-hero.webp")],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandName,
    url: siteUrl("/"),
    logo: siteUrl("/branding/ceu-de-lavanda-logo-graphite.svg"),
  };
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${editorial.variable} ${decorative.variable}`}
    >
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
