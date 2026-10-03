import { HttpStatusCodes } from '../http-status-enum.js';
import { AppException, AppExceptionEnum, AppExceptionProps } from './app-exception.js';

/**
 * Exception representing HTTP 403 Forbidden.
 */
export class ForbiddenException extends AppException {
  constructor(props?: AppExceptionProps) {
    super(
      props?.name ?? AppExceptionEnum.FORBIDDEN,
      props?.message ?? 'Acesso proibido',
      HttpStatusCodes.FORBIDDEN,
      props?.details,
    );
  }
}
