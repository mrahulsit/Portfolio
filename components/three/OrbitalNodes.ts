import * as THREE from "three";
import { ORBITS, orbitPoint, type OrbitDef } from "./orbits";
import {
  INK,
  PALETTE,
  type ScenePart,
  type SceneTheme,
} from "./sceneTypes";

type NodeKind = "lime" | "ink" | "dim";

type NodeLayout = { kind: NodeKind; cube?: boolean };

const LAYOUTS: NodeLayout[][] = [
  [
    { kind: "lime" },
    { kind: "ink", cube: true },
    { kind: "dim" },
    { kind: "ink" },
    { kind: "lime" },
  ],
  [
    { kind: "ink" },
    { kind: "lime" },
    { kind: "ink", cube: true },
    { kind: "dim" },
  ],
  [
    { kind: "dim" },
    { kind: "ink", cube: true },
    { kind: "lime" },
    { kind: "ink" },
    { kind: "dim" },
  ],
];

type Node = {
  mesh: THREE.Mesh;
  orbit: OrbitDef;
  offset: number;
  spin: number;
  spinSpeed: number;
  kind: NodeKind;
};

function makeHaloTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  gradient.addColorStop(0, "rgba(205,242,43,0.95)");
  gradient.addColorStop(0.42, "rgba(205,242,43,0.32)");
  gradient.addColorStop(1, "rgba(205,242,43,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

export function createOrbitalNodes(): ScenePart {
  const group = new THREE.Group();

  const sphereGeo = new THREE.SphereGeometry(0.04, 18, 18);
  const cubeGeo = new THREE.BoxGeometry(0.058, 0.058, 0.058);

  const limeMat = new THREE.MeshStandardMaterial({
    color: PALETTE.lime,
    emissive: PALETTE.lime,
    emissiveIntensity: 0.85,
    roughness: 0.3,
    metalness: 0.2,
    transparent: true,
    opacity: 0,
  });
  const inkMat = new THREE.MeshStandardMaterial({
    color: INK.dark,
    roughness: 0.35,
    metalness: 0.4,
    transparent: true,
    opacity: 0,
  });
  const dimMat = new THREE.MeshStandardMaterial({
    color: 0x3d4248,
    roughness: 0.5,
    metalness: 0.25,
    transparent: true,
    opacity: 0,
  });

  const haloTexture = makeHaloTexture();
  const haloMat = haloTexture
    ? new THREE.SpriteMaterial({
        map: haloTexture,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    : null;

  const pivots: { pivot: THREE.Group; def: OrbitDef }[] = [];
  const nodes: Node[] = [];

  ORBITS.forEach((def, orbitIndex) => {
    const pivot = new THREE.Group();
    const tilt = new THREE.Group();
    tilt.rotation.set(def.tiltX, 0, def.tiltZ);
    pivot.add(tilt);
    group.add(pivot);
    pivots.push({ pivot, def });

    const layout = LAYOUTS[orbitIndex] ?? LAYOUTS[0];
    layout.forEach((item, index) => {
      const material =
        item.kind === "lime" ? limeMat : item.kind === "ink" ? inkMat : dimMat;
      const mesh = new THREE.Mesh(item.cube ? cubeGeo : sphereGeo, material);
      mesh.scale.setScalar(item.cube ? 1.05 : 1);

      if (item.kind === "lime" && haloMat) {
        const halo = new THREE.Sprite(haloMat);
        halo.scale.setScalar(0.42);
        mesh.add(halo);
      }

      tilt.add(mesh);

      nodes.push({
        mesh,
        orbit: def,
        offset: (index / layout.length) * Math.PI * 2 + orbitIndex * 0.55,
        spin: index * 1.3 + orbitIndex,
        spinSpeed: def.nodeSpeed * 1.6,
        kind: item.kind,
      });
    });
  });

  let theme: SceneTheme = "dark";
  const tmp = new THREE.Vector3();

  return {
    object: group,
    setTheme(next) {
      theme = next;
      const dark = next === "dark";
      inkMat.color.setHex(dark ? INK.dark : INK.light);
      dimMat.color.setHex(dark ? 0x3d4248 : 0xc9c4b9);
    },
    update(ctx) {
      const dark = theme === "dark";
      inkMat.color.setHex(dark ? INK.dark : INK.light);
      dimMat.color.setHex(dark ? 0x3d4248 : 0xc9c4b9);

      const opacity = ctx.entrance;
      limeMat.opacity = opacity;
      inkMat.opacity = opacity;
      dimMat.opacity = opacity;
      if (haloMat) {
        haloMat.opacity = 0.42 * opacity * (0.75 + ctx.hover * 0.6);
      }
      limeMat.emissiveIntensity =
        0.75 + ctx.hover * 0.55 + Math.sin(ctx.elapsed * 1.7) * 0.1;

      pivots.forEach(({ pivot, def }) => {
        if (!ctx.reduce) pivot.rotation.y = ctx.elapsed * def.precession;
      });

      nodes.forEach((node) => {
        const angle = ctx.reduce
          ? node.orbit.phase + node.offset
          : node.orbit.phase + ctx.elapsed * node.orbit.nodeSpeed + node.offset;
        orbitPoint(tmp, node.orbit.rx, node.orbit.ry, angle);
        node.mesh.position.copy(tmp);

        if (!ctx.reduce) {
          node.mesh.rotation.x = ctx.elapsed * node.spinSpeed + node.spin;
          node.mesh.rotation.y = ctx.elapsed * node.spinSpeed * 0.7 + node.spin;
        }
      });

      const pulse = 1 + Math.sin(ctx.elapsed * 1.6) * 0.06 * (0.4 + ctx.hover);
      nodes.forEach((node) => {
        const base = node.mesh.geometry === cubeGeo ? 1.05 : 1;
        const scale = base * (0.72 + 0.28 * opacity) * (node.kind === "lime" ? pulse : 1);
        node.mesh.scale.setScalar(scale);
      });
    },
    dispose() {
      sphereGeo.dispose();
      cubeGeo.dispose();
      limeMat.dispose();
      inkMat.dispose();
      dimMat.dispose();
      haloTexture?.dispose();
      haloMat?.dispose();
    },
  };
}
