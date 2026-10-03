import { HttpStatusCodes } from '../http-status-enum.js';

export enum AppExceptionEnum {
  BAD_REQUEST = 'SI_BAD_REQUEST',
  INTERNAL_SERVER_ERROR = 'SI_INTERNAL_SERVER_ERROR',
  NOT_FOUND = 'SI_NOT_FOUND',
  INVALID_CREDENTIALS = 'SI_INVALID_CREDENTIALS',
  INVALID_TOKEN = 'SI_INVALID_TOKEN',
  MISSING_TOKEN = 'SI_MISSING_TOKEN',
  UNAUTHORIZED = 'SI_UNAUTHORIZED',
  FORBIDDEN = 'SI_FORBIDDEN',
  INVALID_REQUEST_BODY = 'SI_INVALID_REQUEST_BODY',
  INACTIVE = 'SI_INACTIVE',
  UNAVAILABLE_STOCK = 'SI_UNAVAILABLE_STOCK',
  CONFLICT = 'SI_CONFLICT',
  UNPROCESSABLE_ENTITY = 'SI_UNPROCESSABLE_ENTITY',
  UNAUTHORIZED_ACCESS = 'SI_UNAUTHORIZED_ACCESS',
  INVALID_USER = 'SI_INVALID_USER',
}

export interface AppExceptionProps {
  name?: AppExceptionEnum | string;
  message?: string;
  details?: unknown;
}

export type AppExceptionConstructorProps = Omit<AppExceptionProps, 'name'>;

/**
 * Base application exception extending native JavaScript Error.
 * Preserves V8 stack traces, supports `instanceof Error`, and provides JSON serialization.
 */
export class AppException extends Error {
  public override readonly name: string;
  public override readonly message: string;
  public readonly status: HttpStatusCodes;
  public readonly details?: unknown;

  /**
   * @param name - Error identifier name (defaults to AppExceptionEnum.BAD_REQUEST)
   * @param message - Human-readable error message
   * @param status - HTTP status code (defaults to HttpStatusCodes.BAD_REQUEST)
   * @param details - Optional additional metadata or error details
   */
  constructor(
    name: string = AppExceptionEnum.BAD_REQUEST,
    message = 'Erro ao processar requisição',
    status: HttpStatusCodes = HttpStatusCodes.BAD_REQUEST,
    details?: unknown,
  ) {
    super(message);
    this.name = name;
    this.message = message;
    this.status = status;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Serializes the exception into a plain JSON-compatible object.
   */
  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details,
    };
  }
}

/**
 * Type-guard to check if an unknown error is an instance of AppException or conforms to its structure.
 *
 * @param error - The error to inspect
 * @returns True if the error is an AppException
 */
export function isAppException(error: unknown): error is AppException {
  return (
    error instanceof AppException ||
    Boolean(
      error &&
      typeof error === 'object' &&
      'status' in error &&
      'name' in error &&
      'message' in error,
    )
  );
}
