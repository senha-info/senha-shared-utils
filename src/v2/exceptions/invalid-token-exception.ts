import { AppExceptionConstructorProps, AppExceptionEnum } from './app-exception.js';
import { UnauthorizedException } from './unauthorized-exception.js';

/**
 * Exception representing an invalid authentication token (HTTP 401).
 */
export class InvalidTokenException extends UnauthorizedException {
  constructor(props?: AppExceptionConstructorProps) {
    super({
      name: AppExceptionEnum.INVALID_TOKEN,
      message: props?.message ?? 'Token inválido',
      details: props?.details,
    });
  }
}
