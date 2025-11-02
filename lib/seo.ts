const FALLBACK_SITE_URL = "https://finance-docs.vercel.app";

export const SITE_NAME = "蘭斯的財經記事本";
export const SITE_DESCRIPTION =
  "在市場中觀察與學習，將知識點滴積累，為未來的每一次決策打下堅實基石。";
export const SITE_LOCALE = "zh-TW";

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

export function getMetadataBase(): URL {
  return new URL(getSiteOrigin());
}

export function absoluteUrl(pathname: string): string {
  const base = getMetadataBase();
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
