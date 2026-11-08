"use client";

import { useEffect, useRef } from "react";

export default function HeroVisual() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");
      if (disposed) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0, 5.2);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      const canvas = renderer.domElement;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      mount.appendChild(canvas);

      scene.add(new THREE.AmbientLight(0xffffff, 1));

      const group = new THREE.Group();
      group.rotation.x = -0.14;
      scene.add(group);

      /* ---- build a network sphere (Fibonacci points) ---- */
      const N = 200;
      const R = 1.72;
      const golden = Math.PI * (3 - Math.sqrt(5));
      const vecs: import("three").Vector3[] = [];
      for (let i = 0; i < N; i++) {
        const y = 1 - (i / (N - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = golden * i;
        vecs.push(
          new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(R)
        );
      }

      /* soft round sprite for points */
      const spriteTex = (() => {
        const c = document.createElement("canvas");
        c.width = c.height = 64;
        const ctx = c.getContext("2d")!;
        const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(0.35, "rgba(255,255,255,0.95)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(32, 32, 32, 0, Math.PI * 2);
        ctx.fill();
        const t = new THREE.CanvasTexture(c);
        t.needsUpdate = true;
        return t;
      })();

      const pointGeo = new THREE.BufferGeometry().setFromPoints(vecs);
      const pointMat = new THREE.PointsMaterial({
        size: 0.06,
        map: spriteTex,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const points = new THREE.Points(pointGeo, pointMat);
      group.add(points);

      /* connections between nearby points */
      const MAX = 0.5;
      const linePos: number[] = [];
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          if (vecs[i].distanceTo(vecs[j]) < MAX) {
            linePos.push(vecs[i].x, vecs[i].y, vecs[i].z, vecs[j].x, vecs[j].y, vecs[j].z);
          }
        }
      }
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePos, 3));
      const lineMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.14 });
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      group.add(lines);

      /* lime accent nodes */
      const accentGeo = new THREE.SphereGeometry(0.055, 16, 16);
      const accentMat = new THREE.MeshBasicMaterial({ color: 0xcdf22b });
      const accentIdx = [12, 47, 73, 118, 156, 191];
      const accents: import("three").Mesh[] = accentIdx.map((i, k) => {
        const m = new THREE.Mesh(accentGeo, accentMat);
        m.position.copy(vecs[i]);
        m.userData.phase = k * 1.1;
        group.add(m);
        return m;
      });

      /* ---- theme-aware colours ---- */
      const applyTheme = () => {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        const line = new THREE.Color(isDark ? 0xf2f0ea : 0x0a0b0d);
        pointMat.color.copy(line);
        lineMat.color.copy(line);
      };
      applyTheme();
      const themeObserver = new MutationObserver(applyTheme);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });

      /* ---- sizing ---- */
      const resize = () => {
        const w = mount.clientWidth || 1;
        const h = mount.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);

      /* ---- pointer parallax ---- */
      const target = { x: 0, y: 0 };
      const smoothed = { x: 0, y: 0 };
      const onPointerMove = (e: PointerEvent) => {
        const rect = mount.getBoundingClientRect();
        target.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        target.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });

      /* ---- pause when offscreen ---- */
      let visible = true;
      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { threshold: 0 }
      );
      io.observe(mount);

      /* ---- render loop ---- */
      const clock = new THREE.Clock();
      let raf = 0;
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible) return;

        const t = clock.getElapsedTime();
        smoothed.x += (target.x - smoothed.x) * 0.06;
        smoothed.y += (target.y - smoothed.y) * 0.06;

        if (!reduce) {
          group.rotation.y = t * 0.16 + smoothed.x * 0.35;
        } else {
          group.rotation.y = smoothed.x * 0.35;
        }
        group.rotation.x = -0.14 + smoothed.y * 0.22;

        for (const a of accents) {
          const s = reduce ? 1 : 1 + Math.sin(t * 2 + a.userData.phase) * 0.35;
          a.scale.setScalar(s);
        }

        renderer.render(scene, camera);
      };
      loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        resizeObserver.disconnect();
        themeObserver.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        pointGeo.dispose();
        pointMat.dispose();
        spriteTex.dispose();
        lineGeo.dispose();
        lineMat.dispose();
        accentGeo.dispose();
        accentMat.dispose();
        renderer.dispose();
        if (canvas.parentNode === mount) mount.removeChild(canvas);
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return <div ref={mountRef} className="pointer-events-none absolute inset-0" aria-hidden />;
}
