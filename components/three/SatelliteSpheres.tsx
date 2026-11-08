"use client";

import { useRef } from "react";
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

function Satellite({
  orbit,
  satellite,
  index,
  theme,
  reduced,
}: {
  orbit: OrbitConfig;
  satellite: SatelliteSpec;
  index: number;
  theme: "light" | "dark";
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const glowMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const isLime = satellite.color === "lime";

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const progress = reduced ? 1 : entrance(t, 0.42 + index * 0.08, 0.9);
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
        progress * (theme === "dark" ? 0.18 : 0.1);
    }
  });

  return (
    <group rotation={orbit.tilt}>
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[satellite.size, 28, 28]} />
          <meshStandardMaterial
            ref={bodyMatRef}
            color={isLime ? LIME : theme === "dark" ? IVORY : CHARCOAL}
            metalness={isLime ? 0.15 : 0.9}
            roughness={isLime ? 0.38 : 0.22}
            emissive={isLime ? LIME : "#000000"}
            emissiveIntensity={isLime ? 1.15 : 0}
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
    </group>
  );
}

export default function SatelliteSpheres({ theme, reduced }: Props) {
  return (
    <group>
      {ORBITS.map((orbit, orbitIndex) =>
        orbit.satellites.map((satellite, satelliteIndex) => (
          <Satellite
            key={`${orbitIndex}-${satelliteIndex}`}
            orbit={orbit}
            satellite={satellite}
            index={orbitIndex * 2 + satelliteIndex}
            theme={theme}
            reduced={reduced}
          />
        ))
      )}
    </group>
  );
}
