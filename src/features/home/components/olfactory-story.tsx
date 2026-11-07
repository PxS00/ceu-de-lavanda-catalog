"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function OlfactoryStory() {
  const section = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);
    const updateVisibility = () => setTabVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", updateVisibility); };
  }, []);
  return <section className="olfactory-story wrap" ref={section} aria-labelledby="olfactory-story-title">
    <div className="olfactory-story-art" data-playing={visible && tabVisible && !paused}>
      <Image src="/campaigns/olfactory-spray.webp" alt="" width={1536} height={1024} sizes="(max-width: 760px) 100vw, 50vw" />
      <span className="olfactory-mist" aria-hidden="true" />
    </div>
    <div className="olfactory-story-copy">
      <p className="eyebrow">UM RITUAL DE DESCOBERTA</p>
      <h2 id="olfactory-story-title">Cada fragrância conta uma história</h2>
      <p>Um perfume se revela aos poucos. Conheça os três momentos da sua composição.</p>
      <dl>
        <div><dt>Notas de saída</dt><dd>A primeira impressão que percebemos ao aplicar.</dd></div>
        <div><dt>Notas de corpo</dt><dd>O coração da fragrância, que aparece depois da abertura.</dd></div>
        <div><dt>Notas de fundo</dt><dd>A base que sustenta a composição ao longo do tempo.</dd></div>
      </dl>
      <Link href="/familias-olfativas/" className="text-link">Conheça as famílias olfativas ↗</Link>
      <button className="olfactory-motion-control" type="button" onClick={() => setPaused((value) => !value)}>{paused ? "Retomar animação" : "Pausar animação"}</button>
    </div>
  </section>;
}
