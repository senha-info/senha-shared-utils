import { AppExceptionConstructorProps, AppExceptionEnum } from "./app-exception";
import { UnauthorizedException } from "./unauthorized-exception";

export class InvalidTokenException extends UnauthorizedException {
  /**
   * Construtor do erro "InvalidTokenException"
   *
   * @param message - Mensagem de erro @default "Token de acesso inválido, tente novamente!"
   * @param details - Detalhes do erro
   */
  constructor(props?: AppExceptionConstructorProps) {
    if (!props) {
      props = {
        message: "Token de acesso inválido, tente novamente!",
      };
    }

    super({
      name: AppExceptionEnum.INVALID_TOKEN,
      message: props.message,
      details: props.details,
    });
  }
}
