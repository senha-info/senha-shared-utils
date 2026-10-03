import { HttpStatusCodes } from '../http-status-enum.js';
import { AppException, AppExceptionEnum, AppExceptionProps } from './app-exception.js';

/**
 * Exception representing HTTP 404 Not Found.
 */
export class NotFoundException extends AppException {
  constructor(props?: AppExceptionProps) {
    super(
      props?.name ?? AppExceptionEnum.NOT_FOUND,
      props?.message ?? 'Não encontrado',
      HttpStatusCodes.NOT_FOUND,
      props?.details,
    );
  }
}
