import * as THREE from "three";

export const SPHERE_RADIUS = 1.8;
export const CIRCUIT_RADIUS = SPHERE_RADIUS + 0.009;
export const CIRCUIT_TUBE_RADIUS = 0.0048;
export const NODE_RADIUS = SPHERE_RADIUS + 0.0105;

export type CircuitNode = {
  position: THREE.Vector3;
  /** Orients a flat pad so it lies tangent to the sphere surface. */
  quaternion: THREE.Quaternion;
  lime: boolean;
  size: number;
  /** End-of-route pads are drawn as vias (ring + core). */
  terminal: boolean;
};

export type PulseSpec = {
  /** Curve-parameter units per second; negative runs the route backwards. */
  speed: number;
  offset: number;
};

export type CircuitPath = {
  curve: THREE.Curve<THREE.Vector3>;
  highlights: THREE.Curve<THREE.Vector3>[];
  nodes: CircuitNode[];
  pulses: PulseSpec[];
  /** Closed loops wrap the whole sphere; pulses circulate without fading. */
  closed: boolean;
  /** World-space arc length, used to keep pulse trails a constant size. */
  length: number;
};

type LatLon = readonly [lat: number, lon: number];

type CircuitDefinition = {
  points: readonly LatLon[];
  nodeIndexes: readonly number[];
  highlights?: readonly (readonly [start: number, end: number])[];
  pulses?: readonly PulseSpec[];
  closed?: boolean;
};

/** Corner cut (degrees) for the 45° PCB-style chamfer at each bend. */
const CHAMFER_DEG = 3.4;
/** Max angular step (degrees) when densifying a straight run. */
const DENSIFY_STEP_DEG = 1.2;

const Z_AXIS = new THREE.Vector3(0, 0, 1);

function toUnitSphere([lat, lon]: LatLon) {
  const phi = THREE.MathUtils.degToRad(lat);
  const theta = THREE.MathUtils.degToRad(lon);
  const cosPhi = Math.cos(phi);

  return new THREE.Vector3(
    cosPhi * Math.cos(theta),
    Math.sin(phi),
    cosPhi * Math.sin(theta),
  );
}

function moveTowards(from: LatLon, to: LatLon, distance: number): LatLon {
  const dLat = to[0] - from[0];
  const dLon = to[1] - from[1];
  const length = Math.hypot(dLat, dLon) || 1;
  return [from[0] + (dLat / length) * distance, from[1] + (dLon / length) * distance];
}

/**
 * Turns a right-angle lat/lon route into a PCB-style trace: every interior
 * corner is replaced by a short 45° chamfer. Also returns, for each input
 * point, the anchor that actually lies on the chamfered trace (used to place
 * pads so they sit exactly on the line).
 */
function chamferRoute(points: readonly LatLon[]) {
  const route: LatLon[] = [points[0]];
  const anchors: LatLon[] = [points[0]];

  for (let i = 1; i < points.length - 1; i += 1) {
    const prev = points[i - 1];
    const corner = points[i];
    const next = points[i + 1];
    const cutIn = Math.min(CHAMFER_DEG, Math.hypot(corner[0] - prev[0], corner[1] - prev[1]) * 0.4);
    const cutOut = Math.min(CHAMFER_DEG, Math.hypot(next[0] - corner[0], next[1] - corner[1]) * 0.4);
    const a = moveTowards(corner, prev, cutIn);
    const b = moveTowards(corner, next, cutOut);
    route.push(a, b);
    anchors.push([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]);
  }

  route.push(points[points.length - 1]);
  anchors.push(points[points.length - 1]);
  return { route, anchors };
}

/**
 * Builds a piecewise-linear source path. Runs are densified in lat/lon space so
 * horizontal runs follow true parallels; straight chords then get re-projected
 * onto the sphere by SphericalSurfaceCurve, keeping corners crisp.
 */
function buildSourceCurve(route: readonly LatLon[]) {
  const path = new THREE.CurvePath<THREE.Vector3>();
  let previous = toUnitSphere(route[0]);

  for (let i = 1; i < route.length; i += 1) {
    const from = route[i - 1];
    const to = route[i];
    const steps = Math.max(
      1,
      Math.ceil(Math.hypot(to[0] - from[0], to[1] - from[1]) / DENSIFY_STEP_DEG),
    );
    for (let s = 1; s <= steps; s += 1) {
      const t = s / steps;
      const point = toUnitSphere([
        from[0] + (to[0] - from[0]) * t,
        from[1] + (to[1] - from[1]) * t,
      ]);
      path.add(new THREE.LineCurve3(previous, point));
      previous = point;
    }
  }

  return path;
}

/**
 * A Curve wrapper which re-projects every sampled point onto the sphere so
 * straight chords between surface points never dip inside the opaque sphere.
 */
class SphericalSurfaceCurve extends THREE.Curve<THREE.Vector3> {
  constructor(
    private readonly source: THREE.Curve<THREE.Vector3>,
    private readonly start = 0,
    private readonly end = 1,
    private readonly radius = CIRCUIT_RADIUS,
  ) {
    super();
    this.arcLengthDivisions = 1200;
  }

  getPoint(t: number, target = new THREE.Vector3()) {
    const sourceT = THREE.MathUtils.lerp(
      this.start,
      this.end,
      THREE.MathUtils.clamp(t, 0, 1),
    );

    this.source.getPointAt(sourceT, target);
    return target.normalize().multiplyScalar(this.radius);
  }
}

function buildNodes(
  anchors: readonly LatLon[],
  indexes: readonly number[],
): CircuitNode[] {
  const last = anchors.length - 1;
  return indexes.map((pointIndex, nodeIndex) => {
    const normal = toUnitSphere(anchors[pointIndex]);
    const terminal = pointIndex === 0 || pointIndex === last;
    const lime = nodeIndex % 2 === 0;
    return {
      position: normal.clone().multiplyScalar(NODE_RADIUS),
      quaternion: new THREE.Quaternion().setFromUnitVectors(Z_AXIS, normal),
      lime,
      terminal,
      size: terminal ? (lime ? 0.024 : 0.02) : lime ? 0.015 : 0.012,
    };
  });
}


/* -------------------------------------------------------------------------- */
/*  Network layout                                                            */
/* -------------------------------------------------------------------------- */

/**
 * The network is three closed "bus" loops that wrap 360° around the sphere,
 * stepping up/down in latitude PCB-style, plus connectors bridging
 * neighbouring buses and stubs running toward the poles. Because the buses
 * are closed, data pulses circulate continuously: across the front, over the
 * silhouette, around the back and into view again.
 *
 * The camera sits on +Z, which is longitude 90° in this mapping, so the
 * camera-facing hemisphere is roughly longitudes 0°–180°.
 */

const SEGMENTS = 8;
const SEGMENT_SPAN = 360 / SEGMENTS;
const STEP_DEG = 7;

type Bus = {
  baseLat: number;
  /** Longitude of the first vertical step. */
  lonOffset: number;
  /** Per-segment latitude offset, in multiples of STEP_DEG. */
  pattern: readonly number[];
};

const SOUTH: Bus = { baseLat: -34, lonOffset: 0, pattern: [0, 1, 0, 0, -1, -1, 0, 1] };
const EQUATOR: Bus = { baseLat: -1, lonOffset: 20, pattern: [1, 0, -1, 0, 1, 1, 0, -1] };
const NORTH: Bus = { baseLat: 30, lonOffset: -15, pattern: [0, -1, 0, 1, 0, -1, -1, 0] };

function segmentIndex(bus: Bus, lon: number) {
  const local = (((lon - bus.lonOffset) % 360) + 360) % 360;
  return Math.floor(local / SEGMENT_SPAN);
}

/** Latitude of a bus's horizontal run at a given longitude. */
function latAt(bus: Bus, lon: number) {
  return bus.baseLat + bus.pattern[segmentIndex(bus, lon)] * STEP_DEG;
}

function busLoop(bus: Bus): LatLon[] {
  const latOf = (i: number) => bus.baseLat + bus.pattern[i % SEGMENTS] * STEP_DEG;
  // Start mid-run so the loop's seam sits on a straight section, never a bend.
  const start = bus.lonOffset + SEGMENT_SPAN / 2;
  const points: LatLon[] = [[latOf(0), start]];

  for (let i = 0; i < SEGMENTS; i += 1) {
    const here = latOf(i);
    const next = latOf(i + 1);
    if (here === next) continue;
    const boundary = bus.lonOffset + SEGMENT_SPAN * (i + 1);
    points.push([here, boundary], [next, boundary]);
  }

  points.push([latOf(0), start + 360]);
  return points;
}

/** Vertical connector between two buses, with an optional small jog. */
function connector(from: Bus, to: Bus, lon: number, jog = 0): LatLon[] {
  const a = latAt(from, lon);
  const b = latAt(to, lon + jog);
  if (jog === 0) return [[a, lon], [b, lon]];
  const mid = Math.round((a + b) / 2);
  return [[a, lon], [mid, lon], [mid, lon + jog], [b, lon + jog]];
}

/** Stub running from a bus toward a pole, ending in a via. */
function stub(from: Bus, lon: number, endLat: number, jog: number): LatLon[] {
  const a = latAt(from, lon);
  const mid = Math.round(a + (endLat - a) * 0.55);
  return [[a, lon], [mid, lon], [mid, lon + jog], [endLat, lon + jog]];
}

const LOOPS: CircuitDefinition[] = [
  {
    points: busLoop(SOUTH),
    nodeIndexes: [],
    closed: true,
    highlights: [[0.08, 0.15], [0.56, 0.62]],
    pulses: [
      { speed: 0.03, offset: 0.1 },
      { speed: 0.03, offset: 0.6 },
    ],
  },
  {
    points: busLoop(EQUATOR),
    nodeIndexes: [],
    closed: true,
    highlights: [[0.3, 0.38], [0.78, 0.84]],
    pulses: [
      { speed: 0.024, offset: 0.25 },
      { speed: -0.027, offset: 0.7 },
    ],
  },
  {
    points: busLoop(NORTH),
    nodeIndexes: [],
    closed: true,
    highlights: [[0.18, 0.25], [0.66, 0.72]],
    pulses: [
      { speed: -0.032, offset: 0.4 },
      { speed: -0.032, offset: 0.9 },
    ],
  },
];

type Link = { points: LatLon[]; pulse?: PulseSpec; highlight?: boolean };

// Longitudes sit well inside both buses' horizontal runs, so every connector
// lands squarely on a trace rather than on a bend.
const LINKS: Link[] = [
  // south <-> equator
  { points: connector(SOUTH, EQUATOR, 32, 4), pulse: { speed: 0.22, offset: 0.1 } },
  { points: connector(SOUTH, EQUATOR, 100), highlight: true },
  { points: connector(SOUTH, EQUATOR, 167, -4), pulse: { speed: -0.2, offset: 0.55 } },
  { points: connector(SOUTH, EQUATOR, 212, 4) },
  { points: connector(SOUTH, EQUATOR, 302, -4), pulse: { speed: 0.21, offset: 0.3 } },
  // equator <-> north
  { points: connector(EQUATOR, NORTH, 47, -5), highlight: true },
  { points: connector(EQUATOR, NORTH, 137, 5), pulse: { speed: -0.24, offset: 0.2 } },
  { points: connector(EQUATOR, NORTH, 227, 5), pulse: { speed: 0.22, offset: 0.7 } },
  { points: connector(EQUATOR, NORTH, 317, -5) },
  // polar stubs
  { points: stub(NORTH, 97, 54, 8), pulse: { speed: 0.26, offset: 0.4 } },
  { points: stub(NORTH, 277, 54, -8) },
  { points: stub(SOUTH, 157, -56, -8), highlight: true },
  { points: stub(SOUTH, 337, -56, 8), pulse: { speed: -0.25, offset: 0.85 } },
];

const BRANCHES: CircuitDefinition[] = LINKS.map((link) => ({
  points: link.points,
  // Pads at both ends: junction vias where the branch meets a bus.
  nodeIndexes: [0, link.points.length - 1],
  highlights: link.highlight ? [[0.2, 0.8]] : undefined,
  pulses: link.pulse ? [link.pulse] : undefined,
}));

function compileCircuit(definition: CircuitDefinition): CircuitPath {
  const { route, anchors } = chamferRoute(definition.points);
  const source = buildSourceCurve(route);
  const curve = new SphericalSurfaceCurve(source);

  return {
    curve,
    highlights: (definition.highlights ?? []).map(
      ([start, end]) => new SphericalSurfaceCurve(source, start, end),
    ),
    nodes: buildNodes(anchors, definition.nodeIndexes),
    pulses: [...(definition.pulses ?? [])],
    closed: Boolean(definition.closed),
    length: curve.getLength(),
  };
}

export const CIRCUITS: CircuitPath[] = [
  ...LOOPS.map(compileCircuit),
  ...BRANCHES.map(compileCircuit),
];
