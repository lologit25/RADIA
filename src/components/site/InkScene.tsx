"use client";

import { useEffect, useRef, useState } from "react";
import { InkPen } from "./InkPen";

/**
 * Hero visual: black honey pours from the top of the page onto a feather quill,
 * runs down the shaft and leaves the point as ink. Rendered with three.js; the
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
      // so the black shapes read through their reflections alone.
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
      panel(8, 8, 0xffffff, 1.1, [0, 1, 10]);
      panel(10, 2, 0xffffff, 4, [0, -3, 9]);
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTarget = pmrem.fromScene(studio, 0.03);
      scene.environment = envTarget.texture;

      const plume = new THREE.MeshPhysicalMaterial({
        color: 0xcfccc6,
        roughness: 0.62,
        metalness: 0,
        sheen: 1,
        sheenRoughness: 0.4,
        sheenColor: 0xa9d8f5,
        envMapIntensity: 0.45,
        side: THREE.DoubleSide,
      });
      const horn = new THREE.MeshPhysicalMaterial({
        color: 0xe9e4da,
        roughness: 0.22,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        envMapIntensity: 0.6,
      });
      const ink = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        roughness: 0.04,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        envMapIntensity: 1.6,
      });

      const rig = new THREE.Group();
      scene.add(rig);

      const key = new THREE.DirectionalLight(0xffffff, 1.9);
      key.position.set(-3.5, 4, 6);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xa9d8f5, 1.6);
      rim.position.set(5, -1, -3);
      scene.add(rim);

      // ----- Feather quill (point down) -----
      const TILT = 0.62;
      const SCALE = 1.2;
      const ORIGIN_X = -0.25;
      const ORIGIN_Y = 0.12;
      const HALF = 2;
      const VANE_START = 0.2;
      const bow = (s: number) => 0.3 * s * s;

      const quill = new THREE.Group();
      quill.rotation.z = -TILT;
      quill.position.set(ORIGIN_X, ORIGIN_Y, 0);
      quill.scale.setScalar(SCALE);
      rig.add(quill);
      const spin = new THREE.Group();
      quill.add(spin);

      const spine = new THREE.CatmullRomCurve3(
        Array.from({ length: 17 }, (_, i) => {
          const s = i / 16;
          return new THREE.Vector3(bow(s), -HALF + s * HALF * 2, 0);
        }),
      );
      const shaftRadius = (s: number) =>
        Math.min(0.01 + s * 1.5, 0.056 * Math.pow(1 - s, 0.85) + 0.006);

      const RINGS = 140;
      const SIDES = 14;
      const shaftGeometry = new THREE.TubeGeometry(spine, RINGS, 1, SIDES, false);
      const shaftPosition = shaftGeometry.attributes.position;
      const centre = new THREE.Vector3();
      for (let i = 0; i <= RINGS; i++) {
        spine.getPointAt(i / RINGS, centre);
        const radius = shaftRadius(i / RINGS);
        for (let j = 0; j <= SIDES; j++) {
          const index = i * (SIDES + 1) + j;
          shaftPosition.setXYZ(
            index,
            centre.x + (shaftPosition.getX(index) - centre.x) * radius,
            centre.y + (shaftPosition.getY(index) - centre.y) * radius,
            centre.z + (shaftPosition.getZ(index) - centre.z) * radius,
          );
        }
      }
      shaftGeometry.computeVertexNormals();
      spin.add(new THREE.Mesh(shaftGeometry, horn));

      // Vanes: two cupped sheets of barbs sweeping towards the top, with a few splits.
      const vane = (side: 1 | -1, reach: number, splits: number[]) => {
        const ROWS = 420;
        const COLS = 20;
        const geometry = new THREE.PlaneGeometry(1, 1, COLS, ROWS);
        const position = geometry.attributes.position;
        for (let i = 0; i < position.count; i++) {
          const u = position.getX(i) + 0.5;
          const v = position.getY(i) + 0.5;
          const s = VANE_START + v * (1 - VANE_START);
          spine.getPointAt(s, centre);
          let width = reach * Math.pow(Math.sin(Math.PI * Math.pow(v, 0.55)), 0.62);
          for (const split of splits) {
            width *= 1 - 0.55 * Math.exp(-Math.pow((v - split) / 0.01, 2));
          }
          width *= 1 + 0.02 * Math.sin(v * 37) + 0.012 * Math.sin(v * 113);
          const sweep = 0.42 + v * 0.55;
          const distance = u * width;
          const barbs = Math.sin(v * Math.PI * 2 * 70);
          position.setXYZ(
            i,
            centre.x + side * Math.cos(sweep) * distance,
            centre.y + Math.sin(sweep) * distance,
            -0.3 * distance * distance +
              0.02 * Math.sin(v * 9 + side) * u +
              0.008 * barbs * Math.pow(u, 0.35),
          );
        }
        geometry.computeVertexNormals();
        spin.add(new THREE.Mesh(geometry, plume));
      };
      vane(1, 0.66, [0.24, 0.55, 0.8]);
      vane(-1, 0.46, [0.4, 0.68]);

      // Position on the quill's spine (0 = point, 1 = top) in rig space.
      const sinT = Math.sin(TILT);
      const cosT = Math.cos(TILT);
      const onQuill = (s: number): [number, number] => {
        const x = bow(s) * SCALE;
        const y = (-HALF + s * HALF * 2) * SCALE;
        return [ORIGIN_X + x * cosT + y * sinT, ORIGIN_Y - x * sinT + y * cosT];
      };

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

      const smooth = (v: number) => v * v * (3 - 2 * v);
      const [capX, capY] = onQuill(0.9);
      const [tipX, tipY] = onQuill(0.004);
      const runs = [
        { side: 0.9, period: 6.2, offset: 0.0, size: 0.115 },
        { side: -0.6, period: 7.6, offset: 0.37, size: 0.1 },
        { side: 0.3, period: 5.4, offset: 0.68, size: 0.11 },
      ];

      const pour = (t: number) => {
        liquid.reset();

        // The stream: beads travelling down a slightly coiling column onto the feather.
        const top = FIELD_Y - 0.1;
        for (let y = top, i = 0; y > capY + 0.1; y -= 0.12, i++) {
          const sway = Math.sin(t * 1.4 + y * 1.7) * 0.016 * (top - y);
          ball(capX + sway, y, 0, 0.105 + 0.024 * Math.sin(i * 0.9 - t * 4.4));
        }

        // Honey gathering over the top of the feather.
        const breathe = Math.sin(t * 0.9);
        ball(capX, capY, 0.02, 0.36 + breathe * 0.02);
        ball(capX - 0.2 + Math.sin(t * 0.6) * 0.04, capY - 0.2, 0.06, 0.27);
        ball(capX + 0.12, capY + 0.18, 0, 0.25 - breathe * 0.015);
        ball(capX + 0.14, capY - 0.34 + Math.sin(t * 0.7) * 0.03, 0.08, 0.22);
        const [neckX, neckY] = onQuill(0.8);
        ball(neckX, neckY - 0.05, 0.05, 0.2 + Math.sin(t * 1.1) * 0.015);

        // Runs creeping down the shaft towards the point.
        for (const run of runs) {
          const p = (t / run.period + run.offset) % 1;
          const fade = Math.pow(Math.sin(Math.PI * p), 0.55);
          for (let k = 0; k < 5; k++) {
            const s = 0.7 - smooth(Math.max(0, p - k * 0.03)) * 0.62;
            const [x, y] = onQuill(s);
            ball(x, y - 0.03, run.side * 0.03, run.size * fade * (1 - k * 0.16) * (1 - p * 0.45));
          }
        }

        // A heavy thread that sags from the bare shaft and drops off.
        const [sagX, sagY] = onQuill(0.2);
        const sag = (t / 5.2 + 0.4) % 1;
        const sagBase = sagY - 0.05;
        if (sag < 0.7) {
          const stretch = smooth(sag / 0.7);
          for (let k = 0; k < 4; k++) {
            ball(sagX, sagBase - stretch * 0.5 * (k / 3), 0.02, 0.065 + (k === 3 ? 0.07 * stretch : 0));
          }
        } else {
          const fall = (sag - 0.7) / 0.3;
          const y = sagBase - 0.5 - fall * fall * 2.4;
          ball(sagX, y, 0.02, 0.135 * Math.min(1, Math.max(0, (y + FIELD_Y - 0.2) * 3)));
          ball(sagX, sagBase - 0.1 * (1 - fall), 0.02, 0.075 * (1 - fall));
        }

        // Ink leaving the point: a drop swells, lets go and accelerates away.
        ball(tipX, tipY + 0.03, 0, 0.075);
        const q = (t / 3.4) % 1;
        if (q < 0.56) {
          const grow = smooth(q / 0.56);
          ball(tipX, tipY - 0.03 - grow * 0.09, 0, 0.15 * grow);
        } else {
          const fall = (q - 0.56) / 0.44;
          const y = tipY - 0.12 - fall * fall * 1.9;
          ball(tipX, y, 0, 0.15 * (1 - fall * 0.2) * Math.min(1, Math.max(0, (y + FIELD_Y - 0.2) * 3)));
          ball(tipX, tipY - 0.03 - fall * 0.05, 0, 0.07 * (1 - fall));
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
        spin.rotation.y = Math.sin(t * 0.32) * 0.42 + eased.x * 0.45;
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
        [plume, horn, ink].forEach((material) => material.dispose());
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
