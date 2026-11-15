"use client";

import { useEffect, useRef } from "react";

/** A trailing ink dot that swells into a labelled pill over project cards. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const target = { x: -100, y: -100 };
    const current = { x: -100, y: -100 };
    let raf = 0;
    const tick = () => {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      el.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      el.classList.add("is-on");
      const hit = event.target as Element | null;
      el.classList.toggle("is-view", Boolean(hit?.closest?.("[data-view]")));
      el.classList.toggle("is-link", Boolean(hit?.closest?.("a, button")));
    };
    const leave = () => el.classList.remove("is-on");
    const down = () => el.classList.add("is-down");
    const up = () => el.classList.remove("is-down");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div className="cursor" ref={ref} aria-hidden="true">
      <span className="cursor-dot">
        <span data-l="es">Ver</span>
        <span data-l="en">View</span>
      </span>
    </div>
  );
}
