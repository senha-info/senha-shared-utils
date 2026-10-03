export interface ParsedRequestURLResult {
  previousURL: string | null;
  nextURL: string | null;
}

/**
 * Parses request URL to determine previous and next pagination URLs.
 * Uses native WHATWG URL parser for robust query parameter handling.
 *
 * @param page - Current page number (1-based)
 * @param maxPage - Maximum page number
 * @param url - The request URL (relative or absolute)
 * @returns Object with previousURL and nextURL
 */
export function parseRequestURL(
  page: number,
  maxPage: number,
  url: string,
): ParsedRequestURLResult {
  if (!maxPage || page < 1) {
    return {
      previousURL: null,
      nextURL: null,
    };
  }

  const isRelative = !url.startsWith('http://') && !url.startsWith('https://');
  const dummyBase = 'http://localhost';

  const buildUrl = (targetPage: number): string => {
    const parsed = new URL(url, dummyBase);
    parsed.searchParams.set('page', String(targetPage));
    if (isRelative) {
      return `${parsed.pathname}${parsed.search}`;
    }
    return parsed.toString();
  };

  if (page > maxPage) {
    return {
      previousURL: buildUrl(maxPage),
      nextURL: null,
    };
  }

  const previousURL = page > 1 ? buildUrl(page - 1) : null;
  const nextURL = page < maxPage ? buildUrl(page + 1) : null;

  return {
    previousURL,
    nextURL,
  };
}
