import { AppExceptionConstructorProps, AppExceptionEnum } from './app-exception.js';
import { BadRequestException } from './bad-request-exception.js';

/**
 * Exception representing unavailable stock for a requested product or item (HTTP 400).
 */
export class UnavailableStockException extends BadRequestException {
  constructor(props?: AppExceptionConstructorProps) {
    super({
      name: AppExceptionEnum.UNAVAILABLE_STOCK,
      message: props?.message ?? 'Estoque indisponível',
      details: props?.details,
    });
  }
}
