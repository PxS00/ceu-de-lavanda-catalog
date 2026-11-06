"use client";

import { useEffect, useState } from "react";

export function InspirationRibbon({ brands }: { brands: string[] }) {
  const [animate, setAnimate] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAnimate(!media.matches);
    const timer = window.setTimeout(update, 0);
    media.addEventListener("change", update);
    return () => { window.clearTimeout(timer); media.removeEventListener("change", update); };
  }, []);
  if (!brands.length) return null;
  return <section className="inspirations" aria-labelledby="inspirations-title">
    <div className="wrap inspirations-heading">
      <p className="eyebrow">INSPIRAÇÕES</p>
      <h2 id="inspirations-title">Aromas que despertam lembranças</h2>
      <p>Referências olfativas que fazem parte da nossa inspiração.</p>
    </div>
    <ul className="inspirations-list">
      {brands.map((brand) => <li key={brand}>{brand}</li>)}
    </ul>
    {animate && <div className="inspirations-motion" data-paused={paused}>
      <div className="inspirations-track" aria-hidden="true">
        {[0, 1].map((group) => <div className="inspirations-group" key={group}>
          {Array.from({ length: 8 }, (_, copy) => brands.map((brand, index) =>
            <span className="inspirations-item" key={`${copy}-${index}`}><span>{brand}</span><span className="inspirations-separator">✦</span></span>))}
        </div>)}
      </div>
      <button type="button" className="inspirations-toggle" onClick={() => setPaused((value) => !value)}>
        {paused ? "Retomar movimento" : "Pausar movimento"}
      </button>
    </div>}
    <p className="inspirations-note wrap">As marcas citadas pertencem aos seus titulares e são mencionadas como referências olfativas, sem indicar vínculo ou afiliação.</p>
  </section>;
}
