"use client";

import { useEffect, useRef, useState } from "react";

/**
 * First-visit loading screen: an ink level rises while a counter runs, then the
 * whole sheet lifts away. Later navigations in the same tab skip it.
 */
export function Loader() {
  const [phase, setPhase] = useState<"run" | "exit" | "done">("run");
  const countRef = useRef<HTMLSpanElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const finish = () => {
      root.classList.add("is-loaded");
      setPhase("done");
    };

    let seen = false;
    try {
      seen = sessionStorage.getItem("loaded") === "1";
      sessionStorage.setItem("loaded", "1");
    } catch {
      // Without storage the loader simply plays on every full load.
    }
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    const DURATION = 1900;
    const start = performance.now();
    let raf = 0;
    let timer = 0;
    const tick = (now: number) => {
      const linear = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - linear, 2.4);
      if (countRef.current) countRef.current.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      levelRef.current?.style.setProperty("--level", eased.toFixed(4));
      if (linear < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      setPhase("exit");
      root.classList.add("is-loaded");
      timer = window.setTimeout(() => setPhase("done"), 1300);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`loader is-${phase}`} aria-hidden="true">
      <div className="loader-level" ref={levelRef}>
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
          <path d="M0 30 Q150 0 300 30 T600 30 T900 30 T1200 30 V60 H0Z" />
        </svg>
      </div>
      <p className="loader-name">Paolo Pérez Ramos</p>
      <p className="loader-count">
        <span ref={countRef}>000</span>
      </p>
      <svg className="loader-edge" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0 0H1200V20C1130 20 1120 96 1060 96S1000 30 930 30 860 118 780 118 700 40 620 40 560 84 500 84 430 26 360 26 300 104 220 104 150 34 90 34 40 60 0 60Z" />
      </svg>
    </div>
  );
}
