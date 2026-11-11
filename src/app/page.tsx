import type { Metadata } from "next";
import { AboutSection } from "@/features/home/components/about-section";
import { BrandRibbon } from "@/features/home/components/brand-ribbon";
import { CategoryDiscovery } from "@/features/home/components/category-discovery";
import { GenderDiscovery } from "@/features/home/components/gender-discovery";
import { CollectionPreview } from "@/features/home/components/collection-preview";
import { Hero } from "@/features/home/components/hero";
import { FamilyDiscovery } from "@/features/home/components/family-discovery";
import { homeDescription, siteUrl } from "@/features/seo/lib/metadata";

export const metadata: Metadata = {
  description: homeDescription,
  alternates: { canonical: siteUrl("/") },
};

export default function Home() {
  return (
    <main id="conteudo">
      <Hero />
      <BrandRibbon />
      <CategoryDiscovery />
      <GenderDiscovery />
      <FamilyDiscovery />
      <CollectionPreview />
      <AboutSection />
    </main>
  );
}
