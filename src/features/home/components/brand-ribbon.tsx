"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Reveal } from "@/shared/components/reveal";

const phrases = ["Presença nos detalhes", "Beleza em cada descoberta", "O seu próximo encanto"];
const ornament = "/branding/lavender-ornament-gold.svg";

export function BrandRibbon() {
  const [enabled, setEnabled] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 1050px) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(media.matches);
    const initial = window.setTimeout(update, 0);
    media.addEventListener("change", update);
    return () => { window.clearTimeout(initial); media.removeEventListener("change", update); };
  }, []);
  return (
    <section className="brand-ribbon" aria-label="A essência da marca">
      <Reveal className="phrase-strip wrap" data-ticker={enabled}>
        <Image src={ornament} alt="" width={76} height={138} />
        <p>{phrases[0]}</p>
        <Image src={ornament} alt="" width={76} height={138} />
        <p>{phrases[1]}</p>
        <Image src={ornament} alt="" width={76} height={138} />
        <p>{phrases[2]}</p>
        <Image src={ornament} alt="" width={76} height={138} />
      </Reveal>
      {enabled && (
        <button className="phrase-ticker" type="button" data-paused={paused}
          aria-label={`${paused ? "Retomar" : "Pausar"} movimento das frases: ${phrases.join(", ")}`}
          onClick={() => setPaused(value => !value)}>
          <span className="phrase-ticker-track" aria-hidden="true">
            {[0, 1].map(copy => (
              <span className="phrase-ticker-group" key={copy}>
                {phrases.map(phrase => <span className="phrase-ticker-item" key={phrase}>
                  <Image src={ornament} alt="" width={76} height={138} /><span>{phrase}</span>
                </span>)}
              </span>
            ))}
          </span>
        </button>
      )}
    </section>
  );
}
