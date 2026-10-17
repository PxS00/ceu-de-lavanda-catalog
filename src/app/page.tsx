import { AboutSection } from "@/features/home/components/about-section";
import { BrandRibbon } from "@/features/home/components/brand-ribbon";
import { CategoryDiscovery } from "@/features/home/components/category-discovery";
import { CollectionPreview } from "@/features/home/components/collection-preview";
import { Hero } from "@/features/home/components/hero";

export default function Home() {
  return (
    <main id="conteudo">
      <Hero />
      <BrandRibbon />
      <CategoryDiscovery />
      <CollectionPreview />
      <AboutSection />
    </main>
  );
}
