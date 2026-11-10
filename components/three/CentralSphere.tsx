"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { entrance } from "./utils";
import { IVORY, LIME, MIDNIGHT } from "./palette";

type Props = {
  theme: "light" | "dark";
  reduced: boolean;
};

const rimVertex = `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mv;
  }
`;

const rimFragment = `
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float fresnel = pow(1.0 - clamp(dot(normalize(vNormal), normalize(vView)), 0.0, 1.0), 2.4);
    gl_FragColor = vec4(uColor, fresnel * uStrength);
  }
`;

/**
 * Atmosphere: rendered on the back faces of a slightly larger shell. The
 * glow peaks just outside the sphere's silhouette and falls to zero at the
 * shell's own edge, giving a soft halo without any post-processing.
 */
const haloFragment = `
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float facing = clamp(-dot(normalize(vNormal), normalize(vView)), 0.0, 1.0);
    float glow = smoothstep(0.0, 0.5, facing);
    gl_FragColor = vec4(uColor, glow * glow * uStrength);
  }
`;

const HALO_SCALE = 1.16;

export default function CentralSphere({ theme, reduced }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const rimRef = useRef<THREE.ShaderMaterial>(null);

  const rimMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color(IVORY) },
          uStrength: { value: 0 },
        },
        vertexShader: rimVertex,
        fragmentShader: rimFragment,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  const haloMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color(LIME) },
          uStrength: { value: 0 },
        },
        vertexShader: rimVertex,
        fragmentShader: haloFragment,
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    []
  );

  useEffect(
    () => () => {
      rimMaterial.dispose();
      haloMaterial.dispose();
    },
    [rimMaterial, haloMaterial]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const progress = reduced ? 1 : entrance(t, 0, 1.2);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(0.86 + 0.14 * progress);
    }
    if (sphereRef.current && !reduced) {
      sphereRef.current.rotation.y = t * 0.05;
    }
    if (rimRef.current) {
      // The rim sits on the sphere itself, so it matches across themes.
      rimRef.current.uniforms.uStrength.value = 0.3 * progress;
    }
    const breathe = reduced ? 1 : 0.85 + 0.15 * Math.sin(t * 0.6);
    haloMaterial.uniforms.uColor.value.set(
      theme === "dark" ? "#b9dc2a" : "#d6ef6a"
    );
    haloMaterial.uniforms.uStrength.value =
      (theme === "dark" ? 0.16 : 0.13) * progress * breathe;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.8, 96, 96]} />
        {/* Same polished obsidian finish in both themes. */}
        <meshPhysicalMaterial
          color={MIDNIGHT}
          metalness={0.82}
          roughness={0.3}
          clearcoat={0.8}
          clearcoatRoughness={0.12}
          reflectivity={0.75}
          envMapIntensity={1.25}
        />
      </mesh>
      <mesh scale={1.008}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <primitive object={rimMaterial} attach="material" ref={rimRef} />
      </mesh>
      <mesh scale={HALO_SCALE} material={haloMaterial} renderOrder={-1}>
        <sphereGeometry args={[1.8, 64, 64]} />
      </mesh>
    </group>
  );
}
