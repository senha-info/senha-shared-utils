import { HttpStatusCodes } from '../http-status-enum.js';
import {
  AppException,
  AppExceptionConstructorProps,
} from './app-exception.js';

export type ForbiddenExceptionProps = AppExceptionConstructorProps | string;

/**
 * Exception representing HTTP 403 Forbidden.
 */
export class ForbiddenException extends AppException {
  constructor(props?: ForbiddenExceptionProps) {
    const isString = typeof props === 'string';
    super({
      code: isString ? undefined : props?.code,
      message: isString ? props : (props?.message ?? 'Acesso proibido'),
      status: HttpStatusCodes.FORBIDDEN,
      details: isString ? undefined : props?.details,
      cause: isString ? undefined : props?.cause,
    });
  }
}
