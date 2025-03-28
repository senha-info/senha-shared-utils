import { AppExceptionConstructorProps, AppExceptionEnum } from "./app-exception";
import { BadRequestException } from "./bad-request-exception";

export class UnavailableStockException extends BadRequestException {
  /**
   * Construtor do erro "UnavailableStockException"
   *
   * @param message - Mensagem de erro @default "Estoque indisponível"
   * @param details - Detalhes do erro
   */
  constructor(props?: AppExceptionConstructorProps) {
    if (!props) {
      props = {
        message: "Estoque indisponível",
      };
    }

    super({
      name: AppExceptionEnum.UNAVAILABLE_STOCK,
      message: props.message,
      details: props.details,
    });
  }
}
