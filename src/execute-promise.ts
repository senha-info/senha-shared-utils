import { AxiosError } from "axios";
import { AppException } from "./exceptions";

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
      message = error.message;
      if (error.response?.data) {
        message = JSON.stringify(error.response.data);
      }
    }

    if (error instanceof AppException) {
      message = `(${error.status} - ${error.name}) ${error.message}`;
    }

    return [null, message, error];
  }
}

export { executePromise };
