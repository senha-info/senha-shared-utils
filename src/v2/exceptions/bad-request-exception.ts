import { HttpStatusCodes } from '../http-status-enum.js';
import { AppException, AppExceptionEnum, AppExceptionProps } from './app-exception.js';

/**
 * Exception representing HTTP 400 Bad Request.
 */
export class BadRequestException extends AppException {
  constructor(props?: AppExceptionProps) {
    super(
      props?.name ?? AppExceptionEnum.BAD_REQUEST,
      props?.message ?? 'Erro ao processar requisição',
      HttpStatusCodes.BAD_REQUEST,
      props?.details,
    );
  }
}
