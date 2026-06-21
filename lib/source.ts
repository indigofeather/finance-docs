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

export type SourcePage = ReturnType<typeof source.getPages>[number];

export function isDraftPage(page: SourcePage): boolean {
  return page.data.draft === true;
}

export function getPublishedPages(): SourcePage[] {
  return source.getPages().filter((page) => !isDraftPage(page));
}

export function getPublishedPage(slugs: string[]): SourcePage | undefined {
  const page = source.getPage(slugs);
  if (!page || isDraftPage(page)) return undefined;
  return page;
}

export function generatePublishedParams(): Array<{ slug: string[] }> {
  return getPublishedPages()
    .filter((page) => page.slugs.length > 0)
    .map((page) => ({ slug: page.slugs }));
}

export const publishedPageTree = filterDraftsFromTree(source.pageTree);

function filterDraftsFromTree<T extends PageTree.Root | PageTree.Folder>(tree: T): T {
  const children = tree.children
    .map((child) => filterDraftNode(child))
    .filter((child): child is PageTree.Node => child !== undefined);

  if (tree.type !== "folder") {
    const fallback = tree.fallback
      ? filterDraftsFromTree(tree.fallback)
      : undefined;

    return {
      ...tree,
      children,
      fallback:
        fallback && fallback.children.length > 0
          ? fallback
          : undefined,
    };
  }

  return { ...tree, children };
}

function filterDraftNode(node: PageTree.Node): PageTree.Node | undefined {
  if (node.type === "page") {
    return isDraftNode(node) ? undefined : node;
  }

  if (node.type === "folder") {
    const folder = filterDraftsFromTree(node);
    if (!folder.index && folder.children.length === 0) return undefined;
    return folder;
  }

  return node;
}

function isDraftNode(node: PageTree.Node): boolean {
  if (node.type !== "page") return false;

  const page = source.getNodePage(node);
  return page ? isDraftPage(page) : false;
}

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
