"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CHARCOAL, IVORY } from "./palette";
import { entrance } from "./utils";

type Props = {
  theme: "light" | "dark";
  reduced: boolean;
};

export default function AbstractDetails({ theme, reduced }: Props) {
  const fragmentRef = useRef<THREE.Mesh>(null);
  const fragmentMatRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const progress = reduced ? 1 : entrance(t, 0.55, 1.1);

    if (fragmentMatRef.current) {
      fragmentMatRef.current.opacity = progress;
    }

    if (!reduced && fragmentRef.current) {
      fragmentRef.current.rotation.x = t * 0.16;
      fragmentRef.current.rotation.y = t * 0.22;
      fragmentRef.current.position.y = 0.92 + Math.sin(t * 0.5) * 0.03;
    }
  });

  return (
    <mesh ref={fragmentRef} position={[-2.05, 0.92, 0.5]}>
      <icosahedronGeometry args={[0.07, 0]} />
      <meshStandardMaterial
        ref={fragmentMatRef}
        color={theme === "dark" ? IVORY : CHARCOAL}
        metalness={0.92}
        roughness={0.2}
        envMapIntensity={1.2}
        transparent
        opacity={0}
      />
    </mesh>
  );
}
