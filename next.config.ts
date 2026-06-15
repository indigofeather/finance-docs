import { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || undefined;

const config: NextConfig = {
  output: "export",
  poweredByHeader: false,
  reactStrictMode: true,
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
  images: {
    unoptimized: true,
    remotePatterns: [new URL("https://www.books.com.tw/**")],
  },
};

export default withMDX(config);
