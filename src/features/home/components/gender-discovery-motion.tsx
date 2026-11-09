"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function GenderDiscoveryMotion({ children }: { children: ReactNode }) {
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = grid.current;
    if (!root || !window.IntersectionObserver || !matchMedia("(hover: none) and (pointer: coarse)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-glinting");
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: .25 });
    root.querySelectorAll(".gender-discovery-card").forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return <div className="gender-discovery-grid" ref={grid}>{children}</div>;
}
