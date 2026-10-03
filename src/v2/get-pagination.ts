export interface PaginationResult {
  start: number;
  end: number;
  offset: number;
  limit: number;
}

/**
 * Calculates SQL pagination values (start, end, offset, limit).
 *
 * @param page - Current page (1-based)
 * @param limit - Page size limit
 * @returns {PaginationResult}
 *
 * @example
 * getPagination(1, 10) // { start: 1, end: 10, offset: 0, limit: 10 }
 * getPagination(2, 10) // { start: 11, end: 20, offset: 10, limit: 10 }
 */
export function getPagination(page: number, limit: number): PaginationResult {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const offset = (safePage - 1) * safeLimit;
  const start = offset + 1;
  const end = safePage * safeLimit;

  return {
    start,
    end,
    offset,
    limit: safeLimit,
  };
}
