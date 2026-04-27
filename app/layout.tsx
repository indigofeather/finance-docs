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
import Script from "next/script";

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
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2574426828037254"
          async
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* ① 外部腳本，利用 next/script 讓它 async + 在 Hydration 後才載入 */}
        <Script
          src="https://fundingchoicesmessages.google.com/i/pub-2574426828037254?ers=1"
          strategy="afterInteractive"
        />

        {/* ② 內嵌腳本，把原本立即執行的 IIFE 塞進來
          用 dangerouslySetInnerHTML 可避免被 Next.js 當作 JSX 解析 */}
        <Script
          id="google-fc-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function () {
              function signalGooglefcPresent() {
                if (!window.frames['googlefcPresent']) {
                  if (document.body) {
                    const iframe = document.createElement('iframe');
                    iframe.style = 'width:0;height:0;border:none;z-index:-1000;left:-1000px;top:-1000px;';
                    iframe.style.display = 'none';
                    iframe.name = 'googlefcPresent';
                    document.body.appendChild(iframe);
                  } else {
                    setTimeout(signalGooglefcPresent, 0);
                  }
                }
              }
              signalGooglefcPresent();
            })();
          `,
          }}
        />
      </body>
    </html>
  );
}
