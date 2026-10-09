// Static export for GitHub Pages. The site is served from /<repo>/, so the deploy
// sets PAGES_BASE_PATH=/archetypes-game; locally it stays at the root.
const basePath = process.env.PAGES_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  poweredByHeader: false,
  experimental: {
    // ~25 KB of CSS goes straight into the HTML: no render-blocking stylesheet request.
    inlineCss: true,
  },
};
export default nextConfig;
