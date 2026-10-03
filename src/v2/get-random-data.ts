function generateRandomString(length = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

function generateRandomNumber(min = 0, max = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random alphanumeric string.
 *
 * @param type - `'string'`
 * @param config - Options with optional length (default 10)
 * @returns Random string
 */
export function getRandomData(type: 'string', config?: { length?: number }): string;

/**
 * Generates a random integer between min and max.
 *
 * @param type - `'number'`
 * @param config - Options with optional min (default 0) and max (default 100)
 * @returns Random number
 */
export function getRandomData(type: 'number', config?: { min?: number; max?: number }): number;

/**
 * Generates a random boolean (true or false).
 *
 * @param type - `'boolean'`
 * @returns Random boolean
 */
export function getRandomData(type: 'boolean'): boolean;

/**
 * Selects a random element from a given array of options.
 *
 * @param type - `'random'`
 * @param config - Options containing an array of choices
 * @returns Randomly selected element
 */
export function getRandomData<T>(type: 'random', config?: { options?: T[] }): T;

/**
 * Generates pseudo-random data based on the requested type.
 *
 * @param type - Type of random data to produce ('string', 'number', 'boolean', or 'random')
 * @param config - Configuration options matching the selected type
 * @returns Random data matching the requested type
 */
export function getRandomData<T extends string | number | boolean>(
  type: 'string' | 'number' | 'boolean' | 'random',
  config?: { length?: number; min?: number; max?: number; options?: T[] },
): T {
  switch (type) {
    case 'string': {
      return generateRandomString(config?.length) as T;
    }
    case 'number': {
      return generateRandomNumber(config?.min, config?.max) as T;
    }
    case 'boolean': {
      return (Math.random() < 0.5) as T;
    }
    case 'random': {
      if (!config?.options || !Array.isArray(config.options) || config.options.length === 0) {
        throw new Error('Random requires an array with at least one value');
      }

      return config.options[Math.floor(Math.random() * config.options.length)] as T;
    }
    default: {
      throw new Error('Unsupported type');
    }
  }
}
