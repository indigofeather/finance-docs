import { docs } from "fumadocs-mdx:collections/server";
import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import type * as PageTree from "fumadocs-core/page-tree";
import type { LayoutTab } from "fumadocs-ui/layouts/shared";

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: "/",
  source: docs.toFumadocsSource(),
  plugins: ({ typedPlugin }) => [
    lucideIconsPlugin(),
    typedPlugin({
      // the plugin config
    }),
  ],
});

function collectUrls(
  folder: PageTree.Folder,
  output: Set<string> = new Set(),
): Set<string> {
  if (folder.index) output.add(folder.index.url);
  for (const child of folder.children) {
    if (child.type === "page" && !child.external) output.add(child.url);
    if (child.type === "folder") collectUrls(child, output);
  }
  return output;
}

export function getSourceTabs(tree: PageTree.Root): LayoutTab[] {
  const results: LayoutTab[] = [];

  function scan(node: PageTree.Root | PageTree.Folder): void {
    if ("root" in node && node.root) {
      const urls = collectUrls(node);
      if (urls.size > 0) {
        results.push({
          url: urls.values().next().value!,
          title: node.name,
          icon: node.icon,
          description: node.description,
          urls,
        });
      }
    }
    for (const child of node.children) {
      if (child.type === "folder") scan(child);
    }
  }

  scan(tree);
  return results;
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title}

${processed}`;
}
