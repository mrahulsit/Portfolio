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
  /**
   * Screen-plane angle (radians) applied after the tilt. Tilt alone always
   * leaves an ellipse with a horizontal long axis; roll turns it diagonal.
   */
  roll: number;
  spin: number;
  phase: number;
  limeArc?: { start: number; span: number };
  satellites: SatelliteSpec[];
};

/**
 * Three near edge-on rings in an atom-like arrangement, all centred on the
 * sphere:
 *  - one level ring straight through the middle,
 *  - one rising from left-middle to the right,
 *  - one rising from right-middle to the left.
 * Rings are circular (rx ≈ ry) so their on-screen shape comes from the tilt,
 * which keeps the three readings consistent.
 */
export const ORBITS: OrbitConfig[] = [
  {
    // Through the middle.
    rx: 2.44,
    ry: 2.44,
    thickness: 0.009,
    tilt: [1.36, 0, 0],
    roll: 0,
    spin: 0.08,
    phase: 0,
    satellites: [
      { size: 0.062, color: "lime", speed: 0.34, phase: 1.6, orbitScale: 1 },
      { size: 0.04, color: "ivory", speed: 0.46, phase: 3.7, orbitScale: 1.03 },
    ],
  },
  {
    // Left-middle up to the right.
    rx: 2.3,
    ry: 2.3,
    thickness: 0.007,
    tilt: [1.26, 0, 0],
    roll: 0.52,
    spin: -0.055,
    phase: 1.1,
    limeArc: { start: 0.52, span: 0.16 },
    satellites: [
      { size: 0.048, color: "ivory", speed: -0.26, phase: 0.4, orbitScale: 1.04 },
    ],
  },
  {
    // Right-middle up to the left.
    rx: 2.36,
    ry: 2.36,
    thickness: 0.007,
    tilt: [1.26, 0, 0],
    roll: -0.52,
    spin: 0.045,
    phase: 2.4,
    limeArc: { start: 0.08, span: 0.12 },
    satellites: [
      { size: 0.046, color: "lime", speed: -0.22, phase: 2.2, orbitScale: 1 },
    ],
  },
];
