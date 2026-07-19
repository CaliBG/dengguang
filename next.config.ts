import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;
const sharedConfig = {
  turbopack: { root: process.cwd() },
} satisfies NextConfig;

const nextConfig: NextConfig = isGitHubPages
  ? {
      ...sharedConfig,
      output: "export",
      basePath,
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : sharedConfig;

export default nextConfig;
