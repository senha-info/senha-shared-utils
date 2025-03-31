interface SplitArrayProps<T> {
  baseArray: T[];
  limit: number;
  skipSplit: boolean;
}

export function splitArray<T>({ baseArray, limit, skipSplit }: SplitArrayProps<T>): T[][] {
  if (skipSplit) {
    return [baseArray];
  }

  let result: T[][] = [];

  for (let i = 0; i < baseArray.length; i++) {
    let groupIndex = Math.floor(i / limit);

    if (!result[groupIndex]) {
      result[groupIndex] = [];
    }

    result[groupIndex].push(baseArray[i]);
  }

  return result;
}
