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
  const limeLight = useRef<THREE.PointLight>(null);
  const dark = theme === "dark";

  useFrame(({ clock }) => {
    if (!limeLight.current || reduced) return;

    const t = clock.elapsedTime;
    const angle = t * 0.24;

    // Orbit behind the sphere (z < 0) so the lime reads as a rim light on the
    // silhouette instead of a soft blob on the camera-facing surface.
    limeLight.current.position.set(
      Math.cos(angle) * 3.2,
      0.4 + Math.sin(t * 0.31) * 0.7,
      -2.2 + Math.sin(angle) * 0.9,
    );
  });

  return (
    <>
      <ambientLight intensity={dark ? 0.28 : 0.42} />

      <directionalLight
        position={[6, 3, 2]}
        intensity={dark ? 0.45 : 0.4}
        color={IVORY}
      />
      <directionalLight
        position={[-3.5, 2.5, -5]}
        intensity={dark ? 1.05 : 0.8}
        color={IVORY}
      />
      <directionalLight
        position={[-5, -2, -3]}
        intensity={dark ? 0.42 : 0.28}
        color={LIME}
      />

      <pointLight
        ref={limeLight}
        position={[3.2, 0.4, -2.2]}
        color={LIME}
        intensity={dark ? 3.4 : 2.2}
        distance={9}
        decay={2}
      />

      {/* Reflections are identical in both themes so the sphere looks the same. */}
      <Environment
        key={theme}
        resolution={quality === "high" ? 256 : 128}
        frames={1}
      >
        {/* Key softbox: a long tilted strip reads as a crisp studio
            reflection across the upper-left of the sphere. */}
        <Lightformer
          form="rect"
          intensity={3.2}
          color={IVORY}
          position={[-6, 6, 3]}
          rotation-z={0.6}
          scale={[12, 1, 1]}
          target={[0, 0, 0]}
        />
        {/* Overhead wash for a soft gradient on the top hemisphere. */}
        <Lightformer
          form="rect"
          intensity={1.4}
          color={IVORY}
          position={[0, 8, -2]}
          scale={[14, 6, 1]}
          target={[0, 0, 0]}
        />
        {/* Right-hand fill strip: defines the right edge. */}
        <Lightformer
          form="rect"
          intensity={1.1}
          color={IVORY}
          position={[7, 0, 1]}
          scale={[1.4, 9, 1]}
          target={[0, 0, 0]}
        />
        {/* Back lights wrap around the silhouette for separation. */}
        <Lightformer
          form="rect"
          intensity={1.6}
          color={IVORY}
          position={[0, 2, -9]}
          scale={[16, 6, 1]}
          target={[0, 0, 0]}
        />
        {/* Lime kicker placed well behind so its reflection hugs the
            lower-left rim rather than sitting on the visible face. */}
        <Lightformer
          form="rect"
          intensity={1.6}
          color={LIME}
          position={[-3, -2.5, -9]}
          scale={[6, 1.4, 1]}
          target={[0, 0, 0]}
        />
      </Environment>
    </>
  );
}
