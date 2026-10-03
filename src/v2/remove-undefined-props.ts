/**
 * Removes properties with undefined values from an object.
 *
 * @param object - The object to remove undefined properties from
 * @returns A new object with undefined properties removed
 *
 * @example
 * removeUndefinedProps({ a: 1, b: undefined, c: null }) // { a: 1, c: null }
 */
export function removeUndefinedProps<T extends object>(object: T): Partial<T> {
  if (!object || typeof object !== 'object') {
    return {} as Partial<T>;
  }

  const entries = Object.entries(object).filter(([, value]) => value !== undefined);
  return Object.fromEntries(entries) as Partial<T>;
}
