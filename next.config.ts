import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  // Only apply basePath in production (for GitHub Pages)
  ...(isDev ? {} : {
    basePath: '/Gray-Tech',
    assetPrefix: '/Gray-Tech/',
  }),
  images: {
    unoptimized: true
  },
};

export default nextConfig;
