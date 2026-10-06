import { HttpStatusCodes } from '../http-status-enum.js';

export interface AppExceptionProps {
  /**
   * Optional machine-readable error code defined by the consuming application (e.g. 'INVALID_CREDENTIALS').
   */
  code?: string;

  /**
   * Human-readable error message.
   */
  message?: string;

  /**
   * HTTP status code corresponding to the error.
   */
  status?: HttpStatusCodes;

  /**
   * Optional additional metadata or validation error details.
   */
  details?: unknown;

  /**
   * Original error cause for error chaining (ES2022).
   */
  cause?: unknown;
}

export type AppExceptionConstructorProps = Omit<AppExceptionProps, 'status'>;

/**
 * Standard serialized JSON format for application exceptions in API responses.
 */
export interface AppExceptionJSON {
  name: string;
  message: string;
  status: number;
  code?: string;
  details?: unknown;
  timestamp: string;
}

/**
 * Base application exception extending native JavaScript Error.
 * Preserves V8 stack traces, supports `instanceof Error`, ES2022 error chaining (`cause`),
 * and provides standardized JSON serialization for REST API responses.
 */
export class AppException extends Error {
  public override readonly name: string;
  public readonly code?: string;
  public override readonly message: string;
  public readonly status: HttpStatusCodes;
  public readonly details?: unknown;
  public readonly cause?: unknown;
  public readonly isOperational = true;
  public readonly timestamp: string;

  /**
   * Creates a new AppException instance.
   *
   * @param props - Exception configuration object or direct message string
   */
  constructor(props?: AppExceptionProps | string) {
    const isString = typeof props === 'string';
    const message = isString ? props : (props?.message ?? 'Erro ao processar requisição');
    const status = isString ? HttpStatusCodes.BAD_REQUEST : (props?.status ?? HttpStatusCodes.BAD_REQUEST);
    const code = isString ? undefined : props?.code;
    const details = isString ? undefined : props?.details;
    const cause = isString ? undefined : props?.cause;

    super(message);

    this.name = this.constructor.name;
    this.code = code;
    this.message = message;
    this.status = status;
    this.details = details;
    this.cause = cause;
    this.timestamp = new Date().toISOString();

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Serializes the exception into a plain JSON-compatible object suitable for API responses.
   */
  public toJSON(): AppExceptionJSON {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      ...(this.code !== undefined && { code: this.code }),
      ...(this.details !== undefined && { details: this.details }),
      timestamp: this.timestamp,
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
        'message' in error,
    )
  );
}
