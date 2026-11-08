"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CHARCOAL, IVORY } from "./palette";
import { entrance } from "./utils";

type Props = {
  theme: "light" | "dark";
  reduced: boolean;
  quality: "high" | "low";
};

export default function AbstractDetails({ theme, reduced, quality }: Props) {
  const arcRef = useRef<THREE.Mesh>(null);
  const arcMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const outlineARef = useRef<THREE.Mesh>(null);
  const outlineBRef = useRef<THREE.Mesh>(null);
  const outlineAMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const outlineBMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const fragmentRef = useRef<THREE.Mesh>(null);
  const fragmentMatRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const progress = reduced ? 1 : entrance(t, 0.55, 1.1);

    if (arcMatRef.current) {
      arcMatRef.current.opacity = progress * (theme === "dark" ? 0.34 : 0.26);
    }
    if (outlineAMatRef.current) {
      outlineAMatRef.current.opacity = progress * (theme === "dark" ? 0.16 : 0.12);
    }
    if (outlineBMatRef.current) {
      outlineBMatRef.current.opacity = progress * (theme === "dark" ? 0.1 : 0.08);
    }
    if (fragmentMatRef.current) {
      fragmentMatRef.current.opacity = progress;
    }

    if (!reduced) {
      if (arcRef.current) arcRef.current.rotation.z = t * 0.02;
      if (outlineARef.current) outlineARef.current.rotation.z = t * 0.03;
      if (outlineBRef.current) outlineBRef.current.rotation.z = -t * 0.024;
      if (fragmentRef.current) {
        fragmentRef.current.rotation.x = t * 0.18;
        fragmentRef.current.rotation.y = t * 0.24;
        fragmentRef.current.position.y = 1.08 + Math.sin(t * 0.6) * 0.035;
      }
    }
  });

  return (
    <group>
      <group rotation={[1.24, 0.42, -0.28]}>
        <mesh ref={arcRef}>
          <torusGeometry args={[1.5, 0.021, 14, 150, Math.PI * 1.02]} />
          <meshPhysicalMaterial
            ref={arcMatRef}
            color={IVORY}
            roughness={0.12}
            metalness={0}
            transmission={quality === "high" ? 0.9 : 0}
            thickness={0.35}
            ior={1.42}
            envMapIntensity={1.1}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      </group>

      <group rotation={[1.12, 0.22, 0]}>
        <mesh ref={outlineARef}>
          <torusGeometry args={[1.63, 0.004, 6, 200]} />
          <meshBasicMaterial
            ref={outlineAMatRef}
            color={IVORY}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      </group>

      <group rotation={[1.4, -0.32, 0.62]}>
        <mesh ref={outlineBRef}>
          <torusGeometry args={[1.36, 0.003, 6, 180]} />
          <meshBasicMaterial
            ref={outlineBMatRef}
            color={theme === "dark" ? IVORY : CHARCOAL}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      </group>

      <mesh ref={fragmentRef} position={[-1.4, 1.08, 0.55]}>
        <icosahedronGeometry args={[0.082, 0]} />
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
    </group>
  );
}
