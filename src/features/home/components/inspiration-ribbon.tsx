"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
  const rows = [brands.filter((_, index) => index % 2 === 0), brands.filter((_, index) => index % 2 === 1)].filter((row) => row.length);
  return <section className="inspirations" aria-labelledby="inspirations-title">
    <div className="wrap inspirations-heading">
      <p className="eyebrow">INSPIRAÇÕES</p>
      <h2 id="inspirations-title">Aromas que despertam lembranças</h2>
      <p>Referências olfativas que fazem parte da nossa inspiração.</p>
    </div>
    <ul className="inspirations-list">
      {brands.map((brand) => <li key={brand}>{brand}</li>)}
    </ul>
    {animate && <button type="button" className="inspirations-motion" data-paused={paused}
      aria-label={paused ? "Retomar movimento das inspirações" : "Pausar movimento das inspirações"}
      aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
      {rows.map((row, rowIndex) => <div className="inspirations-row" key={rowIndex} aria-hidden="true">
        <div className={`inspirations-track${rowIndex % 2 ? " inspirations-reverse" : ""}`}>
          {[0, 1].map((group) => <div className="inspirations-group" key={group}>
            {Array.from({ length: 8 }, (_, copy) => row.map((brand, index) =>
              <span className="inspirations-item" key={`${copy}-${index}`}><span>{brand}</span><Image src="/branding/lavender-ornament-gold.svg" alt="" width={76} height={138} /></span>))}
          </div>)}
        </div>
      </div>)}
    </button>}
    <p className="inspirations-note wrap">As marcas citadas pertencem aos seus titulares e são mencionadas como referências olfativas, sem indicar vínculo ou afiliação.</p>
  </section>;
}
