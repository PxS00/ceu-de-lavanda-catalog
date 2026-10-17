"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";

export function useReveal(contentKey = "") {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (
      !root ||
      !window.IntersectionObserver ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const elements = [...root.querySelectorAll<HTMLElement>("[data-reveal]")];
    if (!elements.length && root.matches("[data-reveal]")) elements.push(root);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08 },
    );
    for (const element of elements) {
      if (!element.classList.contains("is-revealed")) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [contentKey]);
  return ref;
}

export function Reveal(props: ComponentPropsWithoutRef<"div">) {
  const ref = useReveal();
  return <div {...props} ref={ref} data-reveal />;
}
