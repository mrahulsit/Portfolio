"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  CIRCUITS,
  CIRCUIT_TUBE_RADIUS,
  type CircuitNode,
  type CircuitPath,
} from "./circuitConfig";
import { IVORY, LIME } from "./palette";
import { easeOutCubic, entrance } from "./utils";

type Props = {
  theme: "light" | "dark";
  reduced: boolean;
};

/** Max pulses per route (size of the shader uniform arrays). */
const MAX_PULSES = 4;
/** Tube resolution: world units per tube segment. */
const TUBE_SEGMENT_LENGTH = 0.016;
/** Fraction of an open route over which a pulse fades in/out at each end. */
const END_FADE = 0.06;
/** Seconds a delivery ripple takes to expand and fade at a junction pad. */
const RIPPLE_DURATION = 1.1;
/** Colour of the white-hot pulse head. */
const HOT = "#f6ffd6";


/* -------------------------------------------------------------------------- */
/*  Streak shader                                                             */
/* -------------------------------------------------------------------------- */

/**
 * The streak is a slightly wider tube laid over each trace. TubeGeometry's
 * uv.x is the arc-length parameter of the curve, which is exactly what the
 * pulse heads use, so the fragment shader can light the trace itself: a
 * white-hot head, a lime comet tail that bends around every chamfer, and a
 * faint long wake. No per-frame geometry is rebuilt.
 */
const streakVertex = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mv;
  }
`;

const streakFragment = `
  uniform float uHeads[${MAX_PULSES}];
  uniform float uDirs[${MAX_PULSES}];
  uniform float uEnv[${MAX_PULSES}];
  uniform float uLength;
  uniform float uClosed;
  uniform float uTail;
  uniform float uOpacity;
  uniform vec3 uColor;
  uniform vec3 uHot;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    float glow = 0.0;
    float hot = 0.0;

    for (int i = 0; i < ${MAX_PULSES}; i++) {
      // Signed distance behind the head along the direction of travel.
      float d = (uHeads[i] - vUv.x) * uDirs[i];
      if (uClosed > 0.5) d = fract(d + 0.5) - 0.5;
      float w = d * uLength;

      float tail = w >= 0.0 ? exp(-w / uTail) : exp(w / 0.01);
      float wake = w >= 0.0 ? exp(-w / (uTail * 4.0)) * 0.16 : 0.0;
      float head = exp(-(w * w) / 0.00035);

      glow += (tail * 0.9 + wake) * uEnv[i];
      hot += head * uEnv[i];
    }

    // Brighter down the centre line, softer toward the tube's edges.
    float core = pow(clamp(dot(normalize(vNormal), normalize(vView)), 0.0, 1.0), 0.8);
    vec3 color = mix(uColor, uHot, clamp(hot, 0.0, 1.0));
    float alpha = clamp(glow + hot * 0.8, 0.0, 1.8) * mix(0.45, 1.0, core) * uOpacity;
    if (alpha < 0.003) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

function createStreakMaterial(path: CircuitPath) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uHeads: { value: new Array(MAX_PULSES).fill(0) },
      uDirs: { value: new Array(MAX_PULSES).fill(1) },
      uEnv: { value: new Array(MAX_PULSES).fill(0) },
      uLength: { value: path.length },
      uClosed: { value: path.closed ? 1 : 0 },
      // Loops are long, so give their comets longer tails.
      uTail: { value: path.closed ? 0.34 : 0.22 },
      uOpacity: { value: 0 },
      uColor: { value: new THREE.Color(LIME) },
      uHot: { value: new THREE.Color(HOT) },
    },
    vertexShader: streakVertex,
    fragmentShader: streakFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
}

/* -------------------------------------------------------------------------- */
/*  Shared materials                                                          */
/* -------------------------------------------------------------------------- */

type Materials = ReturnType<typeof createMaterials>;

function basic(color: string, extra: THREE.MeshBasicMaterialParameters = {}) {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    ...extra,
  });
}

function createMaterials() {
  return {
    base: basic(IVORY),
    lime: basic(LIME, { toneMapped: false }),
    limePad: basic(LIME, { toneMapped: false }),
    ivoryPad: basic(IVORY),
    padHalo: basic(LIME, {
      toneMapped: false,
      blending: THREE.AdditiveBlending,
    }),
    pulseCore: basic(HOT, { toneMapped: false }),
    pulseHalo: basic(LIME, {
      toneMapped: false,
      blending: THREE.AdditiveBlending,
    }),
    // Ignores depth so pulses on the far side glow faintly through the
    // sphere: data visibly keeps flowing around the back.
    pulseGhost: basic(LIME, {
      toneMapped: false,
      blending: THREE.AdditiveBlending,
      depthTest: false,
    }),
  };
}

type SharedGeometries = {
  sphere: THREE.SphereGeometry;
  ring: THREE.RingGeometry;
  disc: THREE.CircleGeometry;
  ripple: THREE.RingGeometry;
};

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

const wrap01 = (value: number) => ((value % 1) + 1) % 1;

/* -------------------------------------------------------------------------- */
/*  Pulses                                                                    */
/* -------------------------------------------------------------------------- */

function PathPulses({
  path,
  streakGeometry,
  theme,
  reduced,
  materials,
  geometries,
}: {
  path: CircuitPath;
  streakGeometry: THREE.TubeGeometry;
  theme: "light" | "dark";
  reduced: boolean;
  materials: Materials;
  geometries: SharedGeometries;
}) {
  const pulses = path.pulses.slice(0, MAX_PULSES);
  const heads = useRef<(THREE.Group | null)[]>([]);
  const ripples = useRef<(THREE.Mesh | null)[]>([]);
  const point = useMemo(() => new THREE.Vector3(), []);

  const streak = useMemo(() => createStreakMaterial(path), [path]);
  // Branch pulses "deliver" into a junction pad; each gets its own ripple
  // material so ripples can fade independently.
  const rippleMaterials = useMemo(
    () =>
      path.closed
        ? []
        : path.pulses.slice(0, MAX_PULSES).map(() =>
            basic(LIME, {
              toneMapped: false,
              blending: THREE.AdditiveBlending,
            }),
          ),
    [path],
  );

  useEffect(
    () => () => {
      streak.dispose();
      rippleMaterials.forEach((material) => material.dispose());
    },
    [streak, rippleMaterials],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const reveal = reduced ? 1 : entrance(t, 0.9, 0.85);
    const uniforms = streak.uniforms;

    uniforms.uOpacity.value = reveal;

    pulses.forEach((pulse, i) => {
      const phase = wrap01(reduced ? pulse.offset : t * pulse.speed + pulse.offset);
      const envelope = path.closed
        ? 1
        : smoothstep(0, END_FADE, phase) * (1 - smoothstep(1 - END_FADE, 1, phase));

      uniforms.uHeads.value[i] = phase;
      uniforms.uDirs.value[i] = pulse.speed < 0 ? -1 : 1;
      uniforms.uEnv.value[i] = envelope;

      const head = heads.current[i];
      if (head) {
        path.curve.getPointAt(phase, point);
        head.position.copy(point);
        // A gentle shimmer keeps the head feeling alive.
        const shimmer = reduced ? 1 : 0.9 + 0.1 * Math.sin(t * 9 + i * 2.1);
        head.scale.setScalar(Math.max(0.001, reveal * envelope * shimmer));
      }

      const ripple = ripples.current[i];
      const rippleMaterial = rippleMaterials[i];
      if (!ripple || !rippleMaterial) return;

      const target =
        pulse.speed >= 0 ? path.nodes[path.nodes.length - 1] : path.nodes[0];
      // Seconds since the pulse last reached the end of its route.
      const since =
        (pulse.speed >= 0 ? phase : 1 - phase) / Math.max(Math.abs(pulse.speed), 1e-4);
      const k = since / RIPPLE_DURATION;

      if (reduced || !target || k >= 1) {
        ripple.visible = false;
        return;
      }
      ripple.visible = true;
      ripple.position.copy(target.position);
      ripple.quaternion.copy(target.quaternion);
      ripple.scale.setScalar(target.size * (1.2 + 4.2 * easeOutCubic(k)));
      rippleMaterial.opacity = reveal * (1 - k) * (1 - k) * 0.85;
    });

    for (let i = pulses.length; i < MAX_PULSES; i += 1) {
      uniforms.uEnv.value[i] = 0;
    }
  });

  return (
    <>
      <mesh geometry={streakGeometry} material={streak} renderOrder={2} />

      {pulses.map((_, i) => (
        <group
          key={`head-${i}`}
          ref={(group) => {
            heads.current[i] = group;
          }}
        >
          <mesh geometry={geometries.sphere} material={materials.pulseCore} scale={0.011} />
          <mesh geometry={geometries.sphere} material={materials.pulseHalo} scale={0.05} />
          <mesh
            geometry={geometries.sphere}
            material={materials.pulseGhost}
            scale={0.042}
            renderOrder={10}
          />
        </group>
      ))}

      {rippleMaterials.map((material, i) => (
        <mesh
          key={`ripple-${i}`}
          ref={(mesh) => {
            ripples.current[i] = mesh;
          }}
          geometry={geometries.ripple}
          material={material}
          visible={false}
        />
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pads                                                                      */
/* -------------------------------------------------------------------------- */

function Pad({
  node,
  materials,
  geometries,
}: {
  node: CircuitNode;
  materials: Materials;
  geometries: SharedGeometries;
}) {
  const padMaterial = node.lime ? materials.limePad : materials.ivoryPad;

  return (
    <group position={node.position} quaternion={node.quaternion} scale={node.size}>
      {node.terminal ? (
        <>
          {/* Via: outer annulus with a lit (lime) or hollow (ivory) core. */}
          <mesh geometry={geometries.ring} material={padMaterial} />
          {node.lime && (
            <>
              <mesh geometry={geometries.disc} material={padMaterial} scale={0.42} />
              <mesh geometry={geometries.disc} material={materials.padHalo} scale={2.2} />
            </>
          )}
        </>
      ) : (
        <mesh geometry={geometries.disc} material={padMaterial} />
      )}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Root                                                                      */
/* -------------------------------------------------------------------------- */

export default function CircuitTraces({ theme, reduced }: Props) {
  const root = useRef<THREE.Group>(null);

  const resources = useMemo(() => {
    const materials = createMaterials();

    const geometries: SharedGeometries = {
      sphere: new THREE.SphereGeometry(1, 16, 16),
      ring: new THREE.RingGeometry(0.58, 1, 32),
      disc: new THREE.CircleGeometry(1, 32),
      ripple: new THREE.RingGeometry(0.88, 1, 48),
    };

    const segmentsFor = (length: number, min: number) =>
      Math.max(min, Math.ceil(length / TUBE_SEGMENT_LENGTH));

    const paths = CIRCUITS.map((path) => ({
      main: new THREE.TubeGeometry(
        path.curve,
        segmentsFor(path.length, 24),
        CIRCUIT_TUBE_RADIUS,
        6,
        path.closed,
      ),
      highlights: path.highlights.map(
        (curve) =>
          new THREE.TubeGeometry(
            curve,
            segmentsFor(curve.getLength(), 16),
            CIRCUIT_TUBE_RADIUS * 1.2,
            6,
            false,
          ),
      ),
      streak: path.pulses.length
        ? new THREE.TubeGeometry(
            path.curve,
            // Finer sampling so the comet gradient stays smooth.
            segmentsFor(path.length, 48) * 2,
            CIRCUIT_TUBE_RADIUS * 2.4,
            8,
            path.closed,
          )
        : null,
    }));

    return { materials, geometries, paths };
  }, []);

  useEffect(
    () => () => {
      resources.paths.forEach(({ main, highlights, streak }) => {
        main.dispose();
        highlights.forEach((highlight) => highlight.dispose());
        streak?.dispose();
      });
      Object.values(resources.geometries).forEach((geometry) => geometry.dispose());
      Object.values(resources.materials).forEach((material) => material.dispose());
    },
    [resources],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const reveal = reduced ? 1 : entrance(t, 0.25, 1.25);
    const m = resources.materials;

    if (root.current) {
      // Match the sphere rotation so the artwork stays attached.
      root.current.rotation.y = reduced ? 0 : t * 0.05;
    }

    // The traces live on the sphere, so they look the same in both themes.
    m.base.opacity = reveal * 0.4;
    m.lime.opacity = reveal * 0.8;
    m.limePad.opacity = reveal * 0.95;
    m.ivoryPad.opacity = reveal * 0.7;
    // Gentle breathing on the via glows.
    m.padHalo.opacity = reveal * 0.14 * (0.75 + 0.25 * Math.sin(t * 1.4));
    m.pulseCore.opacity = reveal;
    m.pulseHalo.opacity = reveal * 0.26;
    m.pulseGhost.opacity = reveal * 0.2;
  });

  return (
    <group ref={root}>
      {CIRCUITS.map((path, index) => {
        const geometry = resources.paths[index];

        return (
          <group key={`circuit-${index}`}>
            <mesh geometry={geometry.main} material={resources.materials.base} />

            {geometry.highlights.map((highlight, highlightIndex) => (
              <mesh
                key={`highlight-${highlightIndex}`}
                geometry={highlight}
                material={resources.materials.lime}
              />
            ))}

            {path.nodes.map((node, nodeIndex) => (
              <Pad
                key={`pad-${nodeIndex}`}
                node={node}
                materials={resources.materials}
                geometries={resources.geometries}
              />
            ))}

            {geometry.streak && (
              <PathPulses
                path={path}
                streakGeometry={geometry.streak}
                theme={theme}
                reduced={reduced}
                materials={resources.materials}
                geometries={resources.geometries}
              />
            )}
          </group>
        );
      })}
    </group>
  );
}
