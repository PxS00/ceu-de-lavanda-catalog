import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { products } from "@/features/catalog/lib/catalog";

const options = [
  { value: "feminino", label: "Femininos", image: "/campaigns/gender-feminino.webp" },
  { value: "masculino", label: "Masculinos", image: "/campaigns/gender-masculino.webp" },
  { value: "compartilhavel", label: "Compartilháveis", image: null },
] as const;

export function GenderDiscovery() {
  return <section className="gender-discovery wrap" aria-labelledby="gender-discovery-title">
    <p className="eyebrow">DESCUBRA A COLEÇÃO</p>
    <h2 id="gender-discovery-title">Encontre o seu jeito de sentir</h2>
    <div className="gender-discovery-grid">
      {options.map((option) => {
        const selection = products.filter((product) => product.category === "perfumes" && product.gender === option.value);
        const image = option.image ?? selection.find((product) => product.photo)?.photo?.src ?? "/campaigns/ceu-de-lavanda-hero.webp";
        return <Link href={`/catalogo/perfumes/?genero=${option.value}`} className="gender-discovery-card" data-gender={option.value} key={option.value}>
          <Image src={image} alt="" fill sizes="(max-width: 760px) 90vw, 33vw" />
          <span className="gender-discovery-caption">
            <span className="gender-discovery-eyebrow">{selection.length ? "Explore fragrâncias" : "Em breve"}</span>
            <span className="gender-discovery-name">{option.label}</span>
            <span className="gender-discovery-action">Conhecer <ArrowUpRight aria-hidden="true" /></span>
          </span>
        </Link>;
      })}
    </div>
  </section>;
}
