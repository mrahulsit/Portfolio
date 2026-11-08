"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import CentralSphere from "./CentralSphere";
import OrbitalSystem from "./OrbitalSystem";
import SatelliteSpheres from "./SatelliteSpheres";
import AbstractDetails from "./AbstractDetails";
import SceneLighting from "./SceneLighting";

type Quality = "high" | "low";

type Props = {
  theme: "light" | "dark";
  quality: Quality;
  reduced: boolean;
  active: boolean;
};

function Sculpture({
  theme,
  quality,
  reduced,
  hostRef,
}: {
  theme: "light" | "dark";
  quality: Quality;
  reduced: boolean;
  hostRef: React.RefObject<HTMLDivElement | null>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pointer = useRef(new THREE.Vector2(0, 0));
  const smoothed = useRef(new THREE.Vector2(0, 0));
  const scroll = useRef(0);
  const scrollTarget = useRef(0);

  useEffect(() => {
    if (reduced) return;

    const handleMove = (event: PointerEvent) => {
      const host = hostRef.current;
      if (!host) return;
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointer.current.set(
        THREE.MathUtils.clamp(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          -1,
          1
        ),
        THREE.MathUtils.clamp(
          -(((event.clientY - rect.top) / rect.height) * 2 - 1),
          -1,
          1
        )
      );
    };

    const handleScroll = () => {
      scrollTarget.current = THREE.MathUtils.clamp(
        window.scrollY / 700,
        0,
        1
      );
    };

    const reset = () => pointer.current.set(0, 0);

    handleScroll();
    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("blur", reset);
    document.addEventListener("mouseleave", reset);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("blur", reset);
      document.removeEventListener("mouseleave", reset);
    };
  }, [reduced, hostRef]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.1);

    smoothed.current.x = THREE.MathUtils.damp(
      smoothed.current.x,
      reduced ? 0 : pointer.current.x,
      4,
      dt
    );
    smoothed.current.y = THREE.MathUtils.damp(
      smoothed.current.y,
      reduced ? 0 : pointer.current.y,
      4,
      dt
    );
    scroll.current = THREE.MathUtils.damp(
      scroll.current,
      reduced ? 0 : scrollTarget.current,
      4,
      dt
    );

    const idleX = reduced ? 0 : Math.sin(t * 0.32) * 0.012;
    const idleY = reduced ? 0 : Math.sin(t * 0.24) * 0.024;

    group.rotation.x =
      -0.06 + smoothed.current.y * -0.12 + idleX + scroll.current * 0.08;
    group.rotation.y =
      smoothed.current.x * 0.22 + idleY + scroll.current * 0.12;
    group.position.x = smoothed.current.x * 0.05;
    group.position.y = -scroll.current * 0.22;
  });

  return (
    <group ref={groupRef}>
      <CentralSphere theme={theme} reduced={reduced} />
      <OrbitalSystem theme={theme} reduced={reduced} />
      <SatelliteSpheres theme={theme} reduced={reduced} />
      <AbstractDetails theme={theme} reduced={reduced} />
    </group>
  );
}

export default function HeroScene({ theme, quality, reduced, active }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={hostRef} className="absolute inset-0">
      <Canvas
        dpr={[1, quality === "high" ? 2 : 1.5]}
        camera={{ position: [0, 0, 7.6], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        frameloop={active ? "always" : "never"}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
        }}
      >
        <Suspense fallback={null}>
          <SceneLighting theme={theme} reduced={reduced} quality={quality} />
          <Sculpture
            theme={theme}
            quality={quality}
            reduced={reduced}
            hostRef={hostRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
