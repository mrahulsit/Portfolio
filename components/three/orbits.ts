import * as THREE from "three";

export type OrbitDef = {
  rx: number;
  ry: number;
  tiltX: number;
  tiltZ: number;
  precession: number;
  nodeSpeed: number;
  phase: number;
  lime?: { start: number; span: number };
};

export const ORBITS: OrbitDef[] = [
  {
    rx: 1.92,
    ry: 0.6,
    tiltX: Math.PI / 2.55,
    tiltZ: 0.16,
    precession: 0.05,
    nodeSpeed: 0.3,
    phase: 0.4,
    lime: { start: 0.12, span: 0.3 },
  },
  {
    rx: 2.16,
    ry: 0.76,
    tiltX: Math.PI / 2.05,
    tiltZ: -0.44,
    precession: -0.034,
    nodeSpeed: -0.22,
    phase: 2.4,
  },
  {
    rx: 2.42,
    ry: 0.68,
    tiltX: Math.PI / 2.85,
    tiltZ: 0.82,
    precession: 0.026,
    nodeSpeed: 0.17,
    phase: 4.3,
    lime: { start: 0.56, span: 0.24 },
  },
];

export function ellipsePoints(
  rx: number,
  ry: number,
  start = 0,
  end = Math.PI * 2,
  segments = 160
): THREE.Vector3[] {
  const span = end - start;
  const count = Math.max(
    2,
    Math.round((segments * Math.abs(span)) / (Math.PI * 2))
  );
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= count; i += 1) {
    const a = start + (span * i) / count;
    points.push(new THREE.Vector3(Math.cos(a) * rx, Math.sin(a) * ry, 0));
  }
  return points;
}

export function orbitPoint(
  target: THREE.Vector3,
  rx: number,
  ry: number,
  angle: number
): THREE.Vector3 {
  return target.set(Math.cos(angle) * rx, Math.sin(angle) * ry, 0);
}
