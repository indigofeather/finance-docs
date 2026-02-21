import type { Metadata } from "next";
import { Cards, Card } from "fumadocs-ui/components/card";
import { source } from "@/lib/source";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

type CardItem = {
  title: string;
  description: string;
  collection: string;
};

const CARD_ITEMS: CardItem[] = [
  {
    title: "蘭斯盤前資訊",
    description: "提供市場指數與盤前新聞。",
    collection: "lance-morning",
  },
  {
    title: "早晨財經速解讀",
    description: "每天早上開盤前半小時，解讀國際財經新聞時事變化。",
    collection: "yu-morning",
  },
  {
    title: "財經皓角",
    description:
      "以財經視角顛覆你對世界的想像，不求偉大理論，只為在短短十分鐘，為你熬煮一鍋知識濃湯。",
    collection: "yu-finance",
  },
  {
    title: "市場觀察",
    description: "每天早上開盤前半小時，解讀國際財經新聞時事變化。",
    collection: "yu-market",
  },
  {
    title: "小 Lin 說",
    description: "",
    collection: "lindsay",
  },
];

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const latestPagesByCollection = getLatestPagesByCollection();

  return (
    <main className="flex flex-1 justify-center" role="main">
      <div className="flex w-full max-w-6xl flex-col gap-12 px-6 py-16">
        <section className="space-y-8">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            積累所見，沉澱所得
          </h1>
          <p className="text-base sm:text-lg">{SITE_DESCRIPTION}</p>
        </section>

        <Cards>
          {CARD_ITEMS.map((item) => {
            const latestPage = latestPagesByCollection.get(item.collection);

            return (
              <Card
                key={item.title}
                title={item.title}
                description={item.description || undefined}
                href={latestPage?.url}
              >
                {latestPage ? (
                  <div className="flex flex-col ml-2 space-y-2">
                    <span className="text-md"> </span>
                    <span className="text-md">&gt; 最新文章</span>
                    <span className="block text-sm font-medium text-fd-card-foreground">
                      {latestPage.data.title}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs italic">暫無文章</span>
                )}
              </Card>
            );
          })}
        </Cards>
      </div>
    </main>
  );
}

type SourcePage = ReturnType<typeof source.getPages>[number];

function getLatestPagesByCollection() {
  const collections = new Set(CARD_ITEMS.map((item) => item.collection));
  const latestPages = new Map<string, SourcePage>();

  for (const page of source.getPages()) {
    const [collection] = page.slugs;
    if (!collection || !collections.has(collection)) {
      continue;
    }

    const currentLatest = latestPages.get(collection);
    if (!currentLatest || isNewerPage(page, currentLatest)) {
      latestPages.set(collection, page);
    }
  }

  return latestPages;
}

function isNewerPage(candidate: SourcePage, current: SourcePage) {
  const candidateTime = extractPageTime(candidate);
  const currentTime = extractPageTime(current);

  if (candidateTime !== undefined && currentTime !== undefined) {
    return candidateTime > currentTime;
  }

  if (candidateTime !== undefined) {
    return true;
  }

  if (currentTime !== undefined) {
    return false;
  }

  return candidate.url > current.url;
}

function extractPageTime(page: SourcePage) {
  const date = page.data.date;
  if (!date) {
    return undefined;
  }

  if (date instanceof Date) {
    return date.getTime();
  }

  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.getTime();
}
