import { HttpStatusCodes } from '../http-status-enum.js';
import {
  AppException,
  AppExceptionConstructorProps,
} from './app-exception.js';

export type NotFoundExceptionProps = AppExceptionConstructorProps | string;

/**
 * Exception representing HTTP 404 Not Found.
 */
export class NotFoundException extends AppException {
  constructor(props?: NotFoundExceptionProps) {
    const isString = typeof props === 'string';
    super({
      code: isString ? undefined : props?.code,
      message: isString ? props : (props?.message ?? 'Não encontrado'),
      status: HttpStatusCodes.NOT_FOUND,
      details: isString ? undefined : props?.details,
      cause: isString ? undefined : props?.cause,
    });
  }
}
