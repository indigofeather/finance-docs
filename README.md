# finance-docs

This is a Next.js application generated with
[Create Fumadocs](https://github.com/fuma-nama/fumadocs).

Run development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

## 手動部署到 GitHub Pages

此專案已設定為 Next.js static export，部署來源是 `out/` 目錄。

自訂網域：`https://finance-docs.ycnets.com`

完整部署指令：

```bash
GH_PAGES_CNAME=finance-docs.ycnets.com \
NEXT_PUBLIC_BASE_PATH= \
NEXT_PUBLIC_SITE_URL=https://finance-docs.ycnets.com \
bun run deploy:github-pages
```

這個指令會：

1. 執行 `bun run lint`
2. 執行 `bun run build`
3. 壓縮 `out/` 內的 JPG 圖片，並移除 Next static export 產生的 `.txt` RSC payload
4. 確認 `out/.nojekyll`
5. 產生 GitHub Pages 的 `CNAME`
6. 將 `out/` force push 到 `origin/gh-pages`

第一次設定 GitHub Pages 時，請到 GitHub repo 的 Settings → Pages：

- Source: Deploy from a branch
- Branch: `gh-pages`
- Folder: `/ (root)`
- Custom domain: `finance-docs.ycnets.com`

DNS 端請確認 `finance-docs.ycnets.com` 指向 GitHub Pages。

## Explore

In the project, you can see:

- `lib/source.ts`: Code for content source adapter, [`loader()`](https://fumadocs.dev/docs/headless/source-api) provides the interface to access your content.
- `lib/layout.shared.tsx`: Shared options for layouts, optional but preferred to keep.

| Route                     | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `app/(home)`              | The route group for your landing page and other pages. |
| `app/docs`                | The documentation layout and pages.                    |
### Fumadocs MDX

A `source.config.ts` config file has been included, you can customise different options like frontmatter schema.

Read the [Introduction](https://fumadocs.dev/docs/mdx) for further details.

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.dev) - learn about Fumadocs
