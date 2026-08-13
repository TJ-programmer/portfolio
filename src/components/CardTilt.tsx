"use client";

import { useEffect } from "react";

const SELECTOR = [
  ".skill-card",
  ".project-card",
  ".timeline-item",
  ".internship-card",
  ".id-panel",
  ".prose-panel",
  ".contact-form",
].join(",");

const MAX_TILT = 9;

export default function CardTilt() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const card = t.closest<HTMLElement>(SELECTOR);
      if (!card) return;
      const r = card.getBoundingClientRect();
      if (r.width === 0) return;
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (0.5 - py) * MAX_TILT * 2;
      const ry = (px - 0.5) * MAX_TILT * 2;
      card.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px) scale(1.012)`;
      card.style.backgroundImage = `radial-gradient(circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(255, 216, 77, 0.14), transparent 55%)`;
      card.style.transition = "transform 100ms linear";
      card.dataset.tilted = "1";
    };

    const onLeave = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const card = t.closest<HTMLElement>(SELECTOR);
      if (!card) return;
      if (card.contains(e.relatedTarget as Node | null)) return;
      if (card.dataset.tilted !== "1") return;
      card.style.transition = "";
      card.style.backgroundImage = "";
      card.style.transform = "";
      delete card.dataset.tilted;
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerout", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onLeave);
    };
  }, []);

  return null;
}
