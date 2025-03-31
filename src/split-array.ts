interface SplitArrayProps<T> {
  baseArray: T[];
  limit?: number;
}

export function splitArray<T>({ baseArray, limit = baseArray.length }: SplitArrayProps<T>): T[][] {
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
