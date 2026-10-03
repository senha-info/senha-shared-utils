import { HttpStatusCodes } from '../http-status-enum.js';
import { AppException, AppExceptionEnum, AppExceptionProps } from './app-exception.js';

/**
 * Exception representing HTTP 409 Conflict.
 */
export class ConflictException extends AppException {
  constructor(props?: AppExceptionProps) {
    super(
      props?.name ?? AppExceptionEnum.CONFLICT,
      props?.message ?? 'Conflito de dados',
      HttpStatusCodes.CONFLICT,
      props?.details,
    );
  }
}
