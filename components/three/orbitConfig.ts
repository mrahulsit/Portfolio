export type SatelliteColor = "lime" | "ivory";

export type SatelliteSpec = {
  size: number;
  color: SatelliteColor;
  speed: number;
  phase: number;
  orbitScale: number;
};

export type OrbitConfig = {
  rx: number;
  ry: number;
  thickness: number;
  tilt: [number, number, number];
  spin: number;
  phase: number;
  limeArc?: { start: number; span: number };
  satellites: SatelliteSpec[];
};

export const ORBITS: OrbitConfig[] = [
  {
    rx: 2.02,
    ry: 1.82,
    thickness: 0.012,
    tilt: [1.06, 0.24, 0.38],
    spin: 0.12,
    phase: 0,
    limeArc: { start: 0.18, span: 0.16 },
    satellites: [
      { size: 0.058, color: "lime", speed: 0.42, phase: 1.4, orbitScale: 1 },
      { size: 0.038, color: "ivory", speed: 0.5, phase: 3.9, orbitScale: 1.02 },
    ],
  },
  {
    rx: 1.72,
    ry: 1.7,
    thickness: 0.016,
    tilt: [1.48, -0.34, -0.62],
    spin: -0.09,
    phase: 1.2,
    limeArc: { start: 0.58, span: 0.2 },
    satellites: [
      { size: 0.072, color: "ivory", speed: -0.28, phase: 0.5, orbitScale: 1.04 },
    ],
  },
  {
    rx: 2.18,
    ry: 1.96,
    thickness: 0.009,
    tilt: [1.33, 0.65, 0.12],
    spin: 0.06,
    phase: 2.4,
    limeArc: { start: 0.82, span: 0.12 },
    satellites: [
      { size: 0.046, color: "lime", speed: 0.2, phase: 5.1, orbitScale: 1 },
      { size: 0.052, color: "ivory", speed: 0.16, phase: 2.6, orbitScale: 1.02 },
    ],
  },
];
