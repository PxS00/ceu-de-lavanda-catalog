import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/shared/components/reveal";

export function Hero() {
  return (
    <section className="hero wrap">
      <Reveal className="hero-copy">
        <h1>
          Um encontro
          <br />
          com o seu
          <br />
          <em className="decorative-text">próximo encanto.</em>
        </h1>
        <p className="hero-description">
          Há nomes que despertam a curiosidade.
          <br />
          Encontre o seu e comece a descobrir.
        </p>
        <Link className="button" href="#colecao">
          Explorar a coleção <ArrowUpRight aria-hidden="true" />
        </Link>
      </Reveal>
      <Reveal className="hero-art" aria-hidden="true">
        <Image
          src="/branding/ceu-de-lavanda-monogram-graphite.svg"
          alt=""
          width={111.56}
          height={176.35}
          priority
        />
      </Reveal>
    </section>
  );
}
