"use client";

import { useEffect, useRef } from "react";

interface Blot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  grow: number;
  age: number;
  life: number;
  drip: number;
}

/** Every click throws a splash of glossy black ink that spreads, drips and fades. */
export function InkClicks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let blots: Blot[] = [];
    let raf = 0;
    let last = 0;
    const ratio = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (time: number) => {
      const dt = Math.min(0.04, (time - last) / 1000 || 0.016);
      last = time;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      blots = blots.filter((blot) => blot.age < blot.life);
      const shapes: Array<{ blot: Blot; radius: number; alpha: number; tail: number }> = [];
      for (const blot of blots) {
        blot.age += dt;
        if (!blot.grow) blot.vy += 900 * dt;
        blot.vx *= 1 - 2.2 * dt;
        blot.x += blot.vx * dt;
        blot.y += blot.vy * dt;
        const k = blot.age / blot.life;
        const swell = blot.grow ? 1 - Math.pow(1 - Math.min(1, blot.age / 0.35), 3) : 1;
        const radius = blot.radius * swell * (blot.grow ? 1 : 1 - k * 0.5);
        if (radius < 0.4) continue;
        shapes.push({
          blot,
          radius,
          alpha: k < 0.6 ? 1 : 1 - (k - 0.6) / 0.4,
          tail: blot.drip * Math.min(1, blot.age / 1.1) * 90,
        });
      }

      const trace = ({ blot, radius, tail }: (typeof shapes)[number]) => {
        context.beginPath();
        if (tail > 1) {
          context.moveTo(blot.x - radius * 0.34, blot.y);
          context.quadraticCurveTo(blot.x - radius * 0.1, blot.y + tail * 0.6, blot.x - radius * 0.2, blot.y + tail);
          context.arc(blot.x, blot.y + tail, radius * 0.2, Math.PI, 0, true);
          context.quadraticCurveTo(blot.x + radius * 0.1, blot.y + tail * 0.6, blot.x + radius * 0.34, blot.y);
        }
        context.moveTo(blot.x + radius, blot.y);
        context.arc(blot.x, blot.y, radius, 0, Math.PI * 2);
      };

      // Pass 1: a pale rim around the merged silhouette. Pass 2: solid ink over it.
      context.fillStyle = "#040404";
      for (const pass of [0, 1]) {
        context.shadowColor = pass === 0 ? "rgba(200, 228, 246, 0.9)" : "transparent";
        context.shadowBlur = pass === 0 ? 5 : 0;
        for (const shape of shapes) {
          context.globalAlpha = shape.alpha;
          trace(shape);
          context.fill();
        }
      }
      context.shadowBlur = 0;

      // Pass 3: one specular highlight on the larger blobs.
      context.fillStyle = "rgba(255,255,255,0.85)";
      for (const { blot, radius, alpha } of shapes) {
        if (radius < 5) continue;
        context.globalAlpha = alpha;
        context.beginPath();
        context.ellipse(blot.x - radius * 0.36, blot.y - radius * 0.4, radius * 0.26, radius * 0.12, -0.7, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;

      if (blots.length) {
        raf = requestAnimationFrame(draw);
      } else {
        raf = 0;
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    const splash = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const { clientX: x, clientY: y } = event;
      const lobes = 4 + Math.floor(Math.random() * 3);
      blots.push({ x, y, vx: 0, vy: 0, radius: 15 + Math.random() * 7, grow: 1, age: 0, life: 1.6, drip: 0.6 + Math.random() * 0.5 });
      for (let i = 0; i < lobes; i++) {
        const angle = Math.random() * Math.PI * 2;
        const reach = 9 + Math.random() * 10;
        blots.push({
          x: x + Math.cos(angle) * reach,
          y: y + Math.sin(angle) * reach,
          vx: 0,
          vy: 0,
          radius: 6 + Math.random() * 7,
          grow: 1,
          age: 0,
          life: 1.4 + Math.random() * 0.3,
          drip: Math.random() < 0.35 ? 0.4 + Math.random() * 0.4 : 0,
        });
      }
      const drops = 9 + Math.floor(Math.random() * 6);
      for (let i = 0; i < drops; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 120 + Math.random() * 420;
        blots.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 140,
          radius: 1.5 + Math.random() * 4.5,
          grow: 0,
          age: 0,
          life: 0.7 + Math.random() * 0.6,
          drip: 0,
        });
      }
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };
    window.addEventListener("pointerdown", splash, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", splash);
    };
  }, []);

  return <canvas ref={canvasRef} className="ink-clicks" aria-hidden="true" />;
}
