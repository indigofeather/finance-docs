import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl, withBasePath } from "@/lib/seo";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "財經記事本",
    description: SITE_DESCRIPTION,
    start_url: withBasePath("/"),
    display: "minimal-ui",
    background_color: "#ffffff",
    theme_color: "#0f172a",
    icons: [
      {
        src: withBasePath("/icon.svg"),
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: withBasePath("/icon-512.png"),
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: withBasePath("/apple-icon.png"),
        sizes: "180x180",
        type: "image/png",
      },
    ],
    scope: withBasePath("/"),
    id: absoluteUrl("/"),
  };
}
