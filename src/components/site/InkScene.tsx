"use client";

import { useEffect, useRef, useState } from "react";
import { InkPen } from "./InkPen";

/**
 * Hero visual: black honey pours from the top of the page onto a fountain pen,
 * runs down the barrel and leaves the nib as ink. Rendered with three.js; the
 * liquid is a metaball field re-polygonised every frame.
 */
export function InkScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "fallback">("loading");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { MarchingCubes } = await import("three/examples/jsm/objects/MarchingCubes.js");
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        setState("fallback");
        return;
      }

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const compact = window.matchMedia("(max-width: 700px)").matches;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.5 : 1.75));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.setClearAlpha(0);
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
      camera.position.set(0, 0, 10.8);

      // Studio lighting baked into an environment map: soft boxes on black,
      // so the black liquid reads through its reflections alone.
      const studio = new THREE.Scene();
      const panel = (w: number, h: number, color: number, intensity: number, pos: [number, number, number]) => {
        const material = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
        material.color.multiplyScalar(intensity);
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
        mesh.position.set(...pos);
        mesh.lookAt(0, 0, 0);
        studio.add(mesh);
      };
      panel(7, 3, 0xffffff, 5, [0, 9, 3]);
      panel(1.4, 12, 0xffffff, 9, [-8, 1, 4]);
      panel(0.7, 9, 0xbfe3fa, 6, [8, -1, 3]);
      panel(3, 2, 0xffffff, 3, [3, 2, 9]);
      panel(5, 1.2, 0xa9d8f5, 2.5, [-2, -8, 4]);
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTarget = pmrem.fromScene(studio, 0.03);
      scene.environment = envTarget.texture;

      const lacquer = new THREE.MeshPhysicalMaterial({
        color: 0x030303,
        roughness: 0.16,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        envMapIntensity: 1.25,
      });
      const steel = new THREE.MeshStandardMaterial({
        color: 0xd9dde0,
        roughness: 0.2,
        metalness: 1,
        envMapIntensity: 1.3,
        side: THREE.DoubleSide,
      });
      const ink = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        roughness: 0.04,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        envMapIntensity: 1.6,
      });
      const pitch = new THREE.MeshBasicMaterial({ color: 0x000000 });

      const rig = new THREE.Group();
      scene.add(rig);

      // ----- Fountain pen (nib down) -----
      const TILT = 0.6;
      const PEN_SCALE = 1.14;
      const PEN_X = -0.2;
      const PEN_Y = 0.12;
      const pen = new THREE.Group();
      pen.rotation.z = -TILT;
      pen.position.set(PEN_X, PEN_Y, 0);
      pen.scale.setScalar(PEN_SCALE);
      rig.add(pen);
      const GIRTH = 1.5;
      const spin = new THREE.Group();
      spin.scale.set(GIRTH, 1, GIRTH);
      pen.add(spin);

      const profile: Array<[number, number]> = [
        [0.0, -1.38],
        [0.08, -1.38],
        [0.098, -1.3],
        [0.122, -0.92],
        [0.15, -0.64],
        [0.168, -0.56],
        [0.178, -0.5],
        [0.19, -0.2],
        [0.196, 0.4],
        [0.188, 0.9],
        [0.162, 1.16],
        [0.1, 1.28],
        [0.0, 1.31],
      ];
      const barrel = new THREE.Mesh(
        new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 72),
        lacquer,
      );
      spin.add(barrel);

      const band = (radius: number, height: number, y: number) => {
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 72, 1, true), steel);
        mesh.position.y = y;
        spin.add(mesh);
      };
      band(0.184, 0.05, -0.53);
      band(0.2, 0.022, 0.52);
      band(0.2, 0.022, 0.58);

      // Nib: a curved steel sheet tapering to the tip.
      const NIB_LENGTH = 0.82;
      const nibGeometry = new THREE.PlaneGeometry(2, 1, 28, 40);
      const nibPosition = nibGeometry.attributes.position;
      const halfWidth = (v: number) =>
        v < 0.7 ? 0.152 * Math.pow(v / 0.7, 0.72) : 0.152 - (v - 0.7) * 0.09;
      for (let i = 0; i < nibPosition.count; i++) {
        const u = nibPosition.getX(i);
        const v = nibPosition.getY(i) + 0.5;
        const x = u * halfWidth(v);
        nibPosition.setXYZ(i, x, v * NIB_LENGTH, 0.085 - x * x * 3.4);
      }
      nibGeometry.computeVertexNormals();
      const nib = new THREE.Group();
      nib.add(new THREE.Mesh(nibGeometry, steel));
      const slit = new THREE.Mesh(new THREE.PlaneGeometry(0.008, 0.45), pitch);
      slit.position.set(0, 0.225, 0.087);
      nib.add(slit);
      const hole = new THREE.Mesh(new THREE.CircleGeometry(0.026, 24), pitch);
      hole.position.set(0, 0.46, 0.087);
      nib.add(hole);
      const feed = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.012, 0.66, 32), lacquer);
      feed.position.set(0, 0.42, 0.01);
      nib.add(feed);
      nib.position.y = -1.38 - NIB_LENGTH + 0.2;
      spin.add(nib);
      const TIP_LOCAL = nib.position.y;

      // ----- Liquid -----
      const FIELD_X = 2.0;
      const FIELD_Y = 2.9;
      const ISO = 30;
      const SUBTRACT = 10;
      const liquid = new MarchingCubes(compact ? 60 : 84, ink, false, false, 80000);
      liquid.isolation = ISO;
      liquid.scale.set(FIELD_X, FIELD_Y, FIELD_X);
      liquid.frustumCulled = false;
      rig.add(liquid);

      const ball = (x: number, y: number, z: number, radius: number) => {
        if (radius <= 0.005) return;
        const r = radius / (2 * FIELD_X);
        liquid.addBall(
          x / (2 * FIELD_X) + 0.5,
          y / (2 * FIELD_Y) + 0.5,
          z / (2 * FIELD_X) + 0.5,
          (ISO + SUBTRACT) * r * r,
          SUBTRACT,
        );
      };

      // Position on the pen's axis (local y) in rig space.
      const sinT = Math.sin(TILT);
      const cosT = Math.cos(TILT);
      const onPen = (localY: number): [number, number] => [
        PEN_X + localY * PEN_SCALE * sinT,
        PEN_Y + localY * PEN_SCALE * cosT,
      ];
      const penRadius = (y: number) => {
        for (let i = 1; i < profile.length; i++) {
          const [r1, y1] = profile[i];
          const [r0, y0] = profile[i - 1];
          if (y <= y1) return (r0 + ((r1 - r0) * (y - y0)) / (y1 - y0 || 1)) * PEN_SCALE * GIRTH;
        }
        return 0;
      };
      const smooth = (v: number) => v * v * (3 - 2 * v);
      const [capX, capY] = onPen(1.2);
      const [tipX, tipY] = onPen(TIP_LOCAL - 0.02);
      const runs = [
        { side: 0.9, period: 6.2, offset: 0.0, size: 0.17 },
        { side: -0.5, period: 7.6, offset: 0.37, size: 0.15 },
        { side: 0.2, period: 5.4, offset: 0.68, size: 0.16 },
        { side: -1.0, period: 8.8, offset: 0.2, size: 0.13 },
      ];

      const pour = (t: number) => {
        liquid.reset();

        // The stream: beads travelling down a slightly coiling column onto the pen.
        const top = FIELD_Y - 0.1;
        for (let y = top, i = 0; y > capY + 0.1; y -= 0.12, i++) {
          const sway = Math.sin(t * 1.4 + y * 1.7) * 0.016 * (top - y);
          ball(capX + sway, y, 0, 0.105 + 0.024 * Math.sin(i * 0.9 - t * 4.4));
        }

        // Honey gathering around the end of the pen.
        const breathe = Math.sin(t * 0.9);
        ball(capX, capY, 0, 0.41 + breathe * 0.02);
        ball(capX - 0.2 + Math.sin(t * 0.6) * 0.04, capY - 0.22, 0.06, 0.33);
        ball(capX + 0.1, capY + 0.2, 0, 0.27 - breathe * 0.015);
        ball(capX + 0.1, capY - 0.36 + Math.sin(t * 0.7) * 0.03, 0.1, 0.23);
        const [neckX, neckY] = onPen(0.8);
        ball(neckX, neckY - 0.08, 0.05, 0.3 + Math.sin(t * 1.1) * 0.015);

        // Runs creeping down the barrel towards the nib, sagging under it.
        for (const run of runs) {
          const p = (t / run.period + run.offset) % 1;
          const fade = Math.pow(Math.sin(Math.PI * p), 0.55);
          for (let k = 0; k < 5; k++) {
            const localY = 0.8 - smooth(Math.max(0, p - k * 0.03)) * 2.1;
            const [x, y] = onPen(localY);
            const reach = penRadius(localY);
            ball(
              x + sinT * 0.02,
              y - reach * 0.55,
              run.side * reach * 0.75,
              run.size * fade * (1 - k * 0.16) * (1 - p * 0.4),
            );
          }
        }

        // A heavy thread that sags from the barrel and drops off.
        const [sagX, sagY] = onPen(0.05);
        const sag = (t / 5.2 + 0.4) % 1;
        const sagBase = sagY - penRadius(0.05) * 0.8;
        if (sag < 0.7) {
          const stretch = smooth(sag / 0.7);
          for (let k = 0; k < 4; k++) {
            ball(sagX, sagBase - stretch * 0.5 * (k / 3), 0.04, 0.07 + (k === 3 ? 0.07 * stretch : 0));
          }
        } else {
          const fall = (sag - 0.7) / 0.3;
          const y = sagBase - 0.5 - fall * fall * 2.4;
          ball(sagX, y, 0.04, 0.14 * Math.min(1, (y + FIELD_Y - 0.2) * 3));
          ball(sagX, sagBase - 0.1 * (1 - fall), 0.04, 0.08 * (1 - fall));
        }

        // Ink leaving the nib: a drop swells, lets go and accelerates away.
        ball(tipX, tipY + 0.02, 0.05, 0.085);
        const q = (t / 3.4) % 1;
        if (q < 0.56) {
          const grow = smooth(q / 0.56);
          ball(tipX, tipY - 0.03 - grow * 0.09, 0.05, 0.15 * grow);
        } else {
          const fall = (q - 0.56) / 0.44;
          const y = tipY - 0.12 - fall * fall * 1.9;
          ball(tipX, y, 0.05, 0.15 * (1 - fall * 0.2) * Math.min(1, Math.max(0, (y + FIELD_Y - 0.2) * 3)));
          ball(tipX, tipY - 0.03 - fall * 0.05, 0.05, 0.07 * (1 - fall));
        }

        liquid.update();
      };

      // ----- Loop -----
      const pointer = { x: 0, y: 0 };
      const eased = { x: 0, y: 0 };
      const onPointer = (event: PointerEvent) => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      const resize = () => {
        const { clientWidth, clientHeight } = host;
        if (!clientWidth || !clientHeight) return;
        renderer.setSize(clientWidth, clientHeight, false);
        camera.aspect = clientWidth / clientHeight;
        camera.position.z = 10.8 * Math.max(1, 0.92 / camera.aspect);
        camera.updateProjectionMatrix();
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      resize();

      let visible = true;
      const visibility = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      visibility.observe(host);

      const started = performance.now();
      let raf = 0;
      const frame = () => {
        raf = requestAnimationFrame(frame);
        if (!visible) return;
        const t = (performance.now() - started) / 1000 + 4;
        eased.x += (pointer.x - eased.x) * 0.04;
        eased.y += (pointer.y - eased.y) * 0.04;
        spin.rotation.y = Math.sin(t * 0.32) * 0.5 + eased.x * 0.5;
        rig.rotation.y = eased.x * 0.16;
        rig.rotation.x = eased.y * 0.07;
        rig.rotation.z = Math.sin(t * 0.4) * 0.012;
        pour(t);
        renderer.render(scene, camera);
      };

      if (reduced) {
        pour(5.2);
        renderer.render(scene, camera);
      } else {
        frame();
      }
      setState("ready");

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onPointer);
        resizeObserver.disconnect();
        visibility.disconnect();
        envTarget.dispose();
        pmrem.dispose();
        scene.traverse((object) => {
          const mesh = object as import("three").Mesh;
          mesh.geometry?.dispose();
        });
        [lacquer, steel, ink, pitch].forEach((material) => material.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    })().catch(() => setState("fallback"));

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div className={`ink-stage is-${state}`} aria-hidden="true">
      <div className="ink-stage-glow" />
      <div className="ink-stage-canvas" ref={hostRef} />
      {state === "fallback" && <InkPen />}
    </div>
  );
}
