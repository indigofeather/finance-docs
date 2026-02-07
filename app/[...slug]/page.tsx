import { source } from "@/lib/source";
import { DocsBody, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { SITE_NAME, absoluteUrl, toDate, toIsoString } from "@/lib/seo";

export default async function Page(props: PageProps<"/[...slug]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const publishedAt = toDate(page.data.date);
  const lastModifiedAt = toDate(page.data.lastModified) ?? publishedAt;
  const canonicalUrl = absoluteUrl(page.url);
  const authors = getPageAuthors(page);
  const jsonLd = createArticleJsonLd({
    title: page.data.title,
    canonicalUrl,
    publishedAt,
    modifiedAt: lastModifiedAt,
    authors,
  });

  return (
    <DocsPage
      toc={page.data.toc}
      tableOfContent={{
        style: "clerk",
      }}
      full={page.data.full}
      lastUpdate={lastModifiedAt}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams().filter((params) => params.slug.length > 0);
}

export async function generateMetadata(
  props: PageProps<"/[...slug]">
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const publishedAt = toDate(page.data.date);
  const lastModifiedAt = toDate(page.data.lastModified) ?? publishedAt;
  const canonicalUrl = absoluteUrl(page.url);
  const authorNames = getPageAuthors(page).map((author) => author.name);

  return {
    title: page.data.title,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      title: page.data.title,
      url: canonicalUrl,
      publishedTime: toIsoString(publishedAt),
      modifiedTime: toIsoString(lastModifiedAt),
      authors: authorNames,
      tags: page.data.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
    },
  };
}

type SourcePage = ReturnType<typeof source.getPages>[number];

type PageAuthor = { name: string; image?: string };

function hasAuthorArray(
  data: SourcePage["data"]
): data is SourcePage["data"] & { authors: unknown[] } {
  return Array.isArray((data as { authors?: unknown }).authors);
}

function toPageAuthor(entry: unknown): PageAuthor | undefined {
  if (typeof entry !== "object" || entry === null) return undefined;

  const { name, image } = entry as {
    name?: unknown;
    image?: unknown;
  };

  if (typeof name !== "string" || name.trim().length === 0) return undefined;

  const author: PageAuthor = { name: name.trim() };

  if (typeof image === "string" && image.trim().length > 0) {
    author.image = image;
  }

  return author;
}

function getPageAuthors(page: SourcePage): PageAuthor[] {
  if (!hasAuthorArray(page.data)) {
    return [];
  }

  return page.data.authors
    .map((author) => toPageAuthor(author))
    .filter((author): author is PageAuthor => author !== undefined);
}

function createArticleJsonLd({
  title,
  description,
  canonicalUrl,
  publishedAt,
  modifiedAt,
  authors,
}: {
  title: string;
  description?: string;
  canonicalUrl: string;
  publishedAt?: Date;
  modifiedAt?: Date;
  authors: PageAuthor[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    datePublished: toIsoString(publishedAt),
    dateModified: toIsoString(modifiedAt),
    author:
      authors.length > 0
        ? authors.map((author) => ({
            "@type": "Person",
            name: author.name,
            image: author.image,
          }))
        : undefined,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon"),
      },
    },
  };
}
