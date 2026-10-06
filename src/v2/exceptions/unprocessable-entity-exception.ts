import { HttpStatusCodes } from '../http-status-enum.js';
import {
  AppException,
  AppExceptionConstructorProps,
} from './app-exception.js';

export type UnprocessableEntityExceptionProps = AppExceptionConstructorProps | string;

/**
 * Exception representing HTTP 422 Unprocessable Entity.
 */
export class UnprocessableEntityException extends AppException {
  constructor(props?: UnprocessableEntityExceptionProps) {
    const isString = typeof props === 'string';
    super({
      code: isString ? undefined : props?.code,
      message: isString ? props : (props?.message ?? 'Entidade não processável'),
      status: HttpStatusCodes.UNPROCESSABLE_ENTITY,
      details: isString ? undefined : props?.details,
      cause: isString ? undefined : props?.cause,
    });
  }
}
