"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { OlfactoryPump } from "./olfactory-pump";

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
    let finalPressureReached = false;
    let activeStage = -1;
    let animations: Animation[] = [];
    const stopAnimations = () => { animations.forEach(animation => animation.cancel()); animations = []; };
    const playSpray = (stage: number) => {
      stopAnimations();
      const pump = element.querySelector<SVGGElement>(".olfactory-pump-button");
      if (!pump) return;
      const hold = stage === 2 || finalPressureReached;
      const start = finalPressureReached ? 7 : 0;
      animations.push(pump.animate([
        { transform: `translateY(${start}px)`, offset: 0 },
        { transform: "translateY(7px)", offset: .2 },
        { transform: "translateY(7px)", offset: .72 },
        { transform: `translateY(${hold ? 7 : 0}px)`, offset: 1 },
      ], { duration: 1800, easing: "ease-in-out" }));
      element.querySelectorAll<SVGPathElement>(`.olfactory-spray path:nth-child(${stage + 1})`).forEach(path => {
        animations.push(path.animate([
          { opacity: 0, strokeDashoffset: "1", filter: "blur(0px)", offset: 0 },
          { opacity: 1, strokeDashoffset: "0", filter: "blur(0px)", offset: .2 },
          { opacity: 1, strokeDashoffset: "0", filter: "blur(0px)", offset: .72 },
          { opacity: 0, strokeDashoffset: "0", filter: "blur(2px)", offset: 1 },
        ], { duration: 1800, easing: "ease-in-out" }));
      });
      if (stage === 2) finalPressureReached = true;
      element.style.setProperty("--pump-press", finalPressureReached ? "7px" : "0px");
    };
    const update = () => {
      frame = 0;
      element.classList.toggle("is-scroll-ready", !reducedMotion.matches);
      if (reducedMotion.matches) {
        stopAnimations();
        activeStage = -1;
        finalPressureReached = false;
        element.style.removeProperty("--pump-press");
        return;
      }
      const rect = element.getBoundingClientRect();
      const scene = element.firstElementChild as HTMLElement;
      const mobileTrails = element.querySelector<SVGSVGElement>(".olfactory-mobile-trails");
      const nozzle = element.querySelector<SVGCircleElement>(".olfactory-nozzle");
      const notes = element.querySelector<HTMLElement>(".olfactory-notes");
      if (mobileTrails && nozzle && notes && getComputedStyle(mobileTrails).display !== "none") {
        const sceneRect = scene.getBoundingClientRect();
        const nozzleRect = nozzle.getBoundingClientRect();
        const notesRect = notes.getBoundingClientRect();
        const x = nozzleRect.left + nozzleRect.width / 2 - sceneRect.left;
        const y = nozzleRect.top + nozzleRect.height / 2 - sceneRect.top;
        const endX = notesRect.right - sceneRect.left;
        const endY = notesRect.top - sceneRect.top;
        mobileTrails.setAttribute("viewBox", `0 0 ${sceneRect.width} ${sceneRect.height}`);
        const curve = `M ${x} ${y} C ${endX} ${y}, ${endX} ${endY - 25}, ${endX} ${endY}`;
        mobileTrails.querySelectorAll("path").forEach(path => path.setAttribute("d", curve));
      }
      const distance = Math.max(1, rect.height - scene.offsetHeight);
      const stickyTop = Number.parseFloat(getComputedStyle(scene).top) || 0;
      const progress = Math.max(0, Math.min(1, (stickyTop - rect.top) / distance));
      const phase = Math.min(progress * 3, 2.999);
      element.dataset.stage = String(Math.floor(phase));
      const stage = Math.floor(phase);
      if (progress <= .005) {
        if (activeStage !== -1) stopAnimations();
        activeStage = -1;
        finalPressureReached = false;
        element.style.setProperty("--pump-press", "0px");
      } else if (progress > .015 && stage !== activeStage && rect.bottom > 0 && rect.top < innerHeight) {
        activeStage = stage;
        playSpray(stage);
      }
      element.style.setProperty("--story-progress", String(progress));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      stopAnimations();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, []);
  return <section id="notas-olfativas" className="olfactory-story" ref={section} aria-labelledby="olfactory-story-title" data-stage="0">
    <div className="olfactory-scene">
      <div className="olfactory-story-art" aria-hidden="true">
        <Image src="/campaigns/olfactory-pump-plate.webp" alt="" fill sizes="100vw" />
        <OlfactoryPump />
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
      <svg className="olfactory-trails olfactory-spray" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength="1" d="M 514 137 C 570 137 615 165 675 165" />
        <path pathLength="1" d="M 514 137 C 580 137 610 300 675 300" />
        <path pathLength="1" d="M 514 137 C 590 145 600 435 675 435" />
      </svg>
      <svg className="olfactory-mobile-trails olfactory-spray" aria-hidden="true">
        <path pathLength="1" /><path pathLength="1" /><path pathLength="1" />
      </svg>
      <dl className="olfactory-notes">
        {moments.map((moment, index) => <div className="olfactory-note" key={moment.title}>
          <dt><span>0{index + 1}</span> {moment.title}</dt><dd><span className="olfactory-mobile-signature">{moment.signature}</span>{moment.detail}</dd>
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
