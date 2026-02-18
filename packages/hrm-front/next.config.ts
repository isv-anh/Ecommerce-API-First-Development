import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  /**
   * @see https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
   */
  output: 'standalone'
};

export default nextConfig;
