# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev        # Start development server at http://localhost:3000
bun run build      # Build for production (runs fumadocs-mdx postinstall first)
bun run lint       # Run ESLint
bun run start      # Start production server
```

After adding/removing content files, `fumadocs-mdx` must run to regenerate type-safe collections. This happens automatically via `postinstall`, but can be triggered manually:

```bash
bunx fumadocs-mdx
```

## Architecture

This is a **Next.js + Fumadocs** site for publishing financial content notes. All pages are statically generated from MDX files.

### Content Model

Content lives in `content/` organized by collection:

| Collection | Path | Description |
|---|---|---|
| `lance-morning` | `content/lance-morning/` | 蘭斯盤前資訊 |
| `yu-morning` | `content/yu-morning/` | 早晨財經速解讀（游庭皓） |
| `yu-finance` | `content/yu-finance/` | 財經皓角（游庭皓）|
| `yu-market` | `content/yu-market/` | 游庭皓市場相關 |
| `lindsay` | `content/lindsay/` | Lindsay 相關內容 |

Each collection is grouped by `YYYY-MM/` (monthly) or `YYYY/` (yearly) subdirectories. Each subdirectory has a `meta.json` for ordering. Top-level `content/meta.json` defines the sidebar order of collections.

### Page Ordering

`meta.json` uses `"pages": ["z...a"]` to sort pages in **reverse alphabetical** (newest-first) order. This relies on file names being date-based (e.g., `2026-03-17.mdx`) or sequential numbers (e.g., `279.mdx`).

### MDX Frontmatter Schema

Defined in `source.config.ts`. Required and optional fields:

```yaml
---
title: string           # required
date: date              # optional
tags: string[]          # default []
categories: string[]    # default []
youtubeId: string       # optional (legacy; prefer <YouTube> component)
full: boolean           # optional (fumadocs built-in, full-width page)
---
```

`lastModified` is auto-populated by the `fumadocs-mdx/plugins/last-modified` plugin from git history.

### Custom MDX Components

The `<YouTube id="VIDEO_ID" />` component is available in all MDX files. Defined in `components/youtube.tsx`, registered in `mdx-components.tsx`.

### Routing

All content is served under `/[...slug]` — `app/(home)/page.tsx` is the landing page. There is no `/docs` prefix. The `source` loader in `lib/source.ts` uses `baseUrl: "/"`.

Search is **disabled** (`enabled: false` in `app/layout.tsx`).

### SEO

Site URL is configured via environment variables (`NEXT_PUBLIC_SITE_URL` or `SITE_URL`), falling back to `https://finance-docs.ycnets.com`. Set this for correct canonical URLs and Open Graph metadata.
