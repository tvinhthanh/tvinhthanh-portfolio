import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.nameLatin} — frontend & full-stack developer`;

/** Dark palette and lattice motif from the site itself, so the share card
 *  reads as a piece of the page rather than a generic banner. */
export default function OpengraphImage() {
  const dots = [];
  for (let x = 0; x < 46; x++) {
    for (let y = 0; y < 9; y++) {
      const wave = Math.sin(x * 0.42) * Math.cos(y * 0.5 + x * 0.08);
      const r = 1.4 + Math.abs(wave) * 3.4;
      dots.push(
        <div
          key={`${x}-${y}`}
          style={{
            position: "absolute",
            left: 60 + x * 24,
            top: 372 + y * 24,
            width: r * 2,
            height: r * 2,
            borderRadius: r * 2,
            backgroundColor: "#52d6ae",
            opacity: 0.18 + Math.abs(wave) * 0.62,
            display: "flex",
          }}
        />,
      );
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0d0f13",
          color: "#e9e7e3",
          padding: "70px 60px",
          position: "relative",
        }}
      >
        {dots}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 5, color: "#52d6ae" }}>
            {"OPEN TO WORK / HO CHI MINH CITY"}
          </div>
          <div style={{ display: "flex", fontSize: 96, marginTop: 26, letterSpacing: -2 }}>
            {profile.nameLatin}
          </div>
          <div style={{ display: "flex", fontSize: 38, color: "#9d9a95", marginTop: 16 }}>
            Frontend & Full-stack Engineer
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#7e7b76" }}>
          {"Next.js · NestJS · PostgreSQL · Redis · WebSocket · Three.js"}
        </div>
      </div>
    ),
    size,
  );
}
