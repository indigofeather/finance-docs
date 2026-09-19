import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import lastModified from 'fumadocs-mdx/plugins/last-modified';
import { z } from "zod/v4";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
const customFrontmatter = frontmatterSchema.extend({
  // `z.date()` 在 fumadocs 16.11.4 js-yaml → yaml 遷移後會失效：
  // 未加引號的 `date: 2026-09-18` 不再被自動解析為 Date，而是字串。
  // 用 coerce 同時接受 Date 與字串，維持舊行為。
  date: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  youtubeId: z.string().optional(),
  draft: z.boolean().default(false),
});

export const docs = defineDocs({
  dir: "content",
  docs: {
    schema: customFrontmatter,
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // Disable remote image size fetches to avoid network errors during dev/build.
  },
  plugins: [lastModified()],
});
