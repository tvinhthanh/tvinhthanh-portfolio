"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { StreamMatrix } from "./models/stream-matrix";
import { ArchitectureBlade } from "./models/architecture-blade";
import { WebrtcLattice } from "./models/webrtc-lattice";
import type { LabState } from "./types";

type Props = {
  state: LabState;
  isIntersecting: boolean;
};

function LoadingFallback() {
  return (
    <mesh>
      <octahedronGeometry args={[0.5, 1]} />
      <meshBasicMaterial color="#edd49a" wireframe />
    </mesh>
  );
}

export function LabCanvas({ state, isIntersecting }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 4.2], fov: 45 }}
      dpr={[1, 1.5]}
      frameloop={isIntersecting ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="h-full w-full"
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 4]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-4, -3, -3]} intensity={1.2} color="#edd49a" />
      <pointLight position={[0, 3, 2]} intensity={0.6} color="#fff" />

      <Suspense fallback={<LoadingFallback />}>
        {state.modelId === "ai-stream" && (
          <StreamMatrix
            streamState={state.streamState}
            streamSpeed={state.streamSpeed}
            wireframe={state.wireframe}
            autoRotate={state.autoRotate}
          />
        )}

        {state.modelId === "architecture" && (
          <ArchitectureBlade
            exploded={state.exploded}
            activeTier={state.activeTier}
            wireframe={state.wireframe}
            autoRotate={state.autoRotate}
          />
        )}

        {state.modelId === "webrtc-mesh" && (
          <WebrtcLattice
            networkMode={state.networkMode}
            packetJitter={state.packetJitter}
            wireframe={state.wireframe}
            autoRotate={state.autoRotate}
          />
        )}

        <ContactShadows
          position={[0, -1.65, 0]}
          opacity={0.5}
          scale={7}
          blur={2}
          far={3.5}
          color="#0d1417"
        />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={2.0}
        maxDistance={7.5}
        autoRotate={false}
        makeDefault
      />
    </Canvas>
  );
}
