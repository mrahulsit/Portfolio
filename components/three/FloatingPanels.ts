import * as THREE from "three";
import {
  PALETTE,
  clamp01,
  easeOutCubic,
  type ScenePart,
  type SceneTheme,
} from "./sceneTypes";

type PanelTint = "midnight" | "lime" | "ivory";

type PanelSpec = {
  baseY: number;
  baseX: number;
  rotY: number;
  rotZ: number;
  spread: number;
  opacity: number;
  tint: PanelTint;
  delay: number;
  edgeOpacity: number;
  grid?: boolean;
};

const SPECS: PanelSpec[] = [
  {
    baseY: 1.34,
    baseX: -0.05,
    rotY: -0.2,
    rotZ: 0.035,
    spread: 1.05,
    opacity: 0.94,
    tint: "midnight",
    delay: 0.32,
    edgeOpacity: 0.24,
    grid: true,
  },
  {
    baseY: 0,
    baseX: 0,
    rotY: 0,
    rotZ: 0,
    spread: 0,
    opacity: 0.56,
    tint: "lime",
    delay: 0.16,
    edgeOpacity: 0.16,
  },
  {
    baseY: -1.34,
    baseX: 0.05,
    rotY: 0.2,
    rotZ: -0.035,
    spread: -1.05,
    opacity: 0.9,
    tint: "ivory",
    delay: 0,
    edgeOpacity: 0.18,
  },
];

type Panel = {
  mesh: THREE.Mesh;
  spec: PanelSpec;
  material: THREE.MeshPhysicalMaterial;
  edgeMat: THREE.LineBasicMaterial;
  gridMat: THREE.MeshBasicMaterial | null;
};

function roundedRect(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function makeGridTexture() {
  const width = 512;
  const height = 224;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const radius = 30;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(width - radius, 0);
  ctx.quadraticCurveTo(width, 0, width, radius);
  ctx.lineTo(width, height - radius);
  ctx.quadraticCurveTo(width, height, width - radius, height);
  ctx.lineTo(radius, height);
  ctx.quadraticCurveTo(0, height, 0, height - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.clip();

  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 1.4;
  const step = 32;
  ctx.beginPath();
  for (let x = 0; x <= width; x += step) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = 0; y <= height; y += step) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

function makeMaterial(tint: PanelTint) {
  if (tint === "lime") {
    return new THREE.MeshPhysicalMaterial({
      color: PALETTE.lime,
      emissive: PALETTE.lime,
      emissiveIntensity: 0.45,
      roughness: 0.36,
      metalness: 0.05,
      clearcoat: 0.6,
      clearcoatRoughness: 0.3,
      transparent: true,
      opacity: 0,
    });
  }
  if (tint === "ivory") {
    return new THREE.MeshPhysicalMaterial({
      color: PALETTE.ivory,
      roughness: 0.5,
      metalness: 0.05,
      clearcoat: 0.5,
      clearcoatRoughness: 0.35,
      transparent: true,
      opacity: 0,
    });
  }
  return new THREE.MeshPhysicalMaterial({
    color: PALETTE.midnight,
    roughness: 0.5,
    metalness: 0.42,
    clearcoat: 0.55,
    clearcoatRoughness: 0.4,
    transparent: true,
    opacity: 0,
  });
}

export function createFloatingPanels(): ScenePart {
  const group = new THREE.Group();

  const geometry = new THREE.ExtrudeGeometry(roundedRect(2.4, 1.05, 0.14), {
    depth: 0.09,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 3,
    curveSegments: 14,
  });
  geometry.translate(0, 0, -0.045);
  const edgeGeometry = new THREE.EdgesGeometry(geometry, 30);
  const gridTexture = makeGridTexture();

  const panels: Panel[] = SPECS.map((spec) => {
    const material = makeMaterial(spec.tint);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(spec.baseX, spec.baseY, 0);
    mesh.rotation.set(0, spec.rotY, spec.rotZ);

    const edgeMat = new THREE.LineBasicMaterial({
      color: spec.tint === "midnight" ? PALETTE.ivory : PALETTE.midnight,
      transparent: true,
      opacity: 0,
    });
    mesh.add(new THREE.LineSegments(edgeGeometry, edgeMat));

    let gridMat: THREE.MeshBasicMaterial | null = null;
    if (spec.grid && gridTexture) {
      gridMat = new THREE.MeshBasicMaterial({
        map: gridTexture,
        color: PALETTE.ivory,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const grid = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.0), gridMat);
      grid.position.z = 0.065;
      mesh.add(grid);
    }

    group.add(mesh);
    return { mesh, spec, material, edgeMat, gridMat };
  });

  let limeBase = 0.48;

  return {
    object: group,
    setTheme(theme: SceneTheme) {
      limeBase = theme === "dark" ? 0.5 : 0.32;
    },
    update(ctx) {
      panels.forEach((panel, index) => {
        const { spec, mesh, material, edgeMat, gridMat } = panel;
        const raw = ctx.reduce
          ? 1
          : clamp01((ctx.elapsed - spec.delay) / 1);
        const entrance = easeOutCubic(raw);

        mesh.position.y = spec.baseY + (1 - entrance) * spec.spread;
        if (!ctx.reduce) {
          mesh.position.y +=
            Math.sin(ctx.elapsed * 0.75 + index * 1.6) * 0.012 * entrance;
        }
        mesh.rotation.y =
          spec.rotY +
          (1 - entrance) * (spec.rotY < 0 ? -0.5 : spec.rotY > 0 ? 0.5 : 0);
        mesh.rotation.z = spec.rotZ;

        material.opacity = spec.opacity * entrance;
        if (spec.tint === "lime") {
          material.emissiveIntensity =
            limeBase + ctx.hover * 0.35 + Math.sin(ctx.elapsed * 1.3) * 0.04;
        }
        edgeMat.opacity = spec.edgeOpacity * entrance;
        if (gridMat) gridMat.opacity = 0.18 * entrance;
      });
    },
    dispose() {
      geometry.dispose();
      edgeGeometry.dispose();
      gridTexture?.dispose();
      panels.forEach((panel) => {
        panel.material.dispose();
        panel.edgeMat.dispose();
        panel.gridMat?.dispose();
        panel.mesh.children.forEach((child) => {
          if (child instanceof THREE.Mesh) child.geometry.dispose();
        });
      });
    },
  };
}
