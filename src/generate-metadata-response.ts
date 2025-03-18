import { parseRequestURL } from "./parse-request-url";

interface GenerateMetadataResponseProps extends Record<string, any> {
  page: number;
  perPage: number;
  count: number;
  baseURL: string;
}

export function generateMetadataResponse({ page, perPage, count, baseURL, ...extra }: GenerateMetadataResponseProps) {
  const maxPage = Math.ceil(count / perPage);
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
