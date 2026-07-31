import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Generates a self-contained server bundle for Docker (copies only required node_modules)
  output: "standalone",
};

export default nextConfig;
