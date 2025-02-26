export class FormatCase {
  public toPascalCase(text?: string): string {
    if (!text) {
      return "";
    }

    return text
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  }

  public toCamelCase(text?: string): string {
    if (!text) {
      return "";
    }

    const pascalCase = this.toPascalCase(text);
    return pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1);
  }

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
