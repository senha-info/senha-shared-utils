import { parseRequestURL } from "./parse-request-url";

interface GenerateMetadataResponseProps extends Record<string, any> {
  page: number;
  limit: number;
  count: number;
  baseURL: string;
}

export function generateMetadataResponse({ page, limit, count, baseURL, ...extra }: GenerateMetadataResponseProps) {
  const maxPage = Math.ceil(count / limit);
  const { previousURL, nextURL } = parseRequestURL(page, maxPage, baseURL);

  const hasExtra = Object.keys(extra).length > 0;

  return {
    count,
    maxPage,
    previousURL,
    nextURL,
    extra: hasExtra ? extra : undefined,
  };
}
