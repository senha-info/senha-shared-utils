import { AppExceptionConstructorProps, AppExceptionEnum } from "./app-exception";
import { BadRequestException } from "./bad-request-exception";

export class UnavailableStockException extends BadRequestException {
  /**
   * Construtor do erro "UnavailableStockException"
   *
   * @param message - Mensagem de erro @default "Estoque indisponível"
   * @param details - Detalhes do erro
   */
  constructor({ message = "Estoque indisponível", details }: AppExceptionConstructorProps) {
    super({
      name: AppExceptionEnum.UNAVAILABLE_STOCK,
      message,
      details,
    });
  }
}
