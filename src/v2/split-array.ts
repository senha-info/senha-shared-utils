export interface SplitArrayProps<T> {
  baseArray: T[];
  limit?: number;
}

/**
 * Splits an array into chunks of a given limit size.
 *
 * @param props - Object containing baseArray and chunk limit
 * @returns Array of chunks
 *
 * @example
 * splitArray({ baseArray: [1, 2, 3, 4, 5], limit: 2 }) // [[1, 2], [3, 4], [5]]
 */
export function splitArray<T>({ baseArray, limit }: SplitArrayProps<T>): T[][] {
  if (!baseArray || baseArray.length === 0) {
    return [];
  }

  const chunkLimit = limit && limit > 0 ? limit : baseArray.length;
  const result: T[][] = [];

  for (let i = 0; i < baseArray.length; i += chunkLimit) {
    result.push(baseArray.slice(i, i + chunkLimit));
  }

  return result;
}
