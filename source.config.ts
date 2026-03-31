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
  date: z.date().optional(),
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  youtubeId: z.string().optional(),
});

export const docs = defineDocs({
  dir: "content",
  docs: {
    schema: customFrontmatter,
    postprocess: {
      includeProcessedMarkdown: true,
    },
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
