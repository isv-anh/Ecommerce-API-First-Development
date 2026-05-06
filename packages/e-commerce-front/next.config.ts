import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://i.pinimg.com/**")],
  },
  reactStrictMode: true,
  /**
   * @see https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
   */
  output: "standalone",
};

export default nextConfig;
