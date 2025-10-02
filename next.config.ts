import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use export settings for production builds
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    basePath: '/Gray-Tech',
    assetPrefix: '/Gray-Tech/',
  }),
  images: {
    unoptimized: true
  },
};

export default nextConfig;
