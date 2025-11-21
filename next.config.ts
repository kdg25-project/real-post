import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(process.env.NEXT_PUBLIC_R2_PUBLIC_URL + "/**" || "http://localhost")
    ]
  }
};

export default nextConfig;
