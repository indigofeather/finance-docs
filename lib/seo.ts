const FALLBACK_SITE_URL = "https://finance-docs.ycnets.com";

export const SITE_NAME = "蘭斯的財經記事本";
export const SITE_DESCRIPTION =
  "在市場中觀察與學習，將知識點滴積累，為未來的每一次決策打下堅實基石。";
export const SITE_LOCALE = "zh-TW";

export function getBasePath(): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "");

  if (!basePath || basePath === "/") return "";
  return basePath.startsWith("/") ? basePath : `/${basePath}`;
}

export function withBasePath(pathname: string): string {
  if (!pathname.startsWith("/") || pathname.startsWith("//")) return pathname;
  return `${getBasePath()}${pathname}`;
}

export function getSiteOrigin(): string {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? FALLBACK_SITE_URL;

  try {
    const url = new URL(candidate);
    return url.origin;
  } catch {
    return new URL(FALLBACK_SITE_URL).origin;
  }
}

export function getSiteBaseUrl(): URL {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? FALLBACK_SITE_URL;

  try {
    const url = new URL(candidate);
    if (url.pathname === "/") {
      url.pathname = getBasePath() || "/";
    }
    return url;
  } catch {
    return new URL(FALLBACK_SITE_URL);
  }
}

export function getMetadataBase(): URL {
  return getSiteBaseUrl();
}

export function absoluteUrl(pathname: string): string {
  const base = getMetadataBase();

  if (pathname.startsWith("/")) {
    const basePath = base.pathname.replace(/\/$/, "");
    return new URL(`${basePath}${pathname}`, base.origin).toString();
  }

  return new URL(pathname, base).toString();
}

export function toDate(value: unknown): Date | undefined {
  if (!value) return undefined;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }

  const parsed = new Date(value as string);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export function toIsoString(date: Date | undefined): string | undefined {
  if (!date) return undefined;
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}
