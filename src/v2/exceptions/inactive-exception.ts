import { AppExceptionConstructorProps, AppExceptionEnum } from './app-exception.js';
import { UnauthorizedException } from './unauthorized-exception.js';

/**
 * Exception representing an inactive user or account.
 */
export class InactiveException extends UnauthorizedException {
  constructor(props?: AppExceptionConstructorProps) {
    super({
      name: AppExceptionEnum.INACTIVE,
      message: props?.message ?? 'Conta inativa',
      details: props?.details,
    });
  }
}
