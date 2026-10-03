import { HttpStatusCodes } from '../http-status-enum.js';
import { AppException, AppExceptionEnum, AppExceptionProps } from './app-exception.js';

/**
 * Exception representing HTTP 401 Unauthorized.
 */
export class UnauthorizedException extends AppException {
  constructor(props?: AppExceptionProps) {
    super(
      props?.name ?? AppExceptionEnum.UNAUTHORIZED,
      props?.message ?? 'Não autorizado',
      HttpStatusCodes.UNAUTHORIZED,
      props?.details,
    );
  }
}
