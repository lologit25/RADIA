import type { NextConfig } from "next";

// The site is fully static, so it is exported as plain files (the `out` folder)
// and can be hosted on any static host such as Cloudflare Pages.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
