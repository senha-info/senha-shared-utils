import { HttpStatusCodes } from '../http-status-enum.js';
import {
  AppException,
  AppExceptionConstructorProps,
} from './app-exception.js';

export type ConflictExceptionProps = AppExceptionConstructorProps | string;

/**
 * Exception representing HTTP 409 Conflict.
 */
export class ConflictException extends AppException {
  constructor(props?: ConflictExceptionProps) {
    const isString = typeof props === 'string';
    super({
      code: isString ? undefined : props?.code,
      message: isString ? props : (props?.message ?? 'Conflito de dados'),
      status: HttpStatusCodes.CONFLICT,
      details: isString ? undefined : props?.details,
      cause: isString ? undefined : props?.cause,
    });
  }
}
