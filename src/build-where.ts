interface Condition {
  apply: boolean;
  text: string;
}

export function buildWhere(conditions: Condition[]): string {
  const where = conditions
    .filter((condition) => condition.apply)
    .map((condition) => condition.text)
    .join(' and ');

  return where ? `where ${where}` : '';
}
