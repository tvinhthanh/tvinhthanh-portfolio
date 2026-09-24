"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  exploded: number; // 0.0 to 1.0
  wireframe: boolean;
  autoRotate: boolean;
};

type Materials = {
  carbonTub: THREE.MeshStandardMaterial;
  bodywork: THREE.MeshStandardMaterial;
  aeroGold: THREE.MeshStandardMaterial;
  glass: THREE.MeshPhysicalMaterial;
  tireRubber: THREE.MeshStandardMaterial;
  wheelRim: THREE.MeshStandardMaterial;
  brakeDisc: THREE.MeshStandardMaterial;
  brakeCaliper: THREE.MeshStandardMaterial;
  powertrainCore: THREE.MeshStandardMaterial;
};

function Wheel({
  groupRef,
  pos,
  materials,
}: {
  groupRef: React.RefObject<THREE.Group | null>;
  pos: [number, number, number];
  materials: Materials;
}) {
  return (
    <group ref={groupRef} position={pos}>
      {/* Tire */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.34, 0.34, 0.26, 24]} />
        <primitive object={materials.tireRubber} attach="material" />
      </mesh>
      {/* Rim */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 0.27, 16]} />
        <primitive object={materials.wheelRim} attach="material" />
      </mesh>
      {/* Brake Disc */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.21, 16]} />
        <primitive object={materials.brakeDisc} attach="material" />
      </mesh>
      {/* Brake Caliper */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.22, 0.08, 0.09]} />
        <primitive object={materials.brakeCaliper} attach="material" />
      </mesh>
    </group>
  );
}

export function AeroChassis({ exploded, wireframe, autoRotate }: Props) {
  const rootRef = useRef<THREE.Group>(null);
  const canopyRef = useRef<THREE.Group>(null);
  const rearWingRef = useRef<THREE.Group>(null);
  const frontSplitterRef = useRef<THREE.Group>(null);
  const wheelFL = useRef<THREE.Group>(null);
  const wheelFR = useRef<THREE.Group>(null);
  const wheelRL = useRef<THREE.Group>(null);
  const wheelRR = useRef<THREE.Group>(null);

  const smoothExploded = useRef(exploded);

  const materials: Materials = useMemo(() => {
    return {
      carbonTub: new THREE.MeshStandardMaterial({
        color: "#111416",
        metalness: 0.9,
        roughness: 0.25,
        wireframe,
      }),
      bodywork: new THREE.MeshStandardMaterial({
        color: "#161b1e",
        metalness: 0.85,
        roughness: 0.15,
        wireframe,
      }),
      aeroGold: new THREE.MeshStandardMaterial({
        color: "#edd49a",
        metalness: 0.95,
        roughness: 0.1,
        wireframe,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#0a1114",
        metalness: 0.2,
        roughness: 0.05,
        transmission: 0.75,
        transparent: true,
        opacity: 0.8,
        wireframe,
      }),
      tireRubber: new THREE.MeshStandardMaterial({
        color: "#1a1a1a",
        roughness: 0.85,
        metalness: 0.05,
        wireframe,
      }),
      wheelRim: new THREE.MeshStandardMaterial({
        color: "#edd49a",
        metalness: 0.95,
        roughness: 0.18,
        wireframe,
      }),
      brakeDisc: new THREE.MeshStandardMaterial({
        color: "#4a5358",
        metalness: 0.9,
        roughness: 0.3,
        wireframe,
      }),
      brakeCaliper: new THREE.MeshStandardMaterial({
        color: "#d4a755",
        metalness: 0.8,
        roughness: 0.2,
        wireframe,
      }),
      powertrainCore: new THREE.MeshStandardMaterial({
        color: "#edd49a",
        emissive: "#c99a3e",
        emissiveIntensity: 0.7,
        metalness: 0.6,
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

    // Exploded bodywork kinematics
    if (canopyRef.current) {
      canopyRef.current.position.y = 0.35 + exp * 1.4;
      canopyRef.current.position.z = -exp * 0.5;
    }
    if (rearWingRef.current) {
      rearWingRef.current.position.y = 0.55 + exp * 0.9;
      rearWingRef.current.position.z = -1.45 - exp * 0.7;
    }
    if (frontSplitterRef.current) {
      frontSplitterRef.current.position.z = 1.45 + exp * 0.8;
      frontSplitterRef.current.position.y = -0.15 - exp * 0.3;
    }

    // Wheels decouple outward
    const wheelOffset = exp * 0.75;
    if (wheelFL.current) wheelFL.current.position.x = -0.95 - wheelOffset;
    if (wheelFR.current) wheelFR.current.position.x = 0.95 + wheelOffset;
    if (wheelRL.current) wheelRL.current.position.x = -0.98 - wheelOffset;
    if (wheelRR.current) wheelRR.current.position.x = 0.98 + wheelOffset;

    if (autoRotate && rootRef.current) {
      rootRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={rootRef} scale={1.15} position={[0, -0.1, 0]} dispose={null}>
      {/* ---------------- BASE MONOCOQUE TUB ---------------- */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.35, 0.26, 2.7]} />
        <primitive object={materials.carbonTub} attach="material" />
      </mesh>

      {/* Internal Electric Powertrain & Battery Cell */}
      <mesh position={[0, 0.12, -0.3]}>
        <boxGeometry args={[0.85, 0.24, 1.2]} />
        <primitive object={materials.powertrainCore} attach="material" />
      </mesh>

      {/* Internal High-Voltage Bus Conduit */}
      <mesh position={[0, 0.25, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.4, 12]} />
        <primitive object={materials.aeroGold} attach="material" />
      </mesh>

      {/* ---------------- DECOUPLING WHEELS ---------------- */}
      <Wheel groupRef={wheelFL} pos={[-0.95, -0.05, 0.9]} materials={materials} />
      <Wheel groupRef={wheelFR} pos={[0.95, -0.05, 0.9]} materials={materials} />
      <Wheel groupRef={wheelRL} pos={[-0.98, -0.05, -0.9]} materials={materials} />
      <Wheel groupRef={wheelRR} pos={[0.98, -0.05, -0.9]} materials={materials} />

      {/* ---------------- FRONT AERO SPLITTER ---------------- */}
      <group ref={frontSplitterRef} position={[0, -0.15, 1.45]}>
        <mesh>
          <boxGeometry args={[1.7, 0.04, 0.45]} />
          <primitive object={materials.bodywork} attach="material" />
        </mesh>
        {/* Amber aero winglets */}
        {[-0.85, 0.85].map((x) => (
          <mesh key={x} position={[x, 0.08, 0]}>
            <boxGeometry args={[0.04, 0.16, 0.35]} />
            <primitive object={materials.aeroGold} attach="material" />
          </mesh>
        ))}
      </group>

      {/* ---------------- COCKPIT CANOPY & ROOF HOOD ---------------- */}
      <group ref={canopyRef} position={[0, 0.35, 0]}>
        {/* Main Aerodynamic Teardrop Cockpit */}
        <mesh position={[0, 0.12, 0.1]}>
          <boxGeometry args={[1.2, 0.35, 1.6]} />
          <primitive object={materials.bodywork} attach="material" />
        </mesh>

        {/* Tinted Canopy Windshield */}
        <mesh position={[0, 0.24, 0.35]} rotation={[-0.45, 0, 0]}>
          <boxGeometry args={[0.95, 0.06, 0.75]} />
          <primitive object={materials.glass} attach="material" />
        </mesh>

        {/* Roof Air Intake Scoop */}
        <mesh position={[0, 0.38, -0.3]}>
          <boxGeometry args={[0.35, 0.14, 0.6]} />
          <primitive object={materials.aeroGold} attach="material" />
        </mesh>
      </group>

      {/* ---------------- REAR ACTIVE AERO WING ---------------- */}
      <group ref={rearWingRef} position={[0, 0.55, -1.45]}>
        {/* Wing Blade */}
        <mesh>
          <boxGeometry args={[1.85, 0.04, 0.38]} />
          <primitive object={materials.aeroGold} attach="material" />
        </mesh>
        {/* Endplates */}
        {[-0.92, 0.92].map((x) => (
          <mesh key={x} position={[x, 0.04, 0]}>
            <boxGeometry args={[0.03, 0.22, 0.38]} />
            <primitive object={materials.bodywork} attach="material" />
          </mesh>
        ))}
        {/* Pylon Mounts */}
        {[-0.4, 0.4].map((x) => (
          <mesh key={x} position={[x, -0.22, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.42, 8]} />
            <primitive object={materials.carbonTub} attach="material" />
          </mesh>
        ))}
      </group>
    </group>
  );
}
