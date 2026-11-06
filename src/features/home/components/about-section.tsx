import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/shared/components/reveal";

export function AboutSection() {
  return (
    <section className="about wrap" id="sobre" tabIndex={-1}>
      <p className="eyebrow">SOBRE A MARCA</p>
      <Reveal>
        <h2>
          A essência da
          <br />
          <em className="decorative-text">Céu de Lavanda</em>
        </h2>
        <span className="about-artisan">Produção 100% artesanal</span>
        <p>
          Na Céu de Lavanda, acreditamos que uma fragrância pode tornar os
          momentos do dia mais especiais e revelar um pouco de quem somos.
        </p>
        <p>
          Nossa coleção reúne perfumes para diferentes gostos e ocasiões, em um
          convite para descobrir aromas que acompanhem você de um jeito único.
        </p>
        <Link className="text-link" href="/catalogo/">
          Explore a coleção <ArrowUpRight aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  );
}
