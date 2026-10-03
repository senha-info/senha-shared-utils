import { toCamelCase, toSnakeCase } from './format-case.js';
import { parseRequestURL } from './parse-request-url.js';

export interface GenerateMetadataResponseProps extends Record<string, unknown> {
  /**
   * The casing convention for the response keys and extra properties.
   * - `'snake-case'`: Keys are formatted as `max_page`, `previous_url`, etc.
   * - `'camel-case'`: Keys are formatted as `maxPage`, `previousURL`, etc.
   * @default 'snake-case'
   */
  mode?: 'camel-case' | 'snake-case';

  /**
   * Current active page number (1-indexed).
   */
  page: number;

  /**
   * Number of items per page.
   */
  limit: number;

  /**
   * Total number of items across all pages.
   */
  count: number;

  /**
   * Base URL of the endpoint for building previous and next pagination links.
   */
  baseURL: string;

  /**
   * Whether to transform the keys of extra properties to match the selected `mode`.
   * When `true`, keys are converted to snake_case in `'snake-case'` mode and camelCase in `'camel-case'` mode.
   * When `false`, extra property keys are preserved exactly as provided.
   * @default true
   */
  formatExtraKeys?: boolean;
}

export interface MetadataCamelCaseResponse {
  count: number;
  maxPage: number;
  limit: number;
  previousURL: string | null;
  nextURL: string | null;
  extra?: Record<string, unknown>;
}

export interface MetadataSnakeCaseResponse {
  count: number;
  max_page: number;
  limit: number;
  previous_url: string | null;
  next_url: string | null;
  extra?: Record<string, unknown>;
}

function formatObjectKeys(
  obj: Record<string, unknown>,
  mode: 'camel-case' | 'snake-case',
): Record<string, unknown> {
  const transform = mode === 'snake-case' ? toSnakeCase : toCamelCase;
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    result[transform(key)] = value;
  }

  return result;
}

/**
 * Generates standardized pagination metadata response for REST APIs in camelCase format.
 *
 * @param props - Metadata generation configuration and extra properties
 * @returns Metadata object formatted with camelCase keys
 */
export function generateMetadataResponse(
  props: GenerateMetadataResponseProps & { mode: 'camel-case' },
): MetadataCamelCaseResponse;

/**
 * Generates standardized pagination metadata response for REST APIs in snake_case format.
 *
 * @param props - Metadata generation configuration and extra properties
 * @returns Metadata object formatted with snake_case keys
 */
export function generateMetadataResponse(
  props: GenerateMetadataResponseProps & { mode?: 'snake-case' },
): MetadataSnakeCaseResponse;

/**
 * Generates standardized pagination metadata response for REST APIs.
 * Calculates total pages, next/previous URLs, and formats extra properties according to the chosen mode.
 *
 * @param props - Metadata generation configuration and extra properties
 * @returns Metadata object with pagination information
 *
 * @example
 * ```typescript
 * const meta = generateMetadataResponse({
 *   page: 1,
 *   limit: 10,
 *   count: 45,
 *   baseURL: '/api/v1/users',
 *   debugId: '123',
 * });
 * // {
 * //   count: 45,
 * //   max_page: 5,
 * //   limit: 10,
 * //   previous_url: null,
 * //   next_url: '/api/v1/users?page=2',
 * //   extra: { debug_id: '123' }
 * // }
 * ```
 */
export function generateMetadataResponse({
  mode = 'snake-case',
  page,
  limit,
  count,
  baseURL,
  formatExtraKeys = true,
  ...extra
}: GenerateMetadataResponseProps): MetadataCamelCaseResponse | MetadataSnakeCaseResponse {
  const safeLimit = limit > 0 ? limit : 1;
  const maxPage = Math.ceil(count / safeLimit) || 1;
  const { previousURL, nextURL } = parseRequestURL(page, maxPage, baseURL);

  const hasExtra = Object.keys(extra).length > 0;
  const formattedExtra = hasExtra
    ? formatExtraKeys
      ? formatObjectKeys(extra, mode)
      : extra
    : undefined;

  if (mode === 'camel-case') {
    return {
      count,
      maxPage,
      limit,
      previousURL,
      nextURL,
      extra: formattedExtra,
    };
  }

  return {
    count,
    max_page: maxPage,
    limit,
    previous_url: previousURL,
    next_url: nextURL,
    extra: formattedExtra,
  };
}
