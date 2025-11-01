import { Inter } from "next/font/google";
import Script from "next/script";
import { RootProvider } from "fumadocs-ui/provider/next";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
import { baseOptions } from "@/lib/layout.shared";

import "./global.css";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-TW" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <DocsLayout tree={source.pageTree} {...baseOptions()}>
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
