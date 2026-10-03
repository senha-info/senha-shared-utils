export type AssignDefaultValuesProps<T> = {
  [K in keyof T]?: T[K];
};

/**
 * Assign default values to entity attributes if they are null or undefined.
 *
 * @param entity - The entity to assign default values to
 * @param attributes - The default attributes to assign
 */
export function assignDefaultValues<T extends object>(entity: T, attributes: AssignDefaultValuesProps<T>): void {
  if (!entity || !attributes) {
    return;
  }

  const target = entity as Record<string, unknown>;
  const defaults = attributes as Record<string, unknown>;

  for (const attribute in attributes) {
    if (target[attribute] === undefined || target[attribute] === null) {
      target[attribute] = defaults[attribute];
    }
  }
}
