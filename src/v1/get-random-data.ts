function generateRandomString(length = 10): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

function generateRandomNumber(min = 0, max = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomData(type: "string", config?: { length?: number }): string;
export function getRandomData(type: "number", config?: { min?: number; max?: number }): number;
export function getRandomData(type: "boolean"): boolean;
export function getRandomData<T>(type: "random", config?: { options?: T[] }): T;

export function getRandomData<T extends string | number | boolean>(
  type: "string" | "number" | "boolean" | "random",
  config?: { length?: number; min?: number; max?: number; options?: T[] }
): T {
  switch (type) {
    case "string": {
      return generateRandomString(config?.length) as T;
    }
    case "number": {
      return generateRandomNumber(config?.min, config?.max) as T;
    }
    case "boolean": {
      return (Math.random() < 0.5) as T;
    }
    case "random": {
      if (!config?.options || !Array.isArray(config.options) || config.options.length === 0) {
        throw new Error("Random requires an array with at least one value");
      }

      return config.options[Math.floor(Math.random() * config.options.length)] as T;
    }
    default: {
      throw new Error("Unsupported type");
    }
  }
}
