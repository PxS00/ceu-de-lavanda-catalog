"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function RelatedCarousel({ children }: { children: ReactNode }) {
  const track = useRef<HTMLUListElement>(null);
  const id = useId();
  const [edges, setEdges] = useState({ start: true, end: false });
  useEffect(() => {
    const list = track.current;
    if (!list) return;
    const update = () => setEdges({
      start: list.scrollLeft <= 2,
      end: list.scrollLeft + list.clientWidth >= list.scrollWidth - 2,
    });
    const observer = new ResizeObserver(update);
    observer.observe(list);
    list.addEventListener("scroll", update, { passive: true });
    update();
    return () => { observer.disconnect(); list.removeEventListener("scroll", update); };
  }, []);
  function move(direction: number) {
    const list = track.current;
    if (!list) return;
    const card = list.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    list.scrollBy({
      left: direction * ((card?.offsetWidth ?? list.clientWidth) + gap),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }
  return (
    <>
      <div className="related-controls" aria-label="Controles das sugestões">
        <button type="button" aria-label="Fragrância anterior" aria-controls={id} disabled={edges.start} onClick={() => move(-1)}><ArrowLeft aria-hidden="true" /></button>
        <button type="button" aria-label="Próxima fragrância" aria-controls={id} disabled={edges.end} onClick={() => move(1)}><ArrowRight aria-hidden="true" /></button>
      </div>
      <ul id={id} className="related-track" ref={track} tabIndex={0} aria-label="Fragrâncias sugeridas">
        {children}
      </ul>
    </>
  );
}
