"use client";

import { useEffect, useRef, useState } from "react";
import TechnicalGrid from "@/components/three/TechnicalGrid";
import {
  clamp01,
  type SceneTheme,
  type UpdateCtx,
} from "@/components/three/sceneTypes";

function Fallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-[74%] w-[74%] max-w-[460px]">
        <div
          className="absolute inset-[4%] rounded-full"
          style={{ border: "1px solid var(--line)" }}
        />
        <div
          className="absolute inset-[14%] rounded-full"
          style={{ border: "1px solid var(--line)", transform: "rotate(18deg)" }}
        />
        <div
          className="absolute inset-[24%] rounded-full"
          style={{ border: "1px solid var(--line)", transform: "rotate(-24deg)" }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[19%] w-[58%] rounded-2xl"
          style={{
            background: "#08090b",
            border: "1px solid rgba(250,248,243,0.25)",
            transform: "translate(-50%, -168%) rotate(-6deg)",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[17%] w-[52%] rounded-2xl"
          style={{
            background: "#cdf22b",
            transform: "translate(-50%, -50%) rotate(3deg)",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[19%] w-[58%] rounded-2xl"
          style={{
            background: "#faf8f3",
            border: "1px solid rgba(8,9,11,0.12)",
            transform: "translate(-50%, 68%) rotate(-3deg)",
          }}
        />
      </div>
    </div>
  );
}

export default function HeroVisual() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      let renderer: import("three").WebGLRenderer | null = null;
      let canvasEl: HTMLCanvasElement | null = null;

      try {
        const THREE = await import("three");
        const [
          { createLighting },
          { createFloatingPanels },
          { createOrbitRings },
          { createOrbitalNodes },
        ] = await Promise.all([
          import("@/components/three/SceneLighting"),
          import("@/components/three/FloatingPanels"),
          import("@/components/three/OrbitRings"),
          import("@/components/three/OrbitalNodes"),
        ]);
        if (disposed) return;

        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        const mobile = window.matchMedia("(max-width: 1023px)").matches;

        try {
          renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          });
        } catch {
          if (!disposed) setFailed(true);
          return;
        }

        const gl = renderer;
        if (!gl) {
          if (!disposed) setFailed(true);
          return;
        }

        gl.setPixelRatio(
          Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)
        );
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;

        const canvas = gl.domElement;
        canvasEl = canvas;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
        camera.position.set(0, 0, 7);
        camera.lookAt(0, 0, 0);

        const model = new THREE.Group();
        model.rotation.set(-0.16, 0.34, 0);
        scene.add(model);

        const lighting = createLighting();
        scene.add(lighting.object);

        const structure = [
          createFloatingPanels(),
          createOrbitRings(),
          createOrbitalNodes(),
        ];
        structure.forEach((part) => model.add(part.object));
        const parts = [lighting, ...structure];

        const readTheme = (): SceneTheme =>
          document.documentElement.getAttribute("data-theme") === "light"
            ? "light"
            : "dark";
        let theme = readTheme();
        parts.forEach((part) => part.setTheme?.(theme));

        const themeObserver = new MutationObserver(() => {
          theme = readTheme();
          parts.forEach((part) => part.setTheme?.(theme));
        });
        themeObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["data-theme"],
        });

        const resize = () => {
          const width = mount.clientWidth || 1;
          const height = mount.clientHeight || 1;
          gl.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        };
        resize();
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(mount);

        const pointer = { x: 0, y: 0 };
        const smoothed = { x: 0, y: 0 };
        let hover = 0;
        let hoverTarget = 0;
        const clamp = (value: number) => Math.max(-1, Math.min(1, value));

        const resetPointer = () => {
          pointer.x = 0;
          pointer.y = 0;
          hoverTarget = 0;
        };

        const onPointerMove = (event: PointerEvent) => {
          const rect = mount.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          const nx = (event.clientX - rect.left) / rect.width;
          const ny = (event.clientY - rect.top) / rect.height;
          if (nx < 0 || nx > 1 || ny < 0 || ny > 1) {
            resetPointer();
            return;
          }
          pointer.x = clamp((nx - 0.5) * 2);
          pointer.y = clamp((ny - 0.5) * 2);
          hoverTarget = 1;
        };

        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("pointerleave", resetPointer);
        window.addEventListener("blur", resetPointer);

        let scroll = 0;
        const onScroll = () => {
          scroll = clamp01((window.scrollY || 0) / 700);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        let visible = true;
        const intersectionObserver = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
        });
        intersectionObserver.observe(mount);

        let running = true;
        const onContextLost = (event: Event) => {
          event.preventDefault();
          running = false;
          if (canvas.parentNode === mount) mount.removeChild(canvas);
          if (!disposed) setFailed(true);
        };
        canvas.addEventListener("webglcontextlost", onContextLost);

        mount.appendChild(canvas);

        const clock = new THREE.Clock();
        let last = 0;
        let raf = 0;

        const loop = () => {
          if (!running) return;
          raf = requestAnimationFrame(loop);
          const time = clock.getElapsedTime();
          const dt = Math.min(0.05, time - last);
          last = time;

          if (!visible) return;

          hover += (hoverTarget - hover) * 0.08;
          smoothed.x += (pointer.x - smoothed.x) * 0.06;
          smoothed.y += (pointer.y - smoothed.y) * 0.06;

          if (!reduce) {
            model.rotation.x =
              -0.16 + smoothed.y * 0.12 + Math.sin(time * 0.2) * 0.015;
            model.rotation.y =
              0.34 +
              smoothed.x * 0.2 +
              Math.sin(time * 0.13) * 0.05 +
              scroll * 0.18;
          } else {
            model.rotation.x = -0.16;
            model.rotation.y = 0.34;
          }

          const entrance = reduce ? 1 : clamp01(time / 1.2);
          const ctx: UpdateCtx = {
            elapsed: time,
            dt,
            reduce,
            hover,
            entrance,
            scroll,
          };
          parts.forEach((part) => part.update?.(ctx));

          gl.render(scene, camera);
        };
        loop();

        cleanup = () => {
          running = false;
          cancelAnimationFrame(raf);
          intersectionObserver.disconnect();
          resizeObserver.disconnect();
          themeObserver.disconnect();
          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("pointerleave", resetPointer);
          window.removeEventListener("blur", resetPointer);
          window.removeEventListener("scroll", onScroll);
          canvas.removeEventListener("webglcontextlost", onContextLost);
          parts.forEach((part) => part.dispose());
          gl.dispose();
          if (canvas.parentNode === mount) mount.removeChild(canvas);
        };
      } catch {
        if (!disposed) setFailed(true);
        renderer?.dispose();
        if (canvasEl && canvasEl.parentNode === mount) {
          mount.removeChild(canvasEl);
        }
      }
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <TechnicalGrid className="absolute inset-0 opacity-40" />
      <div ref={mountRef} className="absolute inset-0" />
      {failed ? <Fallback /> : null}
    </div>
  );
}
