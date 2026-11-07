"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { OlfactoryMist } from "./olfactory-mist";

const moments = [
  { title: "Notas de saída", detail: "A primeira impressão que percebemos ao aplicar.", signature: "O primeiro encontro", description: "A abertura apresenta a fragrância e desperta os sentidos." },
  { title: "Notas de corpo", detail: "O coração da fragrância, que aparece depois da abertura.", signature: "A personalidade se revela", description: "Depois da abertura, o coração revela novas nuances da composição." },
  { title: "Notas de fundo", detail: "A base que sustenta a composição ao longo do tempo.", signature: "Uma lembrança na pele", description: "As notas de base dão profundidade e acompanham a evolução do perfume." },
];

export function OlfactoryStory() {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      element.classList.toggle("is-scroll-ready", !reducedMotion.matches);
      if (reducedMotion.matches) return;
      const rect = element.getBoundingClientRect();
      const scene = element.firstElementChild as HTMLElement;
      const distance = Math.max(1, rect.height - scene.offsetHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / distance));
      const phase = Math.min(progress * 3, 2.999);
      element.dataset.stage = String(Math.floor(phase));
      // The plume advances with scrolling, rather than an automatic loop.
      const burst = (phase % 1) / 0.65;
      element.style.setProperty("--mist-opacity", String(burst < 1 ? Math.sin(burst * Math.PI) * 0.85 : 0));
      element.style.setProperty("--mist-travel", `${Math.min(burst, 1) * 12}px`);
      element.style.setProperty("--mist-scale", String(0.45 + Math.min(burst, 1) * 0.8));
      element.style.setProperty("--story-progress", String(progress));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, []);
  return <section id="notas-olfativas" className="olfactory-story" ref={section} aria-labelledby="olfactory-story-title" data-stage="0">
    <div className="olfactory-scene">
      <div className="olfactory-story-art" aria-hidden="true">
        <Image src="/campaigns/olfactory-panorama.webp" alt="" fill sizes="100vw" />
        <OlfactoryMist />
      </div>
      <header className="olfactory-heading">
        <p className="eyebrow">UM RITUAL DE DESCOBERTA</p>
        <h2 id="olfactory-story-title">Cada fragrância conta uma história</h2>
      </header>
      <div className="olfactory-narrative" aria-hidden="true">
        {moments.map((moment, index) => <div className="olfactory-chapter" key={moment.title}>
          <p className="eyebrow">0{index + 1} / 03</p><h3>{moment.signature}</h3><p>{moment.description}</p>
        </div>)}
      </div>
      <svg className="olfactory-trails" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength="1" d="M 510 125 C 610 60 630 165 735 165" />
        <path pathLength="1" d="M 510 125 C 620 120 625 300 735 300" />
        <path pathLength="1" d="M 510 125 C 625 160 610 435 735 435" />
      </svg>
      <dl className="olfactory-notes">
        {moments.map((moment, index) => <div className="olfactory-note" key={moment.title}>
          <dt><span>0{index + 1}</span> {moment.title}</dt><dd>{moment.detail}</dd>
        </div>)}
      </dl>
      <div className="olfactory-scene-footer">
        <span className="olfactory-scroll-hint">Role para descobrir <span aria-hidden="true">↓</span></span>
        <Link href="#guia-familias" className="text-link">Explore as famílias olfativas ↓</Link>
      </div>
      <span className="olfactory-progress" aria-hidden="true" />
    </div>
  </section>;
}
