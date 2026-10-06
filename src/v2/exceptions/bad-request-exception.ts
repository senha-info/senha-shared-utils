import { HttpStatusCodes } from '../http-status-enum.js';
import {
  AppException,
  AppExceptionConstructorProps,
} from './app-exception.js';

export type BadRequestExceptionProps = AppExceptionConstructorProps | string;

/**
 * Exception representing HTTP 400 Bad Request.
 */
export class BadRequestException extends AppException {
  constructor(props?: BadRequestExceptionProps) {
    const isString = typeof props === 'string';
    super({
      code: isString ? undefined : props?.code,
      message: isString ? props : (props?.message ?? 'Erro ao processar requisição'),
      status: HttpStatusCodes.BAD_REQUEST,
      details: isString ? undefined : props?.details,
      cause: isString ? undefined : props?.cause,
    });
  }
}
