import { AxiosError } from "axios";

async function executePromise<T>(promise: Promise<T>): Promise<[T, string | null, any?]>;

async function executePromise<T>(promise: Promise<T>) {
  try {
    const result = await promise;
    return [result, null, null];
  } catch (error) {
    let message = `Erro ao executar ação`;

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
