"use client";

import { useEffect, useRef } from "react";
import { TECH_ICONS } from "@/lib/techIcons";

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
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.set(0, 0, 6.1);
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

      const group = new THREE.Group();
      group.rotation.x = -0.1;
      scene.add(group);

      const INK_DARK = new THREE.Color(0xf2f0ea);
      const INK_LIGHT = new THREE.Color(0x0a0b0d);
      const LIME = new THREE.Color(0xcdf22b);

      /* ================= constellation ================= */
      const N = 160;
      const R = 1.9;
      const golden = Math.PI * (3 - Math.sqrt(5));
      const pts: import("three").Vector3[] = [];
      for (let i = 0; i < N; i++) {
        const y = 1 - (i / (N - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = golden * i;
        pts.push(
          new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(R)
        );
      }

      /* round dot sprite texture */
      const makeDotTexture = () => {
        const S = 64;
        const c = document.createElement("canvas");
        c.width = c.height = S;
        const ctx = c.getContext("2d")!;
        const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(0.45, "rgba(255,255,255,0.9)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, S, S);
        const tex = new THREE.CanvasTexture(c);
        tex.needsUpdate = true;
        return tex;
      };

      const dotTex = makeDotTexture();

      const baseGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const baseMat = new THREE.PointsMaterial({
        size: 0.075,
        map: dotTex,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const dots = new THREE.Points(baseGeo, baseMat);
      dots.renderOrder = 0;
      group.add(dots);

      /* lime accent dots */
      const ACCENT_DOTS = [7, 23, 41, 58, 79, 96, 112, 131, 145];
      const accentPts = ACCENT_DOTS.map((i) => pts[i]);
      const accentGeo = new THREE.BufferGeometry().setFromPoints(accentPts);
      const accentMat = new THREE.PointsMaterial({
        size: 0.16,
        map: dotTex,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        sizeAttenuation: true,
        color: LIME,
      });
      const accentDots = new THREE.Points(accentGeo, accentMat);
      accentDots.renderOrder = 1;
      group.add(accentDots);

      /* proximity lines */
      const MAX = 0.62;
      const linePos: number[] = [];
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          if (pts[i].distanceTo(pts[j]) < MAX) {
            linePos.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
          }
        }
      }
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePos, 3));
      const lineMat = new THREE.LineBasicMaterial({
        transparent: true,
        opacity: 0.1,
        depthWrite: false,
      });
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      lines.renderOrder = 1;
      group.add(lines);

      /* ================= tech icons inside the constellation ================= */
      const makeIconTexture = (path: string) => {
        const S = 128;
        const c = document.createElement("canvas");
        c.width = c.height = S;
        const ctx = c.getContext("2d")!;
        const pad = 12;
        const scale = (S - pad * 2) / 24;
        ctx.translate(pad, pad);
        ctx.scale(scale, scale);
        ctx.fillStyle = "#ffffff";
        ctx.fill(new Path2D(path));
        const tex = new THREE.CanvasTexture(c);
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        tex.needsUpdate = true;
        return tex;
      };

      const M = TECH_ICONS.length;
      const IR = 1.95;
      const spriteMats: import("three").SpriteMaterial[] = [];
      const iconTextures: import("three").Texture[] = [];
      const sprites: import("three").Sprite[] = [];

      TECH_ICONS.forEach((icon, i) => {
        const y = 1 - (i / (M - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = golden * i + 0.6;
        const pos = new THREE.Vector3(
          Math.cos(theta) * r,
          y,
          Math.sin(theta) * r
        ).multiplyScalar(IR);

        const tex = makeIconTexture(icon.path);
        const mat = new THREE.SpriteMaterial({
          map: tex,
          transparent: true,
          depthWrite: false,
          color: icon.accent ? LIME : INK_DARK,
          opacity: 0.97,
        });
        const sprite = new THREE.Sprite(mat);
        sprite.position.copy(pos);
        sprite.scale.setScalar(0.46);
        sprite.userData.accent = icon.accent;
        sprite.userData.phase = i * 0.7;
        sprite.renderOrder = 2;
        group.add(sprite);

        iconTextures.push(tex);
        spriteMats.push(mat);
        sprites.push(sprite);
      });

      /* ---- theme-aware ink ---- */
      const applyTheme = () => {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        const ink = isDark ? INK_DARK : INK_LIGHT;
        baseMat.color.copy(ink);
        lineMat.color.copy(ink);
        spriteMats.forEach((mat, i) => {
          if (!TECH_ICONS[i].accent) mat.color.copy(ink);
        });
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
          group.rotation.y = t * 0.13 + smoothed.x * 0.3;
          group.position.y = Math.sin(t * 0.7) * 0.03;
        } else {
          group.rotation.y = smoothed.x * 0.3;
        }
        group.rotation.x = -0.1 + smoothed.y * 0.2;

        if (!reduce) {
          for (const s of sprites) {
            if (s.userData.accent) {
              const k = 1 + Math.sin(t * 1.8 + s.userData.phase) * 0.1;
              s.scale.setScalar(0.46 * k);
            }
          }
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
        baseGeo.dispose();
        baseMat.dispose();
        accentGeo.dispose();
        accentMat.dispose();
        lineGeo.dispose();
        lineMat.dispose();
        dotTex.dispose();
        for (const tex of iconTextures) tex.dispose();
        for (const mat of spriteMats) mat.dispose();
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
