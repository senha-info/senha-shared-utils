import { HttpStatusCodes } from '../http-status-enum.js';
import {
  AppException,
  AppExceptionConstructorProps,
} from './app-exception.js';

export type InternalServerExceptionProps = AppExceptionConstructorProps | string;

/**
 * Exception representing HTTP 500 Internal Server Error.
 */
export class InternalServerException extends AppException {
  constructor(props?: InternalServerExceptionProps) {
    const isString = typeof props === 'string';
    super({
      code: isString ? undefined : props?.code,
      message: isString ? props : (props?.message ?? 'Erro interno no servidor'),
      status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      details: isString ? undefined : props?.details,
      cause: isString ? undefined : props?.cause,
    });
  }
}
