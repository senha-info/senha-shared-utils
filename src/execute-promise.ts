import { AxiosError } from "axios";

/**
 * Executes a promise and returns the result, error message and error object.
 *
 * @param {Promise<T>} promise - The promise to execute
 * @returns {Promise<[T, string | null, any?]>} The result, error message and error object
 */
async function executePromise<T>(promise: Promise<T>): Promise<[T, string | null, any?]>;

async function executePromise<T>(promise: Promise<T>) {
  try {
    const result = await promise;
    return [result, null, null];
  } catch (error) {
    let message = "Error while executing promise";

    if (error instanceof Error) {
      message = error.message;
    }

    if (error instanceof AxiosError) {
      message = error.response?.data.message || error.message;
    }

    return [null, message, error];
  }
}

export { executePromise };
