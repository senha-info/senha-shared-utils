interface AssignDefaultValuesProps<T> {
  entity: T;
  attributes: Array<{
    name: keyof T;
    value: T[keyof T];
  }>;
}

/**
 * Assign default values to entity attributes
 *
 * @param {AssignDefaultValuesProps<T>} props
 * @param {T} props.entity - The entity to assign default values
 * @param {Array<{ name: keyof T, value: T[keyof T] }>} props.attributes - The attributes to assign default values
 */
export function assignDefaultValues<T>({ entity, attributes }: AssignDefaultValuesProps<T>): void {
  for (const { name, value } of attributes) {
    if (entity[name] === undefined || entity[name] === null) {
      entity[name] = value;
    }
  }
}
