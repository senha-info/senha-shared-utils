import { parseRequestURL } from './parse-request-url';

interface GenerateMetadataResponseProps extends Record<string, any> {
  mode?: 'camel-case' | 'snake-case';
  page: number;
  limit: number;
  count: number;
  baseURL: string;
}

export function generateMetadataResponse({
  mode = 'camel-case',
  page,
  limit,
  count,
  baseURL,
  ...extra
}: GenerateMetadataResponseProps) {
  const maxPage = Math.ceil(count / limit);
  const { previousURL, nextURL } = parseRequestURL(page, maxPage, baseURL);

  const hasExtra = Object.keys(extra).length > 0;

  if (mode === 'camel-case') {
    return {
      count,
      maxPage,
      previousURL,
      nextURL,
      extra: hasExtra ? extra : undefined,
    };
  }

  return {
    count,
    max_page: maxPage,
    previous_url: previousURL,
    next_url: nextURL,
    extra: hasExtra ? extra : undefined,
  };
}
