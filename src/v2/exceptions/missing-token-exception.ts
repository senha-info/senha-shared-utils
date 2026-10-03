import { AppExceptionConstructorProps, AppExceptionEnum } from './app-exception.js';
import { UnauthorizedException } from './unauthorized-exception.js';

/**
 * Exception representing a missing authentication token (HTTP 401).
 */
export class MissingTokenException extends UnauthorizedException {
  constructor(props?: AppExceptionConstructorProps) {
    super({
      name: AppExceptionEnum.MISSING_TOKEN,
      message: props?.message ?? 'Token ausente',
      details: props?.details,
    });
  }
}
