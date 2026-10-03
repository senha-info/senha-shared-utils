/**
 * Makes all properties of T optional and nullable.
 */
export type PartialNullable<T> = {
  [P in keyof T]?: T[P] | null;
};

/**
 * Extracts only non-function properties from a given type.
 */
export type OnlyFields<Type> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [Key in keyof Type as Type[Key] extends Function ? never : Key]: Type[Key];
};

/**
 * Recursively makes all properties of an object optional.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
