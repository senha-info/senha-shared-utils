/**
 * Converts a string to snake_case.
 * Handles camelCase, PascalCase, kebab-case, spaced strings, and acronyms.
 *
 * @param text - The text to convert
 * @returns The text in snake_case
 *
 * @example
 * toSnakeCase('helloWorld') // 'hello_world'
 * toSnakeCase('HelloWorld') // 'hello_world'
 * toSnakeCase('hello-world') // 'hello_world'
 */
export function toSnakeCase(text?: string | null): string {
  if (!text) {
    return '';
  }

  return text
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z0-9])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
}

/**
 * Converts a string to kebab-case.
 *
 * @param text - The text to convert
 * @returns The text in kebab-case
 *
 * @example
 * toKebabCase('helloWorld') // 'hello-world'
 * toKebabCase('HelloWorld') // 'hello-world'
 * toKebabCase('hello_world') // 'hello-world'
 */
export function toKebabCase(text?: string | null): string {
  if (!text) {
    return '';
  }

  return toSnakeCase(text).replace(/_/g, '-');
}

/**
 * Converts a string to PascalCase.
 *
 * @param text - The text to convert
 * @returns The text in PascalCase
 *
 * @example
 * toPascalCase('hello-world') // 'HelloWorld'
 * toPascalCase('hello_world') // 'HelloWorld'
 */
export function toPascalCase(text?: string | null): string {
  if (!text) {
    return '';
  }

  return text
    .trim()
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toUpperCase());
}

/**
 * Converts a string to camelCase.
 *
 * @param text - The text to convert
 * @returns The text in camelCase
 *
 * @example
 * toCamelCase('hello-world') // 'helloWorld'
 * toCamelCase('HelloWorld') // 'helloWorld'
 */
export function toCamelCase(text?: string | null): string {
  if (!text) {
    return '';
  }

  const pascal = toPascalCase(text);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export class FormatCase {
  public toPascalCase = toPascalCase;
  public toCamelCase = toCamelCase;
  public toSnakeCase = toSnakeCase;
  public toKebabCase = toKebabCase;
}

export const formatCase = new FormatCase();
