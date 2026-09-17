"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  networkMode: "p2p-direct" | "stun-reflexive" | "turn-relay" | "reconnecting";
  packetJitter: number;
  wireframe: boolean;
  autoRotate: boolean;
};

export function WebrtcLattice({
  networkMode,
  packetJitter,
  wireframe,
  autoRotate,
}: Props) {
  const rootRef = useRef<THREE.Group>(null);
  const reconnectPulse = useRef(0);

  const nodes = useMemo(() => {
    return [
      { id: "peerA", label: "Peer A (Caller)", pos: [-1.4, 0.4, 0] as [number, number, number], type: "peer" },
      { id: "peerB", label: "Peer B (Callee)", pos: [1.4, 0.4, 0] as [number, number, number], type: "peer" },
      { id: "signal", label: "Signaling Hub (NestJS)", pos: [0, 1.3, 0] as [number, number, number], type: "server" },
      { id: "stun", label: "STUN (ICE Server)", pos: [-0.6, -1.1, 0.6] as [number, number, number], type: "infra" },
      { id: "turn", label: "TURN Relay (Media)", pos: [0.6, -1.1, -0.6] as [number, number, number], type: "infra" },
    ];
  }, []);

  const materials = useMemo(() => {
    return {
      peer: new THREE.MeshStandardMaterial({
        color: "#edd49a",
        emissive: "#b8974a",
        emissiveIntensity: 0.6,
        metalness: 0.9,
        roughness: 0.15,
        wireframe,
      }),
      server: new THREE.MeshStandardMaterial({
        color: "#fbf6e8",
        emissive: "#edd49a",
        emissiveIntensity: 0.8,
        metalness: 0.7,
        roughness: 0.2,
        wireframe,
      }),
      infra: new THREE.MeshStandardMaterial({
        color: "#1c262a",
        metalness: 0.85,
        roughness: 0.35,
        wireframe,
      }),
      lineDirect: new THREE.LineBasicMaterial({
        color: "#edd49a",
        linewidth: 2,
        transparent: true,
        opacity: 0.9,
      }),
      lineRelay: new THREE.LineBasicMaterial({
        color: "#6c8590",
        linewidth: 1.5,
        transparent: true,
        opacity: 0.6,
      }),
    };
  }, [wireframe]);

  // Connection geometry lines
  const lineGeometries = useMemo(() => {
    // Direct P2P line (Peer A <-> Peer B)
    const p2pGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.4, 0.4, 0),
      new THREE.Vector3(1.4, 0.4, 0),
    ]);

    // Signaling lines (Peer A <-> Signal, Peer B <-> Signal)
    const signalGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.4, 0.4, 0),
      new THREE.Vector3(0, 1.3, 0),
      new THREE.Vector3(0, 1.3, 0),
      new THREE.Vector3(1.4, 0.4, 0),
    ]);

    // TURN relay lines (Peer A <-> TURN <-> Peer B)
    const turnGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.4, 0.4, 0),
      new THREE.Vector3(0.6, -1.1, -0.6),
      new THREE.Vector3(0.6, -1.1, -0.6),
      new THREE.Vector3(1.4, 0.4, 0),
    ]);

    return { p2pGeo, signalGeo, turnGeo };
  }, []);

  useFrame((_, delta) => {
    if (autoRotate && rootRef.current) {
      rootRef.current.rotation.y += delta * (0.2 + packetJitter * 0.5);
    }
    reconnectPulse.current += delta * 4;
  });

  const isReconnecting = networkMode === "reconnecting";
  const isTurn = networkMode === "turn-relay";

  return (
    <group ref={rootRef} scale={1.2} dispose={null}>
      {/* Node Spheres */}
      {nodes.map((n) => {
        const mat =
          n.type === "peer"
            ? materials.peer
            : n.type === "server"
            ? materials.server
            : materials.infra;

        return (
          <group key={n.id} position={n.pos}>
            <mesh>
              {n.type === "server" ? (
                <octahedronGeometry args={[0.22, 0]} />
              ) : n.type === "peer" ? (
                <sphereGeometry args={[0.18, 16, 16]} />
              ) : (
                <boxGeometry args={[0.22, 0.22, 0.22]} />
              )}
              <primitive object={mat} attach="material" />
            </mesh>

            {/* Orbital halo around peers */}
            {n.type === "peer" && (
              <mesh rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[0.26, 0.008, 16, 32]} />
                <primitive object={materials.lineDirect} attach="material" />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Network Beam Lines */}
      {/* Signaling Beams */}
      <lineSegments geometry={lineGeometries.signalGeo}>
        <primitive object={materials.lineRelay} attach="material" />
      </lineSegments>

      {/* Active Data Beam */}
      {!isTurn && !isReconnecting && (
        <lineSegments geometry={lineGeometries.p2pGeo}>
          <primitive object={materials.lineDirect} attach="material" />
        </lineSegments>
      )}

      {isTurn && (
        <lineSegments geometry={lineGeometries.turnGeo}>
          <primitive object={materials.lineDirect} attach="material" />
        </lineSegments>
      )}

      {/* Point lights on Peers */}
      <pointLight position={[-1.4, 0.4, 0.2]} color="#edd49a" intensity={4} distance={3} />
      <pointLight position={[1.4, 0.4, 0.2]} color="#edd49a" intensity={4} distance={3} />
      <pointLight position={[0, 1.3, 0.2]} color="#fbf6e8" intensity={6} distance={4} />
    </group>
  );
}
