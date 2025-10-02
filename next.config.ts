import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  // GitHub Pages deployment settings
  ...(isProduction && isGitHubPages && {
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
