"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { IVORY, LIME } from "./palette";
import { entrance } from "./utils";

type Props = {
  theme: "light" | "dark";
  reduced: boolean;
};

const PATCH_DIRECTION = new THREE.Vector3(0.12, 0.48, 0.87).normalize();
const PATCH_COSINE = Math.cos(THREE.MathUtils.degToRad(31));

function buildTopology() {
  const sphere = new THREE.SphereGeometry(1.803, 32, 22);
  const positions = sphere.getAttribute("position");
  const index = sphere.getIndex();
  const linePositions: number[] = [];
  const nodePositions: THREE.Vector3[] = [];
  const seen = new Set<string>();

  if (!index) {
    sphere.dispose();
    return {
      lines: new THREE.BufferGeometry(),
      nodes: new THREE.BufferGeometry(),
    };
  }

  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const midpoint = new THREE.Vector3();

  const addEdge = (ia: number, ib: number) => {
    const low = Math.min(ia, ib);
    const high = Math.max(ia, ib);
    const key = `${low}:${high}`;
    if (seen.has(key)) return;
    seen.add(key);

    a.fromBufferAttribute(positions, ia);
    b.fromBufferAttribute(positions, ib);
    midpoint.copy(a).add(b).multiplyScalar(0.5).normalize();

    if (Math.abs(midpoint.dot(PATCH_DIRECTION)) < PATCH_COSINE) return;

    linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);

    if (nodePositions.length < 10 && ia % 7 === 0) {
      nodePositions.push(a.clone().setLength(1.809));
    }
  };

  for (let i = 0; i < index.count; i += 3) {
    const i0 = index.getX(i);
    const i1 = index.getX(i + 1);
    const i2 = index.getX(i + 2);
    addEdge(i0, i1);
    addEdge(i1, i2);
    addEdge(i2, i0);
  }

  const lines = new THREE.BufferGeometry();
  lines.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(linePositions, 3),
  );

  const nodes = new THREE.BufferGeometry().setFromPoints(nodePositions);
  sphere.dispose();

  return { lines, nodes };
}

export default function TopologyMesh({ theme, reduced }: Props) {
  const group = useRef<THREE.Group>(null);
  const lineMaterial = useRef<THREE.LineBasicMaterial>(null);
  const pointMaterial = useRef<THREE.PointsMaterial>(null);
  const { lines, nodes } = useMemo(buildTopology, []);

  useEffect(
    () => () => {
      lines.dispose();
      nodes.dispose();
    },
    [lines, nodes],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const progress = reduced ? 1 : entrance(t, 0.45, 1.2);

    if (group.current && !reduced) {
      group.current.rotation.y = t * 0.05;
    }
    if (lineMaterial.current) {
      lineMaterial.current.opacity =
        progress * (theme === "dark" ? 0.06 : 0.045);
    }
    if (pointMaterial.current) {
      pointMaterial.current.opacity =
        progress * (theme === "dark" ? 0.5 : 0.35);
    }
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lines}>
        <lineBasicMaterial
          ref={lineMaterial}
          color={IVORY}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>
      <points geometry={nodes}>
        <pointsMaterial
          ref={pointMaterial}
          color={LIME}
          size={0.019}
          sizeAttenuation
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
