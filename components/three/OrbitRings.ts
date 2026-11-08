import * as THREE from "three";
import { ORBITS, ellipsePoints, type OrbitDef } from "./orbits";
import {
  INK,
  PALETTE,
  type ScenePart,
  type SceneTheme,
} from "./sceneTypes";

type Ring = {
  pivot: THREE.Group;
  tilt: THREE.Group;
  def: OrbitDef;
  lineMat: THREE.MeshBasicMaterial;
  limeMat: THREE.MeshBasicMaterial | null;
};

export function createOrbitRings(): ScenePart {
  const group = new THREE.Group();
  const rings: Ring[] = [];

  ORBITS.forEach((def) => {
    const pivot = new THREE.Group();
    const tilt = new THREE.Group();
    tilt.rotation.set(def.tiltX, 0, def.tiltZ);
    pivot.add(tilt);
    group.add(pivot);

    const lineMat = new THREE.MeshBasicMaterial({
      color: PALETTE.ivory,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const points = ellipsePoints(def.rx, def.ry, 0, Math.PI * 2, 160);
    const curve = new THREE.CatmullRomCurve3(points.slice(0, -1), true);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 220, 0.0055, 6, true),
      lineMat
    );
    tilt.add(tube);

    let limeMat: THREE.MeshBasicMaterial | null = null;
    if (def.lime) {
      const start = def.lime.start * Math.PI * 2;
      const end = (def.lime.start + def.lime.span) * Math.PI * 2;
      const arcPoints = ellipsePoints(def.rx, def.ry, start, end, 60);
      const arcCurve = new THREE.CatmullRomCurve3(arcPoints, false);
      limeMat = new THREE.MeshBasicMaterial({
        color: PALETTE.lime,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const arc = new THREE.Mesh(
        new THREE.TubeGeometry(arcCurve, 80, 0.0075, 6, false),
        limeMat
      );
      tilt.add(arc);
    }

    rings.push({ pivot, tilt, def, lineMat, limeMat });
  });

  let theme: SceneTheme = "dark";

  return {
    object: group,
    setTheme(next) {
      theme = next;
    },
    update(ctx) {
      const dark = theme === "dark";
      rings.forEach((ring) => {
        if (!ctx.reduce) {
          ring.pivot.rotation.y = ctx.elapsed * ring.def.precession;
        }
        ring.lineMat.color.setHex(dark ? PALETTE.ivory : INK.light);
        ring.lineMat.opacity = (dark ? 0.22 : 0.16) * ctx.entrance;
        if (ring.limeMat) {
          ring.limeMat.opacity =
            0.55 * ctx.entrance * (0.72 + ctx.hover * 0.4);
        }
      });
    },
    dispose() {
      rings.forEach((ring) => {
        ring.tilt.traverse((child) => {
          if (child instanceof THREE.Mesh) child.geometry.dispose();
        });
        ring.lineMat.dispose();
        ring.limeMat?.dispose();
      });
    },
  };
}
