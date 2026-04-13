import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { getSourceTabs, source } from "@/lib/source";
import { baseOptions } from "@/lib/layout.shared";
import AppLink from "@/components/app-link";
import {
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  getMetadataBase,
} from "@/lib/seo";

import "./global.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "財經",
    "投資",
    "早晨財經速解讀",
    "市場觀察",
    "投資筆記",
    "金融市場",
  ],
  authors: [{ name: "蘭斯" }],
  creator: "蘭斯",
  publisher: "蘭斯的財經記事本",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: SITE_LOCALE.replace("-", "_"),
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: "#0f172a",
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-TW" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          components={{
            Link: AppLink,
          }}
          search={{
            enabled: false, // disable search entirely
          }}>
          <DocsLayout
            tree={source.pageTree}
            sidebar={{
              prefetch: false,
            }}
            tabs={getSourceTabs(source.pageTree)}
            {...baseOptions()}>
            {children}
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
