"use client";

import { useEffect, useRef } from "react";

/**
 * Hero visual: a film of black honey pouring onto a feather quill and running
 * off it as ink. It fades through black at the loop point. The film leans slightly towards the pointer.
 */
export function HeroFilm() {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!stage || !video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      video.pause();
      return;
    }
    video.play().catch(() => undefined);

    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => undefined);
      else video.pause();
    });
    visibility.observe(stage);

    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    let raf = 0;
    const move = (event: PointerEvent) => {
      target.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const tick = () => {
      eased.x += (target.x - eased.x) * 0.05;
      eased.y += (target.y - eased.y) * 0.05;
      stage.style.setProperty("--px", eased.x.toFixed(4));
      stage.style.setProperty("--py", eased.y.toFixed(4));
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      visibility.disconnect();
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="ink-stage" ref={stageRef} aria-hidden="true">
      <div className="ink-stage-glow" />
      <video
        ref={videoRef}
        className="ink-film"
        poster="/hero/feather.jpg"
        width={1280}
        height={720}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
      >
        <source src="/hero/feather.webm" type="video/webm" />
        <source src="/hero/feather.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
