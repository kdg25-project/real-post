import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "localhost"],
  },
};

export default nextConfig;
