import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Development only: the default bottom-left badge sat on the floor plan's
  // lobby station. Production never renders it.
  devIndicators: { position: "top-right" },
};

export default nextConfig;
