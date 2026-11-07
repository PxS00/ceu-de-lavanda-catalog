import { AboutSection } from "@/features/home/components/about-section";
import { BrandRibbon } from "@/features/home/components/brand-ribbon";
import { CategoryDiscovery } from "@/features/home/components/category-discovery";
import { CollectionPreview } from "@/features/home/components/collection-preview";
import { Hero } from "@/features/home/components/hero";
import { FamilyDiscovery } from "@/features/home/components/family-discovery";
import { InspirationRibbon } from "@/features/home/components/inspiration-ribbon";
import { inspirationBrands } from "@/features/home/data/inspirations";
import { OlfactoryStory } from "@/features/home/components/olfactory-story";

export default function Home() {
  return (
    <main id="conteudo">
      <Hero />
      <BrandRibbon />
      <CategoryDiscovery />
      <FamilyDiscovery />
      <InspirationRibbon brands={inspirationBrands} />
      <OlfactoryStory />
      <CollectionPreview />
      <AboutSection />
    </main>
  );
}
