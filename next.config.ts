import type { NextConfig } from "next";

// The site is fully static, so it is exported as plain files (the `out` folder)
// and can be hosted on any static host such as Cloudflare Pages.
const nextConfig: NextConfig = {
  output: "export",
  // Every page becomes <route>/index.html, so a route and its data files share
  // one folder and static hosts never bounce between /route and /route/.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
