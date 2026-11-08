"use client";

import { useEffect, useRef } from "react";

type PanelCfg = {
  baseY: number;
  baseX: number;
  rotY: number;
  rotZ: number;
  spread: number;
  opacity: number;
  tint: "midnight" | "lime" | "ivory";
};

const PANELS: PanelCfg[] = [
  { baseY: 1.34, baseX: -0.05, rotY: -0.2, rotZ: 0.035, spread: 0.95, opacity: 1, tint: "midnight" },
  { baseY: 0, baseX: 0, rotY: 0, rotZ: 0, spread: 0, opacity: 0.62, tint: "lime" },
  { baseY: -1.34, baseX: 0.05, rotY: 0.2, rotZ: -0.035, spread: -0.95, opacity: 0.9, tint: "ivory" },
];

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

      /* ---------- renderer ---------- */
      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      const canvas = renderer.domElement;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      mount.appendChild(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0, 7);
      camera.lookAt(0, 0, 0);

      /* ---------- lighting ---------- */
      const ambient = new THREE.AmbientLight(0xffffff, 0.85);
      scene.add(ambient);
      const key = new THREE.DirectionalLight(0xffffff, 1.5);
      key.position.set(3.5, 5, 6);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xcdf22b, 0.6);
      rim.position.set(-5, -3, -4);
      scene.add(rim);

      /* ---------- palette ---------- */
      const INK_DARK = new THREE.Color(0xf2f0ea);
      const INK_LIGHT = new THREE.Color(0x0a0b0d);
      const LIME = new THREE.Color(0xcdf22b);

      const makeRoundedRect = (w: number, h: number, r: number) => {
        const s = new THREE.Shape();
        const x = -w / 2;
        const y = -h / 2;
        s.moveTo(x + r, y);
        s.lineTo(x + w - r, y);
        s.quadraticCurveTo(x + w, y, x + w, y + r);
        s.lineTo(x + w, y + h - r);
        s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        s.lineTo(x + r, y + h);
        s.quadraticCurveTo(x, y + h, x, y + h - r);
        s.lineTo(x, y + r);
        s.quadraticCurveTo(x, y, x + r, y);
        return s;
      };

      const panelGeo = new THREE.ExtrudeGeometry(makeRoundedRect(2.4, 1.05, 0.14), {
        depth: 0.09,
        bevelEnabled: true,
        bevelThickness: 0.012,
        bevelSize: 0.012,
        bevelSegments: 3,
        curveSegments: 14,
      });
      panelGeo.translate(0, 0, -0.045);

      const edgeGeo = new THREE.EdgesGeometry(panelGeo, 30);
      const edgeMat = new THREE.LineBasicMaterial({
        transparent: true,
        opacity: 0.2,
      });

      const midnightMat = new THREE.MeshPhysicalMaterial({
        color: 0x0b0c0e,
        roughness: 0.55,
        metalness: 0.35,
        clearcoat: 0.4,
        clearcoatRoughness: 0.45,
        transparent: true,
        opacity: 1,
      });
      const limeMat = new THREE.MeshPhysicalMaterial({
        color: 0xcdf22b,
        emissive: 0xcdf22b,
        emissiveIntensity: 0.45,
        roughness: 0.38,
        metalness: 0.05,
        clearcoat: 0.6,
        clearcoatRoughness: 0.3,
        transparent: true,
        opacity: 0.62,
      });
      const ivoryMat = new THREE.MeshPhysicalMaterial({
        color: 0xfaf8f3,
        roughness: 0.5,
        metalness: 0.05,
        clearcoat: 0.5,
        clearcoatRoughness: 0.35,
        transparent: true,
        opacity: 0.9,
      });

      const matFor = (tint: PanelCfg["tint"]) =>
        tint === "midnight" ? midnightMat : tint === "lime" ? limeMat : ivoryMat;

      /* ---------- structure ---------- */
      const model = new THREE.Group();
      model.rotation.set(-0.16, 0.34, 0);
      scene.add(model);

      const panels: import("three").Mesh[] = [];
      PANELS.forEach((cfg) => {
        const mesh = new THREE.Mesh(panelGeo, matFor(cfg.tint));
        mesh.position.set(cfg.baseX, cfg.baseY, 0);
        mesh.rotation.y = cfg.rotY;
        mesh.rotation.z = cfg.rotZ;
        mesh.userData = { ...cfg };
        panels.push(mesh);
        model.add(mesh);

        const edges = new THREE.LineSegments(edgeGeo, edgeMat);
        mesh.add(edges);
      });

      /* ---------- connector rails + nodes ---------- */
      const railMat = new THREE.MeshBasicMaterial({
        color: LIME,
        transparent: true,
        opacity: 0.4,
      });
      const railGeo = new THREE.CylinderGeometry(0.008, 0.008, 3.95, 8);
      const railXs = [-1.34, 1.34];
      const rails: import("three").Mesh[] = [];
      railXs.forEach((x) => {
        const rail = new THREE.Mesh(railGeo, railMat);
        rail.position.set(x, 0, 0);
        rails.push(rail);
        model.add(rail);
      });

      const nodeGeo = new THREE.SphereGeometry(0.05, 16, 16);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: LIME,
        emissive: LIME,
        emissiveIntensity: 0.9,
        roughness: 0.3,
        metalness: 0.2,
        transparent: true,
        opacity: 1,
      });
      const nodes: import("three").Mesh[] = [];
      for (const x of railXs) {
        for (const y of [-0.67, 0.67]) {
          const node = new THREE.Mesh(nodeGeo, nodeMat);
          node.position.set(x, y, 0);
          nodes.push(node);
          model.add(node);
        }
      }

      /* soft halo for each node */
      const haloCanvas = document.createElement("canvas");
      haloCanvas.width = haloCanvas.height = 64;
      {
        const ctx = haloCanvas.getContext("2d")!;
        const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0, "rgba(205,242,43,0.9)");
        g.addColorStop(0.4, "rgba(205,242,43,0.35)");
        g.addColorStop(1, "rgba(205,242,43,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 64, 64);
      }
      const haloTex = new THREE.CanvasTexture(haloCanvas);
      const haloMat = new THREE.SpriteMaterial({
        map: haloTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
      });
      const haloes: import("three").Sprite[] = [];
      nodes.forEach((n) => {
        const halo = new THREE.Sprite(haloMat);
        halo.position.copy(n.position);
        halo.scale.setScalar(0.5);
        haloes.push(halo);
        model.add(halo);
      });

      /* ---------- orbit rings ---------- */
      const ringMat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.24,
        side: THREE.DoubleSide,
      });
      type Ring = {
        pivot: import("three").Group;
        sphere: import("three").Mesh;
        radius: number;
        speed: number;
        phase: number;
        baseZ: number;
      };
      const rings: Ring[] = [];
      const ringSpecs = [
        { r: 1.85, tiltX: Math.PI / 2.3, tiltZ: 0.18, speed: 0.42, phase: 0.4, accent: true },
        { r: 2.1, tiltX: Math.PI / 1.9, tiltZ: -0.5, speed: -0.3, phase: 2.1, accent: false },
        { r: 2.32, tiltX: Math.PI / 2.6, tiltZ: 0.9, speed: 0.22, phase: 4.2, accent: true },
      ];
      const orbitGeo = new THREE.SphereGeometry(0.035, 12, 12);
      const orbitLimeMat = new THREE.MeshBasicMaterial({ color: LIME, transparent: true });
      const orbitInkMat = new THREE.MeshBasicMaterial({ color: INK_DARK, transparent: true });

      ringSpecs.forEach((spec) => {
        const pivot = new THREE.Group();
        pivot.rotation.set(spec.tiltX, 0, spec.tiltZ);

        const torus = new THREE.Mesh(
          new THREE.TorusGeometry(spec.r, 0.006, 6, 160),
          ringMat
        );
        pivot.add(torus);

        const sphere = new THREE.Mesh(
          orbitGeo,
          spec.accent ? orbitLimeMat : orbitInkMat
        );
        sphere.scale.setScalar(spec.accent ? 1.3 : 1);
        pivot.add(sphere);

        model.add(pivot);
        rings.push({
          pivot,
          sphere,
          radius: spec.r,
          speed: spec.speed,
          phase: spec.phase,
          baseZ: spec.tiltZ,
        });
      });

      /* ---------- tiny floating geometry ---------- */
      const floatMat = new THREE.MeshStandardMaterial({
        color: INK_DARK,
        roughness: 0.35,
        metalness: 0.4,
        transparent: true,
        opacity: 1,
      });
      const floatLimeMat = new THREE.MeshStandardMaterial({
        color: LIME,
        emissive: LIME,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.2,
        transparent: true,
      });
      const floaters: import("three").Mesh[] = [];
      const floaterSpecs = [
        { geo: new THREE.IcosahedronGeometry(0.075, 0), pos: [1.95, 1.45, 0.5], mat: floatLimeMat },
        { geo: new THREE.TetrahedronGeometry(0.07), pos: [-1.9, -1.4, 0.6], mat: floatMat },
        { geo: new THREE.OctahedronGeometry(0.06), pos: [1.7, -1.7, -0.4], mat: floatMat },
      ];
      floaterSpecs.forEach((spec, i) => {
        const mesh = new THREE.Mesh(spec.geo, spec.mat);
        mesh.position.set(spec.pos[0], spec.pos[1], spec.pos[2]);
        mesh.userData.phase = i * 1.7;
        mesh.userData.baseY = spec.pos[1];
        floaters.push(mesh);
        model.add(mesh);
      });

      /* ---------- theme ---------- */
      let limeBase = 0.45;
      const applyTheme = () => {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        const ink = isDark ? INK_DARK : INK_LIGHT;
        edgeMat.color.copy(ink);
        ringMat.color.copy(ink);
        orbitInkMat.color.copy(ink);
        floatMat.color.copy(ink);
        ambient.intensity = isDark ? 0.75 : 0.9;
        key.intensity = isDark ? 1.55 : 1.35;
        limeBase = isDark ? 0.5 : 0.32;
        limeMat.emissiveIntensity = limeBase;
      };
      applyTheme();
      const themeObserver = new MutationObserver(applyTheme);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });

      /* ---------- sizing ---------- */
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

      /* ---------- pointer ---------- */
      const target = { x: 0, y: 0 };
      const smoothed = { x: 0, y: 0 };
      let hoverTarget = 0;
      let hover = 0;
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      const onPointerMove = (e: PointerEvent) => {
        const r = mount.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const nx = (e.clientX - r.left) / r.width;
        const ny = (e.clientY - r.top) / r.height;
        target.x = clamp((nx - 0.5) * 2);
        target.y = clamp((ny - 0.5) * 2);
        hoverTarget = nx > -0.05 && nx < 1.05 && ny > -0.05 && ny < 1.05 ? 1 : 0;
      };
      const onPointerLeave = () => {
        target.x = 0;
        target.y = 0;
        hoverTarget = 0;
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave);
      window.addEventListener("blur", onPointerLeave);

      /* ---------- offscreen pause ---------- */
      let visible = true;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(mount);

      /* ---------- loop ---------- */
      const clock = new THREE.Clock();
      const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
      const start = clock.getElapsedTime();
      let raf = 0;

      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible) return;

        const t = clock.getElapsedTime();
        const elapsed = t - start;
        const prog = reduce ? 1 : Math.min(1, elapsed / 1.5);
        const e = easeOut(prog);

        hover += (hoverTarget - hover) * 0.08;
        smoothed.x += (target.x - smoothed.x) * 0.06;
        smoothed.y += (target.y - smoothed.y) * 0.06;

        const scroll = Math.min(1, (window.scrollY || 0) / 700);

        if (!reduce) {
          model.rotation.x = -0.16 + smoothed.y * 0.12 + Math.sin(t * 0.2) * 0.015;
          model.rotation.y =
            0.34 + smoothed.x * 0.2 + Math.sin(t * 0.13) * 0.05 + scroll * 0.25;
        } else {
          model.rotation.x = -0.16;
          model.rotation.y = 0.34;
        }

        /* assemble / settle */
        panels.forEach((p, i) => {
          const ud = p.userData as PanelCfg;
          p.position.y = ud.baseY + (1 - e) * ud.spread;
          p.position.x = ud.baseX * e;
          p.rotation.y = ud.rotY + (1 - e) * (ud.rotY < 0 ? -0.5 : ud.rotY > 0 ? 0.5 : 0);
          p.rotation.z = ud.rotZ;
          if (!reduce) p.position.y += Math.sin(t * 0.8 + i * 1.3) * 0.014 * e;
          (p.material as import("three").MeshPhysicalMaterial).opacity = ud.opacity * e;
        });

        edgeMat.opacity = 0.2 * e;
        railMat.opacity = 0.4 * e;
        nodeMat.opacity = e;
        haloMat.opacity = 0.42 * (0.7 + hover * 0.6) * e;
        orbitLimeMat.opacity = e;
        orbitInkMat.opacity = e;
        ringMat.opacity = 0.24 * e;
        floatMat.opacity = e;
        floatLimeMat.opacity = e;

        nodeMat.emissiveIntensity = 0.7 + hover * 0.8 + Math.sin(t * 1.7) * 0.12;
        limeMat.emissiveIntensity = limeBase + hover * 0.35 + Math.sin(t * 1.3) * 0.05;

        rings.forEach((r) => {
          const a = reduce ? r.phase : t * r.speed + r.phase;
          r.sphere.position.set(Math.cos(a) * r.radius, Math.sin(a) * r.radius, 0);
          r.pivot.rotation.z = reduce
            ? r.baseZ
            : r.baseZ + Math.sin(t * 0.2 + r.phase) * 0.06;
        });

        floaters.forEach((f) => {
          if (reduce) return;
          const ph = f.userData.phase as number;
          f.rotation.x = t * 0.25 + ph;
          f.rotation.y = t * 0.35 + ph;
          f.position.y = (f.userData.baseY as number) + Math.sin(t * 0.8 + ph) * 0.05;
        });

        renderer.render(scene, camera);
      };
      loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        resizeObserver.disconnect();
        themeObserver.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerleave", onPointerLeave);
        window.removeEventListener("blur", onPointerLeave);
        panelGeo.dispose();
        edgeGeo.dispose();
        edgeMat.dispose();
        midnightMat.dispose();
        limeMat.dispose();
        ivoryMat.dispose();
        railGeo.dispose();
        railMat.dispose();
        nodeGeo.dispose();
        nodeMat.dispose();
        haloTex.dispose();
        haloMat.dispose();
        ringMat.dispose();
        orbitGeo.dispose();
        orbitLimeMat.dispose();
        orbitInkMat.dispose();
        rings.forEach((r) => {
          (r.pivot.children[0] as import("three").Mesh).geometry.dispose();
        });
        floaters.forEach((f) => f.geometry.dispose());
        floatMat.dispose();
        floatLimeMat.dispose();
        renderer.dispose();
        if (canvas.parentNode === mount) mount.removeChild(canvas);
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
          maskImage: "radial-gradient(circle at 50% 50%, #000 35%, transparent 74%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 35%, transparent 74%)",
        }}
      />
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  );
}
