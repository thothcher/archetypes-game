// Static export for GitHub Pages. The site is served from /<repo>/, so the deploy
// workflow sets PAGES_BASE_PATH=/archetypes-game; locally it stays at the root.
const basePath = process.env.PAGES_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};
export default nextConfig;
