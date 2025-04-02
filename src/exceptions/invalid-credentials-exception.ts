import { AppExceptionConstructorProps } from "./app-exception";
import { UnauthorizedException } from "./unauthorized-exception";

export class InvalidCredentialsException extends UnauthorizedException {
  /**
   * Construtor do erro "InvalidCredentialsException"
   *
   * @param message - Mensagem de erro @default "Usuário ou senha incorretos"
   * @param details - Detalhes do erro
   */
  constructor(props?: AppExceptionConstructorProps) {
    props = {
      message: props?.message ?? "Usuário ou senha incorretos",
    };

    super({
      message: props.message,
      details: props.details,
    });
  }
}
