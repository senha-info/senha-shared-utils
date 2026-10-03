import { AppExceptionConstructorProps, AppExceptionEnum } from './app-exception.js';
import { UnauthorizedException } from './unauthorized-exception.js';

/**
 * Exception representing invalid user credentials (HTTP 401).
 */
export class InvalidCredentialsException extends UnauthorizedException {
  constructor(props?: AppExceptionConstructorProps) {
    super({
      name: AppExceptionEnum.INVALID_CREDENTIALS,
      message: props?.message ?? 'Usuário ou senha incorretos',
      details: props?.details,
    });
  }
}
