export class FormatCase {
  /**
   * Convert a string to PascalCase
   *
   * @param {string} text - The text to convert
   * @returns {string} The text in PascalCase
   */
  public toPascalCase(text?: string): string {
    if (!text) {
      return "";
    }

    return text
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
  }

  /**
   * Convert a string to camelCase
   *
   * @param {string} text - The text to convert
   * @returns {string} The text in camelCase
   */
  public toCamelCase(text?: string): string {
    if (!text) {
      return "";
    }

    const pascalCase = this.toPascalCase(text);
    return pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1);
  }

  /**
   * Convert a string to kebab-case
   *
   * @param {string} text - The text to convert
   * @returns {string} The text in kebab-case
   */
  public toSnakeCase(text?: string): string {
    if (!text) {
      return "";
    }

    return text
      .split(/(?=[A-Z])/)
      .join("_")
      .toLowerCase();
  }
}
