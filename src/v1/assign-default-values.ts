type AssignDefaultValuesProps<T> = {
  [K in keyof T]?: T[K];
};

/**
 * Assign default values to entity attributes
 *
 * @param {T} entity - The entity to assign default values
 * @param {AssignDefaultValuesProps<T>} attributes - The attributes to assign default values
 * @returns {void}
 */
export function assignDefaultValues<T>(entity: T, attributes: AssignDefaultValuesProps<T>): void {
  for (const attribute in attributes) {
    if (entity[attribute] === undefined || entity[attribute] === null) {
      entity[attribute] = attributes[attribute] as T[typeof attribute];
    }
  }
}
