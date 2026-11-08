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
      scene.add(new THREE.AmbientLight(0xffffff, 0.55));

      const key = new THREE.DirectionalLight(0xffffff, 2.6);
      key.position.set(3.5, 4, 5);
      scene.add(key);

      const rim = new THREE.DirectionalLight(0xffffff, 1.4);
      rim.position.set(-4, -2.5, -3);
      scene.add(rim);

      const lime = new THREE.PointLight(0xcdf22b, 6, 14, 2);
      lime.position.set(-2.4, 1.8, 2.4);
      scene.add(lime);

      /* ---- group (pointer parallax target) ---- */
      const group = new THREE.Group();
      scene.add(group);

      /* crystal */
      const crystalGeo = new THREE.IcosahedronGeometry(1.02, 1);
      const crystalMat = new THREE.MeshStandardMaterial({
        color: 0xcdf22b,
        metalness: 0.5,
        roughness: 0.28,
        flatShading: true,
      });
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      group.add(crystal);

      /* wireframe cage */
      const cageGeo = new THREE.IcosahedronGeometry(1.62, 1);
      const cageMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.32 });
      const cage = new THREE.LineSegments(new THREE.WireframeGeometry(cageGeo), cageMat);
      group.add(cage);

      /* thin orbital ring */
      const ringGeo = new THREE.TorusGeometry(1.9, 0.007, 8, 200);
      const ringMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.4 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.4;
      group.add(ring);

      /* ---- theme-aware line colour ---- */
      const applyTheme = () => {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        const line = new THREE.Color(isDark ? 0xfaf8f3 : 0x08090b);
        cageMat.color.copy(line);
        ringMat.color.copy(line);
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
        group.rotation.y = smoothed.x * 0.35;
        group.rotation.x = smoothed.y * 0.22;

        if (!reduce) {
          crystal.rotation.y = t * 0.28;
          crystal.rotation.x = Math.sin(t * 0.35) * 0.16;
          cage.rotation.y = -t * 0.14;
          cage.rotation.z = t * 0.06;
          ring.rotation.z = -t * 0.2;
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
        crystalGeo.dispose();
        crystalMat.dispose();
        cageGeo.dispose();
        cage.geometry.dispose();
        cageMat.dispose();
        ringGeo.dispose();
        ringMat.dispose();
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
