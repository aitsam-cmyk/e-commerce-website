import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "dummyimage.com" },
      { protocol: "http", hostname: "localhost", port: "4000" },
      { protocol: "http", hostname: "**" },
      { protocol: "https", hostname: "**" }
    ]
  }
};

export default nextConfig;
