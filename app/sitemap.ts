import type { MetadataRoute } from "next";
import { source } from "@/lib/source";
import { absoluteUrl, toDate, toIsoString } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages();
  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: getLatestLastModified(),
    },
    ...pages.map((page) => ({
      url: absoluteUrl(page.url),
      lastModified: toIsoString(
        toDate(page.data.lastModified) ?? toDate(page.data.date)
      ),
    })),
  ];

  return entries;
}

function getLatestLastModified() {
  const pages = source.getPages();

  const latest = pages.reduce<Date | undefined>((acc, page) => {
    const candidate = toDate(page.data.lastModified) ?? toDate(page.data.date);
    if (!candidate) return acc;
    if (!acc) return candidate;
    return candidate > acc ? candidate : acc;
  }, undefined);

  return toIsoString(latest);
}
