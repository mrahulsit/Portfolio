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
      const { RoundedBoxGeometry } = await import(
        "three/examples/jsm/geometries/RoundedBoxGeometry.js"
      );
      if (disposed) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0.2, 5.4);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      const canvas = renderer.domElement;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      mount.appendChild(canvas);

      /* ---- lights ---- */
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));

      const key = new THREE.DirectionalLight(0xffffff, 2.8);
      key.position.set(4, 5, 6);
      scene.add(key);

      const rim = new THREE.DirectionalLight(0xffffff, 1.3);
      rim.position.set(-4, -2.5, -3);
      scene.add(rim);

      const lime = new THREE.PointLight(0xcdf22b, 8, 16, 2);
      lime.position.set(-2.6, 2.2, 2.8);
      scene.add(lime);

      /* ---- full-stack layers ---- */
      const group = new THREE.Group();
      group.rotation.x = -0.32;
      scene.add(group);

      const neutralMats: import("three").MeshStandardMaterial[] = [];
      const geos: import("three").BufferGeometry[] = [];
      const mats: import("three").Material[] = [];

      const ACCENT = 0xcdf22b;
      const layers = [
        { y: -0.57, color: 0x9aa0a8 }, // data
        { y: -0.19, color: 0x9aa0a8 }, // api
        { y: 0.19, color: 0x9aa0a8 }, // logic
        { y: 0.57, color: ACCENT }, // ui / frontend
      ];

      for (const layer of layers) {
        const geo = new RoundedBoxGeometry(2.35, 0.18, 2.35, 4, 0.07);
        const isAccent = layer.color === ACCENT;
        const mat = new THREE.MeshStandardMaterial({
          color: layer.color,
          metalness: 0.55,
          roughness: 0.3,
          emissive: isAccent ? 0x2b3600 : 0x000000,
          emissiveIntensity: isAccent ? 0.9 : 0,
        });
        if (!isAccent) neutralMats.push(mat);

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = layer.y;
        group.add(mesh);

        geos.push(geo);
        mats.push(mat);
      }

      /* ---- theme-aware neutral colour ---- */
      const applyTheme = () => {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        const c = new THREE.Color(isDark ? 0xd7dae0 : 0x353a43);
        for (const m of neutralMats) m.color.copy(c);
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
          group.rotation.y = t * 0.32 + smoothed.x * 0.4;
          group.position.y = Math.sin(t * 0.8) * 0.04;
        } else {
          group.rotation.y = smoothed.x * 0.4;
        }
        group.rotation.x = -0.32 + smoothed.y * 0.18;

        renderer.render(scene, camera);
      };
      loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        resizeObserver.disconnect();
        themeObserver.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        for (const g of geos) g.dispose();
        for (const m of mats) m.dispose();
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
