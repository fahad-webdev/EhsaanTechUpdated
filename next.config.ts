import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn.midjourney.com'], // Allow images from this domain
  },
};

export default nextConfig;
