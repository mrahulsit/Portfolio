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
    rx: 2.46,
    ry: 2.12,
    thickness: 0.008,
    tilt: [1.04, 0.3, 0.16],
    spin: 0.08,
    phase: 0,
    satellites: [
      { size: 0.075, color: "lime", speed: 0.34, phase: 1.6, orbitScale: 1 },
      { size: 0.044, color: "ivory", speed: 0.46, phase: 3.7, orbitScale: 1.03 },
    ],
  },
  {
    rx: 2.16,
    ry: 1.96,
    thickness: 0.006,
    tilt: [0.66, -0.48, -0.38],
    spin: -0.055,
    phase: 1.1,
    limeArc: { start: 0.52, span: 0.16 },
    satellites: [
      { size: 0.058, color: "ivory", speed: -0.26, phase: 0.4, orbitScale: 1.05 },
    ],
  },
];
