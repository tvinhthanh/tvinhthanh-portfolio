import type { L } from "@/lib/i18n";

export type LabModelId = "ai-stream" | "architecture" | "webrtc-mesh";

export type LabModelConfig = {
  id: LabModelId;
  name: L;
  system: L;
  tagline: L;
  stack: string[];
  protocol: string;
  metric: string;
};

export type LabState = {
  modelId: LabModelId;
  // AI Stream controls
  streamState: "streaming" | "burst" | "idle";
  streamSpeed: number;
  // Architecture controls
  exploded: number; // 0.0 to 1.0
  activeTier: number | null; // 1, 2, 3, 4
  // WebRTC controls
  networkMode: "p2p-direct" | "stun-reflexive" | "turn-relay" | "reconnecting";
  packetJitter: number;
  // Global controls
  wireframe: boolean;
  autoRotate: boolean;
};
