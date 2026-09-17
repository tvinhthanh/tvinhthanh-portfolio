"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  exploded: number; // 0.0 to 1.0
  activeTier: number | null;
  wireframe: boolean;
  autoRotate: boolean;
};

export const TIERS = [
  {
    id: 1,
    name: "Tier 1: Next.js 16 App Router",
    role: "SSR Surface, Edge Streaming & Hydration Boundary (0 CLS)",
    tag: "EDGE / SSR",
  },
  {
    id: 2,
    name: "Tier 2: Realtime Gateway",
    role: "WebSocket, Redis Fan-out & SSE Token Emitter",
    tag: "WS / REDIS",
  },
  {
    id: 3,
    name: "Tier 3: NestJS Microservices",
    role: "WebRTC ICE Signaling, Auth Guards & Worker Queues (BullMQ)",
    tag: "NESTJS / QUEUE",
  },
  {
    id: 4,
    name: "Tier 4: Deterministic Store",
    role: "Postgres RLS / MongoDB, Immutable Audit Ledger & Idempotency",
    tag: "LEDGER / DB",
  },
] as const;

export function ArchitectureBlade({
  exploded,
  activeTier,
  wireframe,
  autoRotate,
}: Props) {
  const rootRef = useRef<THREE.Group>(null);
  const smoothExploded = useRef(exploded);

  const tier1 = useRef<THREE.Group>(null);
  const tier2 = useRef<THREE.Group>(null);
  const tier3 = useRef<THREE.Group>(null);
  const tier4 = useRef<THREE.Group>(null);

  const materials = useMemo(() => {
    return {
      hull: new THREE.MeshStandardMaterial({
        color: "#182124",
        metalness: 0.88,
        roughness: 0.22,
        wireframe,
      }),
      accent: new THREE.MeshStandardMaterial({
        color: "#edd49a",
        metalness: 0.95,
        roughness: 0.15,
        wireframe,
      }),
      activeHighlight: new THREE.MeshStandardMaterial({
        color: "#fff0c7",
        emissive: "#edd49a",
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.1,
        wireframe,
      }),
      glass: new THREE.MeshStandardMaterial({
        color: "#283b42",
        metalness: 0.4,
        roughness: 0.1,
        wireframe,
      }),
      rod: new THREE.MeshStandardMaterial({
        color: "#edd49a",
        metalness: 0.9,
        roughness: 0.2,
      }),
    };
  }, [wireframe]);

  useFrame((_, delta) => {
    smoothExploded.current = THREE.MathUtils.lerp(
      smoothExploded.current,
      exploded,
      Math.min(delta * 8, 1)
    );
    const exp = smoothExploded.current;

    // Vertical expansion per tier
    if (tier1.current) tier1.current.position.y = 0.65 + exp * 1.35;
    if (tier2.current) tier2.current.position.y = 0.22 + exp * 0.45;
    if (tier3.current) tier3.current.position.y = -0.22 - exp * 0.45;
    if (tier4.current) tier4.current.position.y = -0.65 - exp * 1.35;

    if (autoRotate && rootRef.current) {
      rootRef.current.rotation.y += delta * 0.35;
    }
  });

  const getMat = (tierIndex: number, defaultMat: THREE.Material) => {
    return activeTier === tierIndex ? materials.activeHighlight : defaultMat;
  };

  return (
    <group ref={rootRef} scale={1.25} dispose={null}>
      {/* Central Connecting Bus Rods */}
      {[-0.55, 0.55].map((x) =>
        [-0.35, 0.35].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0, z]}>
            <cylinderGeometry args={[0.018, 0.018, 3.8, 12]} />
            <primitive object={materials.rod} attach="material" />
          </mesh>
        ))
      )}

      {/* Tier 1: SSR Surface (Next.js 16) */}
      <group ref={tier1} position={[0, 0.65, 0]}>
        <mesh>
          <boxGeometry args={[1.5, 0.22, 1.0]} />
          <primitive object={getMat(1, materials.glass)} attach="material" />
        </mesh>
        {/* Beveled Top Crown */}
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[1.35, 0.04, 0.85]} />
          <primitive object={getMat(1, materials.accent)} attach="material" />
        </mesh>
      </group>

      {/* Tier 2: Realtime Gateway (WebSocket & Redis) */}
      <group ref={tier2} position={[0, 0.22, 0]}>
        <mesh>
          <boxGeometry args={[1.45, 0.24, 0.95]} />
          <primitive object={getMat(2, materials.hull)} attach="material" />
        </mesh>
        {/* Signal Conduits */}
        {[-0.4, 0, 0.4].map((x) => (
          <mesh key={x} position={[x, 0, 0.5]}>
            <cylinderGeometry args={[0.04, 0.04, 0.08, 16]} />
            <primitive object={getMat(2, materials.accent)} attach="material" />
          </mesh>
        ))}
      </group>

      {/* Tier 3: NestJS Microservices & WebRTC */}
      <group ref={tier3} position={[0, -0.22, 0]}>
        <mesh>
          <boxGeometry args={[1.45, 0.26, 0.95]} />
          <primitive object={getMat(3, materials.hull)} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.52, 0.08, 0.7]} />
          <primitive object={getMat(3, materials.accent)} attach="material" />
        </mesh>
      </group>

      {/* Tier 4: Immutable Data Store (Postgres / Mongo) */}
      <group ref={tier4} position={[0, -0.65, 0]}>
        <mesh>
          <boxGeometry args={[1.55, 0.32, 1.05]} />
          <primitive object={getMat(4, materials.hull)} attach="material" />
        </mesh>
        <mesh position={[0, -0.18, 0]}>
          <boxGeometry args={[1.4, 0.06, 0.9]} />
          <primitive object={getMat(4, materials.accent)} attach="material" />
        </mesh>
      </group>
    </group>
  );
}
