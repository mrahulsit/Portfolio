"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CHARCOAL, IVORY, LIME } from "./palette";
import { entrance } from "./utils";

type Props = {
  theme: "light" | "dark";
  reduced: boolean;
  quality: "high" | "low";
};

/** Deterministic PRNG so the field is identical on every load. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const vertexShader = `
  attribute float aSize;
  attribute float aLime;
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vLime;
  varying float vTwinkle;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (8.0 / -mv.z);
    vLime = aLime;
    vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed * 0.9) + aSeed * 40.0);
  }
`;

const fragmentShader = `
  uniform vec3 uBase;
  uniform vec3 uLime;
  uniform float uOpacity;
  varying float vLime;
  varying float vTwinkle;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float alpha = smoothstep(0.5, 0.0, d);
    vec3 color = mix(uBase, uLime, vLime);
    gl_FragColor = vec4(color, alpha * uOpacity * vTwinkle * mix(0.7, 1.0, vLime));
  }
`;

/**
 * A sparse shell of drifting motes around the sculpture. Adds parallax depth
 * and a sense of scale without competing with the sphere.
 */
export default function DustField({ theme, reduced, quality }: Props) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = quality === "high" ? 220 : 110;

  const geometry = useMemo(() => {
    const random = mulberry32(7);
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const lime = new Float32Array(count);
    const seeds = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      // Uniform direction, radius biased toward the inner part of the shell.
      const u = random() * 2 - 1;
      const theta = random() * Math.PI * 2;
      const r = 2.2 + Math.pow(random(), 1.6) * 1.15;
      const s = Math.sqrt(1 - u * u);
      positions[i * 3] = s * Math.cos(theta) * r;
      positions[i * 3 + 1] = u * r * 0.82;
      positions[i * 3 + 2] = s * Math.sin(theta) * r;
      const isLime = random() < 0.12;
      lime[i] = isLime ? 1 : 0;
      sizes[i] = isLime ? 2.6 + random() * 1.6 : 1.4 + random() * 1.8;
      seeds[i] = random();
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("aLime", new THREE.BufferAttribute(lime, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: 1 },
          uOpacity: { value: 0 },
          uBase: { value: new THREE.Color(IVORY) },
          uLime: { value: new THREE.Color(LIME) },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
      }),
    []
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const progress = reduced ? 1 : entrance(t, 1.1, 1.6);
    const dark = theme === "dark";

    material.uniforms.uTime.value = reduced ? 0 : t;
    material.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    material.uniforms.uOpacity.value = progress * (dark ? 0.55 : 0.22);
    material.uniforms.uBase.value.set(dark ? IVORY : CHARCOAL);
    material.uniforms.uLime.value.set(dark ? LIME : "#9fbf10");

    if (pointsRef.current && !reduced) {
      pointsRef.current.rotation.y = t * -0.018;
      pointsRef.current.rotation.x = Math.sin(t * 0.07) * 0.05;
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
