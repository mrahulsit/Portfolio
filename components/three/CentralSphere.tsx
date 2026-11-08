"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { entrance } from "./utils";
import { IVORY, MIDNIGHT } from "./palette";

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

  useEffect(() => () => rimMaterial.dispose(), [rimMaterial]);

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
      rimRef.current.uniforms.uColor.value.set(
        theme === "dark" ? IVORY : "#e6e2d9"
      );
      rimRef.current.uniforms.uStrength.value =
        (theme === "dark" ? 0.3 : 0.16) * progress;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.8, 96, 96]} />
        <meshPhysicalMaterial
          color={MIDNIGHT}
          metalness={0.82}
          roughness={0.26}
          clearcoat={0.55}
          clearcoatRoughness={0.4}
          reflectivity={0.75}
          envMapIntensity={theme === "dark" ? 1.25 : 1.05}
        />
      </mesh>
      <mesh scale={1.008}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <primitive object={rimMaterial} attach="material" ref={rimRef} />
      </mesh>
    </group>
  );
}
