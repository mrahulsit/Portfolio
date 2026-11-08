"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { entrance } from "./utils";

type Props = {
  theme: "light" | "dark";
  reduced: boolean;
};

const IVORY_RGB = "250,248,243";
const LIME_RGB = "205,242,43";

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

function buildTexture() {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const random = mulberry32(20261108);
  const top = height * 0.22;
  const bottom = height * 0.78;
  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const pad = (
    x: number,
    y: number,
    radius: number,
    color: string,
    glow = false
  ) => {
    ctx.save();
    if (glow) {
      ctx.shadowColor = `rgba(${LIME_RGB},0.85)`;
      ctx.shadowBlur = 7;
    }
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const trace = (startX: number, startY: number) => {
    let x = startX;
    let y = startY;
    let dir = Math.floor(random() * 4);
    const segments = 4 + Math.floor(random() * 5);

    ctx.beginPath();
    ctx.moveTo(x, y);

    for (let i = 0; i < segments; i += 1) {
      if (random() < 0.3) {
        dir = (dir + (random() < 0.5 ? 1 : 3)) % 4;
      }
      const length = 26 + random() * 120;
      const [dx, dy] = directions[dir];
      let nx = x + dx * length;
      let ny = y + dy * length;

      if (nx < 40) nx = x + length;
      if (nx > width - 40) nx = x - length;
      if (ny < top) ny = y + length;
      if (ny > bottom) ny = y - length;

      ctx.lineTo(nx, ny);
      x = nx;
      y = ny;

      if (i > 1 && random() < 0.22) {
        const branchDir = (dir + (random() < 0.5 ? 1 : 3)) % 4;
        const branchLength = 24 + random() * 70;
        const [bx, by] = directions[branchDir];
        const ex = THREE.MathUtils.clamp(
          x + bx * branchLength,
          40,
          width - 40
        );
        const ey = THREE.MathUtils.clamp(y + by * branchLength, top, bottom);
        ctx.moveTo(x, y);
        ctx.lineTo(ex, ey);
        if (random() < 0.6) {
          pad(ex, ey, 2.4, `rgba(${LIME_RGB},0.85)`, true);
        } else {
          pad(ex, ey, 2.2, `rgba(${IVORY_RGB},0.5)`);
        }
        ctx.moveTo(x, y);
      }
    }

    ctx.strokeStyle = `rgba(${IVORY_RGB},0.42)`;
    ctx.lineWidth = 1.7;
    ctx.stroke();

    if (random() < 0.8) {
      pad(x, y, 2.8, `rgba(${LIME_RGB},0.9)`, true);
    } else {
      pad(x, y, 2.6, `rgba(${IVORY_RGB},0.55)`);
    }
  };

  for (let i = 0; i < 15; i += 1) {
    trace(
      60 + random() * (width - 120),
      top + 30 + random() * (bottom - top - 60)
    );
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

export default function CircuitTraces({ theme, reduced }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  const texture = useMemo(() => buildTexture(), []);

  useEffect(() => () => texture?.dispose(), [texture]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const progress = reduced ? 1 : entrance(t, 0.3, 1.3);

    if (meshRef.current && !reduced) {
      meshRef.current.rotation.y = t * 0.05;
    }
    if (materialRef.current) {
      materialRef.current.opacity =
        progress * (theme === "dark" ? 0.55 : 0.38);
    }
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.803, 96, 96]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
