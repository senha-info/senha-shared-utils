import { AppException } from './exceptions/index.js';

export interface ExecutePromiseConfig {
  debug?: boolean;
}

interface AxiosErrorLike {
  isAxiosError: boolean;
  message: string;
  response?: {
    data?: unknown;
  };
}

function isAxiosErrorLike(error: unknown): error is AxiosErrorLike {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'isAxiosError' in error &&
      (error as { isAxiosError: unknown }).isAxiosError === true,
  );
}

export type ExecutePromiseResult<T> = [data: T, error: string | null, rawError: unknown];

/**
 * Executes a promise and returns a tuple with `[data, error, rawError]`.
 * If the promise resolves, `data` contains the resolved value and `error` is `null`.
 * If the promise rejects, `data` is `null` (at runtime), `error` contains a formatted error message,
 * and `rawError` contains the original thrown error object.
 *
 * @param promise - The promise to execute
 * @param config - Optional configuration object
 * @returns Tuple with [data, error, rawError]
 *
 * @example
 * ```typescript
 * const [result, error] = await executePromise(getProductById({ id: '123' }));
 *
 * if (error) {
 *   console.error(error);
 *   return;
 * }
 *
 * const { product } = result; // Strongly-typed without null checks
 * ```
 */
export async function executePromise<T>(
  promise: Promise<T>,
  config?: ExecutePromiseConfig,
): Promise<ExecutePromiseResult<T>> {
  try {
    const result = await promise;
    return [result, null, null];
  } catch (error: unknown) {
    if (config?.debug) {
      console.error(error);
    }

    let message = 'Error while executing promise';

    if (error instanceof AppException) {
      message = error.code
        ? `(${error.status} - ${error.code}) ${error.message}`
        : `(${error.status}) ${error.message}`;
    } else if (isAxiosErrorLike(error)) {
      message = error.message;
      if (error.response?.data) {
        message =
          typeof error.response.data === 'string'
            ? error.response.data
            : JSON.stringify(error.response.data);
      }
    } else if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    return [null as unknown as T, message, error];
  }
}
