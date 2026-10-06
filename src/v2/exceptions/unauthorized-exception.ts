import { HttpStatusCodes } from '../http-status-enum.js';
import {
  AppException,
  AppExceptionConstructorProps,
} from './app-exception.js';

export type UnauthorizedExceptionProps = AppExceptionConstructorProps | string;

/**
 * Exception representing HTTP 401 Unauthorized.
 */
export class UnauthorizedException extends AppException {
  constructor(props?: UnauthorizedExceptionProps) {
    const isString = typeof props === 'string';
    super({
      code: isString ? undefined : props?.code,
      message: isString ? props : (props?.message ?? 'Não autorizado'),
      status: HttpStatusCodes.UNAUTHORIZED,
      details: isString ? undefined : props?.details,
      cause: isString ? undefined : props?.cause,
    });
  }
}
