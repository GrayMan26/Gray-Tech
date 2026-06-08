import type { NextConfig } from "next";

// GitHub Pages requires basePath when repo name is not username.github.io format
// Cloudflare Pages serves from root, so basePath should be empty
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  output: "export",           // ✅ static export mode
  basePath: basePath,         // ✅ conditional basePath for GitHub Pages vs Cloudflare
  trailingSlash: true,        // ✅ ensures all routes end with /
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,        // ✅ required for static export (no image optimization server)
  },
};

export default nextConfig;
