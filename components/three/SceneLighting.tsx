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
      Math.cos(angle) * 3.1,
      Math.sin(t * 0.45) * 1.3 + 0.5,
      Math.sin(angle) * 3.1
    );
  });

  return (
    <>
      <ambientLight intensity={dark ? 0.3 : 0.48} />
      <directionalLight
        position={[4, 5, 6]}
        intensity={dark ? 2 : 1.6}
        color={IVORY}
      />
      <directionalLight
        position={[-5, -2, -4]}
        intensity={dark ? 0.9 : 0.55}
        color={LIME}
      />
      <directionalLight
        position={[-3, 3, 4]}
        intensity={dark ? 0.4 : 0.6}
        color={IVORY}
      />
      <pointLight
        ref={limeRef}
        position={[3.1, 0.5, 0]}
        color={LIME}
        intensity={dark ? 11 : 7}
        distance={14}
        decay={2}
      />

      <Environment
        key={theme}
        resolution={quality === "high" ? 256 : 128}
        frames={1}
      >
        <color attach="background" args={[dark ? "#050608" : "#cfcbc0"]} />
        <Lightformer
          form="rect"
          intensity={dark ? 3.4 : 2.6}
          color={IVORY}
          position={[0, 4, -8]}
          scale={[14, 8, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.7}
          color={IVORY}
          position={[6, 1.5, 3]}
          scale={[6, 7, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={dark ? 1.5 : 0.9}
          color={LIME}
          position={[-6, -2, -3]}
          scale={[4, 5, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="ring"
          intensity={dark ? 1.1 : 0.8}
          color={IVORY}
          position={[0, 0, 7]}
          scale={5.5}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={0.35}
          color="#1a1d21"
          position={[0, -5, 1]}
          scale={[12, 8, 1]}
          target={[0, 0, 0]}
        />
      </Environment>
    </>
  );
}
