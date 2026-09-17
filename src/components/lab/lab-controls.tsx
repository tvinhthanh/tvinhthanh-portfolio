"use client";

import { TIERS } from "./models/architecture-blade";
import type { LabModelConfig, LabModelId, LabState } from "./types";
import { T, t } from "@/lib/i18n";

export const MODEL_CONFIGS: Record<LabModelId, LabModelConfig> = {
  "ai-stream": {
    id: "ai-stream",
    name: t("01. AI Stream & 28 Locales", "01. AI Streaming & 28 Ngôn Ngữ"),
    system: t("In-app LLM Assistant & Translation Pipeline", "Trợ lý LLM & Pipeline Dịch Thuật Tự Động"),
    tagline: t(
      "Real-time token streaming over HTTP/2 SSE and background automated translation orchestration across 28 localized target nodes without a translator in the loop.",
      "Luồng token thời gian thực qua HTTP/2 SSE và hệ thống điều phối biên dịch nền tự động cho 28 ngôn ngữ song song trong pvt.space.",
    ),
    stack: ["OpenAI API", "HTTP/2 SSE", "Token Streamer", "28 Locales Mesh"],
    protocol: "HTTP/2 SSE Stream",
    metric: "TTFT: 14ms · 28 Endpoints",
  },
  architecture: {
    id: "architecture",
    name: t("02. Exploded System Blade", "02. Bóc Tách Tầng Kiến Trúc"),
    system: t("Decoupled Enterprise Full-Stack Monolith", "Kiến Trúc Đa Tầng Decoupled Toàn Diện"),
    tagline: t(
      "Scroll-driven architectural disassembly: isolating the Next.js 16 SSR surface, WebSocket & Redis fan-out, NestJS microservices, and Postgres immutable ledger.",
      "Bóc tách cơ khí theo cuộn trang: phân tách trực quan tầng SSR Next.js 16, gateway WebSocket & Redis, cụm NestJS microservices và sổ cái dữ liệu bất biến.",
    ),
    stack: ["Next.js 16 SSR", "Redis Fan-out", "NestJS", "Postgres RLS"],
    protocol: "Bi-directional Bus",
    metric: "4 Isolated Tiers · 0 CLS",
  },
  "webrtc-mesh": {
    id: "webrtc-mesh",
    name: t("03. WebRTC P2P Lattice", "03. Mạng Lưới Gọi 1-1 WebRTC"),
    system: t("Signaling Hub & ICE Candidate Topology", "Điều Phối Tín Hiệu & Dự Phòng ICE"),
    tagline: t(
      "Spatial visualization of 1-to-1 WebRTC call architecture: peer connection negotiation, STUN reflexive mapping, TURN relay fallback, and seamless network reconnects.",
      "Mô hình không gian cho luồng gọi 1-1: thương lượng kết nối P2P, ánh xạ STUN reflexive, chuyển tiếp qua TURN relay và tự phục hồi khi đổi mạng.",
    ),
    stack: ["WebRTC", "ICE Gathering", "TURN Relay", "Signaling WS"],
    protocol: "SRTP / DTLS Peer Mesh",
    metric: "RTT: 18ms · 0.0% Loss",
  },
};

type Props = {
  state: LabState;
  onChange: (patch: Partial<LabState>) => void;
};

export function LabControls({ state, onChange }: Props) {
  const currentConfig = MODEL_CONFIGS[state.modelId];

  return (
    <div className="flex flex-col justify-between gap-6 p-6 sm:p-8">
      {/* System Selector Tabs */}
      <div>
        <div className="flex items-center justify-between">
          <p className="mono text-step--2 uppercase tracking-[0.14em] text-ink-faint">
            <T v={t("Select Interactive System", "Chọn Hệ Thống Kiến Trúc")} />
          </p>
          <span className="mono rounded-chip border border-accent/30 bg-accent/10 px-2 py-0.5 text-step--2 text-accent">
            {currentConfig.protocol}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {(["ai-stream", "architecture", "webrtc-mesh"] as LabModelId[]).map((id) => {
            const active = state.modelId === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange({ modelId: id })}
                className={`rounded-card border px-3 py-2.5 text-left text-step--1 transition-all duration-200 ${
                  active
                    ? "border-accent bg-accent/15 text-accent font-medium shadow-[0_0_15px_rgba(237,212,154,0.12)]"
                    : "border-line bg-surface-2 text-ink-soft hover:border-hairline hover:text-ink"
                }`}
              >
                <div className="mono text-step--2 font-medium">
                  <T v={MODEL_CONFIGS[id].name} />
                </div>
              </button>
            );
          })}
        </div>

        {/* System Name & Tagline */}
        <div className="mt-3">
          <h4 className="text-step-0 font-medium text-ink">
            <T v={currentConfig.system} />
          </h4>
          <p className="mt-1 text-step--1 leading-relaxed text-ink-soft">
            <T v={currentConfig.tagline} />
          </p>
        </div>
      </div>

      {/* Contextual System Controls */}
      <div className="rounded-card border border-line-soft bg-surface-2/70 p-4">
        {state.modelId === "ai-stream" && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="mono text-step--2 uppercase tracking-[0.12em] text-ink-faint">
                  <T v={t("LLM Stream State", "Trạng thái Stream LLM")} />
                </span>
                <span className="mono text-step--2 text-accent">
                  Mode: {state.streamState.toUpperCase()}
                </span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {[
                  { id: "streaming", label: t("Stream Prompt (SSE)", "Stream Prompt (SSE)") },
                  { id: "burst", label: t("Batch Fan-out 28x", "Đồng bộ 28 Ngôn Ngữ") },
                  { id: "idle", label: t("Standby Attention", "Chế độ Chờ (Standby)") },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => onChange({ streamState: st.id as LabState["streamState"] })}
                    className={`mono rounded-chip border px-3 py-1 text-step--2 transition-all duration-150 ${
                      state.streamState === st.id
                        ? "border-accent bg-accent text-on-accent font-medium shadow-sm"
                        : "border-line bg-paper/60 text-ink-soft hover:border-hairline hover:text-ink"
                    }`}
                  >
                    <T v={st.label} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-line-soft pt-3">
              <span className="mono text-step--2 uppercase tracking-[0.12em] text-ink-faint">
                <T v={t("Token Emission Rate", "Tốc độ phát token")} />
              </span>
              <div className="flex gap-1.5">
                {[
                  { val: 0.5, label: "20 t/s" },
                  { val: 1.0, label: "45 t/s" },
                  { val: 1.8, label: "90 t/s" },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => onChange({ streamSpeed: item.val })}
                    className={`mono rounded px-2 py-0.5 text-step--2 transition-colors ${
                      state.streamSpeed === item.val
                        ? "bg-accent/20 text-accent font-semibold"
                        : "text-ink-faint hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {state.modelId === "architecture" && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="mono text-step--2 uppercase tracking-[0.12em] text-ink-faint">
                  <T v={t("Kinetic Disassembly", "Bóc tách linh kiện kiến trúc")} />
                </span>
                <span className="mono text-step--2 text-accent tnum">
                  {Math.round(state.exploded * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={state.exploded}
                onChange={(e) => onChange({ exploded: parseFloat(e.target.value) })}
                className="mt-3 w-full accent-[#edd49a]"
              />
            </div>

            {/* Tier Highlights */}
            <div className="space-y-1.5 border-t border-line-soft pt-3">
              <span className="mono text-step--2 text-ink-faint block">
                <T v={t("Select Tier to Inspect:", "Bấm để soi tầng kiến trúc:")} />
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() =>
                      onChange({ activeTier: state.activeTier === tier.id ? null : tier.id })
                    }
                    className={`mono rounded border px-2 py-1 text-left text-step--2 transition-colors ${
                      state.activeTier === tier.id
                        ? "border-accent bg-accent/20 text-accent font-medium"
                        : "border-line bg-paper/50 text-ink-soft hover:border-hairline hover:text-ink"
                    }`}
                  >
                    {tier.tag}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-step--2 text-ink-faint italic">
              <T
                v={t(
                  "* Cuộn trang tự động điều khiển khoảng cách bung tách theo vị trí viewport.",
                  "* Page scrolling automatically drives exploded displacement.",
                )}
              />
            </p>
          </div>
        )}

        {state.modelId === "webrtc-mesh" && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="mono text-step--2 uppercase tracking-[0.12em] text-ink-faint">
                  <T v={t("ICE Session Routing", "Định tuyến phiên ICE")} />
                </span>
                <span className="mono text-step--2 text-accent">Active</span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {[
                  { id: "p2p-direct", label: t("Direct P2P (Host)", "P2P Trực tiếp (Host)") },
                  { id: "stun-reflexive", label: t("STUN Reflexive", "STUN Khảo sát") },
                  { id: "turn-relay", label: t("TURN Relay Fallback", "Chuyển tiếp qua TURN") },
                  { id: "reconnecting", label: t("Simulate Reconnect", "Mô phỏng Đổi Mạng") },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => onChange({ networkMode: mode.id as LabState["networkMode"] })}
                    className={`mono rounded-chip border px-3 py-1 text-step--2 transition-all duration-150 ${
                      state.networkMode === mode.id
                        ? "border-accent bg-accent text-on-accent font-medium shadow-sm"
                        : "border-line bg-paper/60 text-ink-soft hover:border-hairline hover:text-ink"
                    }`}
                  >
                    <T v={mode.label} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Deck & Telemetry */}
      <div className="space-y-3 border-t border-line-soft pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={state.wireframe}
                onChange={(e) => onChange({ wireframe: e.target.checked })}
                className="accent-[#edd49a]"
              />
              <span className="mono text-step--2 uppercase tracking-[0.1em] text-ink-soft">
                <T v={t("Wireframe", "Khung Dây")} />
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={state.autoRotate}
                onChange={(e) => onChange({ autoRotate: e.target.checked })}
                className="accent-[#edd49a]"
              />
              <span className="mono text-step--2 uppercase tracking-[0.1em] text-ink-soft">
                <T v={t("Auto Rotate", "Tự Xoay")} />
              </span>
            </label>
          </div>

          <div className="mono text-step--2 text-accent">
            {currentConfig.metric}
          </div>
        </div>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {currentConfig.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-chip border border-line bg-paper/60 px-2 py-0.5 text-step--2 text-ink-faint"
            >
              {tech}
            </span>
          ))}
          <span className="rounded-chip border border-accent/30 bg-accent/10 px-2 py-0.5 text-step--2 text-accent">
            Interactive Architecture
          </span>
        </div>
      </div>
    </div>
  );
}
