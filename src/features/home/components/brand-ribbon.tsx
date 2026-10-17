import Image from "next/image";
import { Reveal } from "@/components/reveal";

export function BrandRibbon() {
  return (
    <section className="brand-ribbon" aria-label="A essência da marca">
      <Reveal className="phrase-strip wrap">
        <Image src="/branding/lavender-ornament-gold.svg" alt="" width={76} height={138} />
        <p>Presença nos detalhes</p>
        <Image src="/branding/lavender-ornament-gold.svg" alt="" width={76} height={138} />
        <p>Beleza em cada descoberta</p>
        <Image src="/branding/lavender-ornament-gold.svg" alt="" width={76} height={138} />
        <p>O seu próximo encanto</p>
        <Image src="/branding/lavender-ornament-gold.svg" alt="" width={76} height={138} />
      </Reveal>
    </section>
  );
}
