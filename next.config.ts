import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",           // ✅ static export mode
  trailingSlash: true,        // ✅ ensures all routes end with /
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,        // ✅ required for static export (no image optimization server)
  },
  // ✅ No basePath or assetPrefix — Cloudflare serves from root
};

export default nextConfig;
