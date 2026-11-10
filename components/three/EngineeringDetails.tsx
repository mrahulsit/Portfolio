"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { IVORY, LIME } from "./palette";
import { entrance } from "./utils";

type Props = {
  theme: "light" | "dark";
  reduced: boolean;
};

const ARCS = [
  {
    radius: 1.96,
    arc: 0.3,
    tube: 0.0032,
    rotation: [0.38, 0.42, 2.12] as [number, number, number],
    tick: "lime" as const,
  },
  {
    radius: 2.02,
    arc: 0.16,
    tube: 0.0028,
    rotation: [-0.52, -0.34, -0.42] as [number, number, number],
    tick: "ivory" as const,
  },
];

export default function EngineeringDetails({ theme, reduced }: Props) {
  const groupRef = useRef<THREE.Group>(null);

  const lineMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: IVORY,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    []
  );
  const limeTickMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: LIME,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    []
  );
  const ivoryTickMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: IVORY,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    []
  );

  useEffect(
    () => () => {
      lineMaterial.dispose();
      limeTickMaterial.dispose();
      ivoryTickMaterial.dispose();
    },
    [lineMaterial, limeTickMaterial, ivoryTickMaterial]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const progress = reduced ? 1 : entrance(t, 0.7, 1.2);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(Math.max(0.001, progress));
    }
    lineMaterial.opacity = progress * (theme === "dark" ? 0.26 : 0.18);
    const tickOpacity = progress * (theme === "dark" ? 0.9 : 0.7);
    limeTickMaterial.opacity = tickOpacity;
    ivoryTickMaterial.opacity = tickOpacity;
  });

  return (
    <group ref={groupRef}>
      {ARCS.map((item, index) => {
        const end = {
          x: Math.cos(item.arc) * item.radius,
          y: Math.sin(item.arc) * item.radius,
        };

        return (
          <group key={index} rotation={item.rotation}>
            <mesh material={lineMaterial}>
              <torusGeometry
                args={[item.radius, item.tube, 6, 90, item.arc]}
              />
            </mesh>
            <mesh
              position={[end.x, end.y, 0]}
              material={
                item.tick === "lime" ? limeTickMaterial : ivoryTickMaterial
              }
            >
              <sphereGeometry args={[0.008, 10, 10]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
