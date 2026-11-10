"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  ORBITS,
  type OrbitConfig,
  type SatelliteSpec,
} from "./orbitConfig";
import { CHARCOAL, IVORY, LIME } from "./palette";
import { entrance } from "./utils";

type Props = {
  theme: "light" | "dark";
  reduced: boolean;
};

type NodeSpec = {
  angle: number;
  lime: boolean;
  size: number;
};

type PulseSpec = {
  speed: number;
  phase: number;
  size: number;
};

const NODES: NodeSpec[][] = [
  [
    { angle: 0.6, lime: true, size: 0.021 },
    { angle: 2.7, lime: false, size: 0.015 },
    { angle: 4.6, lime: true, size: 0.014 },
  ],
  [
    { angle: 1.7, lime: false, size: 0.018 },
    { angle: 4.1, lime: true, size: 0.015 },
  ],
  [
    { angle: 0.9, lime: false, size: 0.014 },
    { angle: 3.4, lime: true, size: 0.016 },
    { angle: 5.3, lime: false, size: 0.012 },
  ],
];

const PULSES: PulseSpec[][] = [
  [{ speed: 0.4, phase: 0.9, size: 0.014 }],
  [{ speed: -0.52, phase: 2.3, size: 0.013 }],
  [{ speed: 0.34, phase: 4.6, size: 0.012 }],
];

function buildCurve(
  rx: number,
  ry: number,
  start: number,
  end: number,
  closed: boolean
) {
  const span = end - start;
  const steps = closed
    ? 220
    : Math.max(2, Math.round((220 * Math.abs(span)) / (Math.PI * 2)));
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < steps; i += 1) {
    const angle = start + (span * i) / (closed ? steps : steps - 1);
    points.push(new THREE.Vector3(Math.cos(angle) * rx, Math.sin(angle) * ry, 0));
  }
  return new THREE.CatmullRomCurve3(points, closed);
}

function SatellitePoint({
  orbit,
  satellite,
  theme,
  reduced,
}: {
  orbit: OrbitConfig;
  satellite: SatelliteSpec;
  theme: "light" | "dark";
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const glowMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const isLime = satellite.color === "lime";

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const progress = reduced ? 1 : entrance(t, 0.42, 0.9);
    const angle = satellite.phase + (reduced ? 0 : t * satellite.speed);

    if (groupRef.current) {
      groupRef.current.position.set(
        Math.cos(angle) * orbit.rx * satellite.orbitScale,
        Math.sin(angle) * orbit.ry * satellite.orbitScale,
        0
      );
      groupRef.current.scale.setScalar(Math.max(0.001, progress));
    }
    if (bodyMatRef.current) {
      bodyMatRef.current.opacity = progress;
    }
    if (glowMatRef.current) {
      glowMatRef.current.opacity =
        progress * (theme === "dark" ? 0.09 : 0.06);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[satellite.size, 28, 28]} />
        <meshStandardMaterial
          ref={bodyMatRef}
          color={isLime ? LIME : theme === "dark" ? IVORY : CHARCOAL}
          metalness={isLime ? 0.15 : 0.9}
          roughness={isLime ? 0.38 : 0.22}
          emissive={isLime ? LIME : "#000000"}
          emissiveIntensity={isLime ? 0.85 : 0}
          envMapIntensity={1.15}
          transparent
          opacity={0}
        />
      </mesh>
      {isLime ? (
        <mesh scale={2.2}>
          <sphereGeometry args={[satellite.size, 16, 16]} />
          <meshBasicMaterial
            ref={glowMatRef}
            color={LIME}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ) : null}
    </group>
  );
}

function DataNode({
  orbit,
  spec,
  ringIndex,
  theme,
  reduced,
}: {
  orbit: OrbitConfig;
  spec: NodeSpec;
  ringIndex: number;
  theme: "light" | "dark";
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const haloMatRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const progress = reduced ? 1 : entrance(t, 0.8, 0.9);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(0.5 + 0.5 * progress);
    }

    let boost = 0;
    for (const pulse of PULSES[ringIndex] ?? []) {
      const pulseAngle = pulse.phase + (reduced ? 0 : t * pulse.speed);
      const raw = (pulseAngle - spec.angle) % (Math.PI * 2);
      const delta = Math.abs(((raw + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      if (delta < 0.18) boost = Math.max(boost, 1 - delta / 0.18);
    }

    if (bodyMatRef.current) {
      bodyMatRef.current.opacity = progress;
      const flicker = spec.lime
        ? Math.sin(t * 1.15 + spec.angle * 2) * 0.18
        : 0;
      bodyMatRef.current.emissiveIntensity = spec.lime
        ? 0.85 + flicker + boost * 0.9
        : boost * 0.55;
    }
    if (haloMatRef.current) {
      haloMatRef.current.opacity =
        progress * ((theme === "dark" ? 0.09 : 0.06) + boost * 0.16);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[
        Math.cos(spec.angle) * orbit.rx,
        Math.sin(spec.angle) * orbit.ry,
        0,
      ]}
    >
      <mesh>
        <sphereGeometry args={[spec.size, 18, 18]} />
        <meshStandardMaterial
          ref={bodyMatRef}
          color={spec.lime ? LIME : theme === "dark" ? IVORY : CHARCOAL}
          metalness={spec.lime ? 0.15 : 0.85}
          roughness={spec.lime ? 0.4 : 0.24}
          emissive={spec.lime ? LIME : theme === "dark" ? IVORY : "#e6e2d9"}
          emissiveIntensity={spec.lime ? 0.85 : 0}
          transparent
          opacity={0}
        />
      </mesh>
      {spec.lime ? (
        <mesh scale={2.3}>
          <sphereGeometry args={[spec.size, 12, 12]} />
          <meshBasicMaterial
            ref={haloMatRef}
            color={LIME}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ) : null}
    </group>
  );
}

function DataPulse({
  orbit,
  spec,
  theme,
  reduced,
}: {
  orbit: OrbitConfig;
  spec: PulseSpec;
  theme: "light" | "dark";
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const haloMatRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const progress = reduced ? 1 : entrance(t, 0.95, 1);
    const angle = spec.phase + (reduced ? 0 : t * spec.speed);

    if (groupRef.current) {
      groupRef.current.position.set(
        Math.cos(angle) * orbit.rx,
        Math.sin(angle) * orbit.ry,
        0
      );
      groupRef.current.scale.setScalar(Math.max(0.001, progress));
    }
    if (bodyMatRef.current) {
      bodyMatRef.current.opacity = progress;
    }
    if (haloMatRef.current) {
      haloMatRef.current.opacity =
        progress * (theme === "dark" ? 0.18 : 0.12);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[spec.size, 14, 14]} />
        <meshStandardMaterial
          ref={bodyMatRef}
          color={LIME}
          emissive={LIME}
          emissiveIntensity={1.7}
          roughness={0.35}
          metalness={0.1}
          transparent
          opacity={0}
        />
      </mesh>
      <mesh scale={2.4}>
        <sphereGeometry args={[spec.size, 12, 12]} />
        <meshBasicMaterial
          ref={haloMatRef}
          color={LIME}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function Ring({
  orbit,
  index,
  theme,
  reduced,
}: {
  orbit: OrbitConfig;
  index: number;
  theme: "light" | "dark";
  reduced: boolean;
}) {
  const rootRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const lineMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const arcMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const curve = useMemo(
    () => buildCurve(orbit.rx, orbit.ry, 0, Math.PI * 2, true),
    [orbit.rx, orbit.ry]
  );

  const arcStart = orbit.limeArc ? orbit.limeArc.start * Math.PI * 2 : 0;
  const arcEnd = orbit.limeArc
    ? (orbit.limeArc.start + orbit.limeArc.span) * Math.PI * 2
    : 0.0001;
  const arcCurve = useMemo(
    () => buildCurve(orbit.rx, orbit.ry, arcStart, arcEnd, false),
    [orbit.rx, orbit.ry, arcStart, arcEnd]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const progress = reduced ? 1 : entrance(t, 0.12 + index * 0.14, 1);

    if (rootRef.current) {
      rootRef.current.rotation.x =
        orbit.tilt[0] + (reduced ? 0 : Math.sin(t * 0.11 + index) * 0.035);
      rootRef.current.rotation.y =
        orbit.tilt[1] + (reduced ? 0 : Math.cos(t * 0.09 + index) * 0.03);
      rootRef.current.rotation.z = orbit.tilt[2];
      rootRef.current.scale.setScalar(0.94 + 0.06 * progress);
    }
    if (spinRef.current) {
      spinRef.current.rotation.z = reduced
        ? orbit.phase
        : t * orbit.spin + orbit.phase;
    }
    if (lineMatRef.current) {
      lineMatRef.current.opacity = progress * (theme === "dark" ? 0.95 : 0.9);
    }
    if (arcMatRef.current) {
      arcMatRef.current.opacity = progress;
    }
  });

  return (
    // Outer group rolls the ring in the screen plane (makes it diagonal);
    // the inner root applies the tilt plus a gentle wobble.
    <group rotation={[0, 0, orbit.roll]}>
      <group ref={rootRef} rotation={orbit.tilt}>
        <group ref={spinRef} rotation={[0, 0, orbit.phase]}>
          <mesh>
            <tubeGeometry
              args={[curve, 260, orbit.thickness, 8, true]}
              attach="geometry"
            />
            <meshStandardMaterial
              ref={lineMatRef}
              color={theme === "dark" ? IVORY : CHARCOAL}
              emissive={theme === "dark" ? IVORY : CHARCOAL}
              emissiveIntensity={theme === "dark" ? 0.22 : 0.05}
              metalness={0.82}
              roughness={0.28}
              envMapIntensity={theme === "dark" ? 1.1 : 0.8}
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
          {orbit.limeArc ? (
            <mesh>
              <tubeGeometry
                args={[arcCurve, 90, orbit.thickness * 1.5, 8, false]}
                attach="geometry"
              />
              <meshStandardMaterial
                ref={arcMatRef}
                color={LIME}
                emissive={LIME}
                emissiveIntensity={theme === "dark" ? 1.1 : 0.9}
                metalness={0.2}
                roughness={0.35}
                transparent
                opacity={0}
                depthWrite={false}
              />
            </mesh>
          ) : null}
          {orbit.satellites.map((satellite, satelliteIndex) => (
            <SatellitePoint
              key={`satellite-${satelliteIndex}`}
              orbit={orbit}
              satellite={satellite}
              theme={theme}
              reduced={reduced}
            />
          ))}
          {NODES[index]?.map((node, nodeIndex) => (
            <DataNode
              key={`node-${nodeIndex}`}
              orbit={orbit}
              spec={node}
              ringIndex={index}
              theme={theme}
              reduced={reduced}
            />
          ))}
          {PULSES[index]?.map((pulse, pulseIndex) => (
            <DataPulse
              key={`pulse-${pulseIndex}`}
              orbit={orbit}
              spec={pulse}
              theme={theme}
              reduced={reduced}
            />
          ))}
        </group>
      </group>
    </group>
  );
}

export default function OrbitalSystem({ theme, reduced }: Props) {
  return (
    <group>
      {ORBITS.map((orbit, index) => (
        <Ring
          key={index}
          orbit={orbit}
          index={index}
          theme={theme}
          reduced={reduced}
        />
      ))}
    </group>
  );
}
