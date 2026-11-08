"use client";

import { useRef } from "react";
import { Environment, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { IVORY, LIME } from "./palette";

type Props = {
  theme: "light" | "dark";
  reduced: boolean;
  quality: "high" | "low";
};

export default function SceneLighting({ theme, reduced, quality }: Props) {
  const limeRef = useRef<THREE.PointLight>(null);
  const dark = theme === "dark";

  useFrame((state) => {
    if (!limeRef.current || reduced) return;
    const t = state.clock.elapsedTime;
    const angle = t * 0.34;
    limeRef.current.position.set(
      Math.cos(angle) * 3.2,
      Math.sin(t * 0.45) * 1.1 + 0.6,
      Math.sin(angle) * 3.2
    );
  });

  return (
    <>
      <ambientLight intensity={dark ? 0.35 : 0.5} />
      <directionalLight
        position={[4, 5, 6]}
        intensity={dark ? 1.5 : 1.2}
        color={IVORY}
      />
      <directionalLight
        position={[-2.5, 3, -6]}
        intensity={dark ? 1.5 : 1.1}
        color={IVORY}
      />
      <directionalLight
        position={[-5, -2, -4]}
        intensity={dark ? 0.7 : 0.45}
        color={LIME}
      />
      <directionalLight
        position={[-3, 3, 4]}
        intensity={dark ? 0.35 : 0.5}
        color={IVORY}
      />
      <pointLight
        ref={limeRef}
        position={[3.2, 0.6, 0]}
        color={LIME}
        intensity={dark ? 5 : 3.4}
        distance={16}
        decay={2}
      />

      <Environment
        key={theme}
        resolution={quality === "high" ? 256 : 128}
        frames={1}
      >
        <color attach="background" args={[dark ? "#050608" : "#cbc7bd"]} />
        <Lightformer
          form="rect"
          intensity={dark ? 2.6 : 2.2}
          color={IVORY}
          position={[0, 5, -8]}
          scale={[18, 10, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={dark ? 1.3 : 1}
          color={IVORY}
          position={[7, 1, 4]}
          scale={[7, 9, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={dark ? 0.9 : 0.6}
          color={LIME}
          position={[-7, -3, -2]}
          scale={[5, 6, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={0.5}
          color={IVORY}
          position={[0, 0, 9]}
          scale={[16, 10, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={0.15}
          color="#15171a"
          position={[0, -6, 0]}
          scale={[14, 9, 1]}
          target={[0, 0, 0]}
        />
      </Environment>
    </>
  );
}
