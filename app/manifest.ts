import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "財經記事本",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "minimal-ui",
    background_color: "#ffffff",
    theme_color: "#0f172a",
    icons: [
      {
        src: "/icon.svg",
        sizes: "192x192",
        type: "image/svg",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    scope: "/",
    id: absoluteUrl("/"),
  };
}
