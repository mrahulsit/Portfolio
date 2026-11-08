"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ORBITS, type OrbitConfig } from "./orbitConfig";
import { CHARCOAL, IVORY, LIME } from "./palette";
import { entrance } from "./utils";

type Props = {
  theme: "light" | "dark";
  reduced: boolean;
};

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
              args={[arcCurve, 90, orbit.thickness * 1.65, 8, false]}
              attach="geometry"
            />
            <meshStandardMaterial
              ref={arcMatRef}
              color={LIME}
              emissive={LIME}
              emissiveIntensity={theme === "dark" ? 1.35 : 1.05}
              metalness={0.2}
              roughness={0.35}
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
        ) : null}
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
