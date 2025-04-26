/**
 * Removes properties with undefined values from an object.
 *
 * @param object - The object to remove undefined properties from
 * @returns A new object with undefined properties removed
 */
export function removeUndefinedProps<T>(object: T): Partial<T> {
  const entries = Object.entries(object || {}).filter(([, value]) => value !== undefined);
  return Object.fromEntries(entries) as Partial<T>;
}
