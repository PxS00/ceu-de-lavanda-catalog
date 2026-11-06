"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Reveal } from "@/shared/components/reveal";

export function BrandRibbon() {
  const [enabled, setEnabled] = useState(false);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(media.matches);
    const initial = window.setTimeout(update, 0);
    media.addEventListener("change", update);
    return () => { window.clearTimeout(initial); media.removeEventListener("change", update); };
  }, []);
  useEffect(() => {
    if (!enabled || paused || interacting) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setCurrent(value => (value + 1) % 3);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [enabled, paused, interacting]);
  return (
    <section className="brand-ribbon" aria-label="A essência da marca" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocus={() => setInteracting(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
      <Reveal className="phrase-strip wrap" data-carousel={enabled}>
        <Image src="/branding/lavender-ornament-gold.svg" alt="" width={76} height={138} />
        <p data-active={current === 0}>Presença nos detalhes</p>
        <Image src="/branding/lavender-ornament-gold.svg" alt="" width={76} height={138} />
        <p data-active={current === 1}>Beleza em cada descoberta</p>
        <Image src="/branding/lavender-ornament-gold.svg" alt="" width={76} height={138} />
        <p data-active={current === 2}>O seu próximo encanto</p>
        <Image src="/branding/lavender-ornament-gold.svg" alt="" width={76} height={138} />
        {enabled && <button className="phrase-pause" type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? "Retomar troca de frases" : "Pausar troca de frases"}>{paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}</button>}
      </Reveal>
    </section>
  );
}
