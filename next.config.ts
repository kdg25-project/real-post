import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL(process.env.NEXT_PUBLIC_R2_PUBLIC_URL + "/**" || "http://localhost")],
  },
};

export default withNextIntl(nextConfig);
