export type PartialNullable<T> = {
  [P in keyof T]?: T[P] | null;
};

export type OnlyFields<Type> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [Key in keyof Type as Type[Key] extends Function ? never : Key]: Type[Key];
};
