import { HttpStatusCodes } from '../http-status-enum.js';
import { AppException, AppExceptionEnum, AppExceptionProps } from './app-exception.js';

/**
 * Exception representing HTTP 500 Internal Server Error.
 */
export class InternalServerException extends AppException {
  constructor(props?: AppExceptionProps) {
    super(
      props?.name ?? AppExceptionEnum.INTERNAL_SERVER_ERROR,
      props?.message ?? 'Erro ao processar requisição',
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      props?.details,
    );
  }
}
