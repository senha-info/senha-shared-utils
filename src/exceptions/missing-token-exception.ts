import { AppExceptionConstructorProps, AppExceptionEnum } from "./app-exception";
import { UnauthorizedException } from "./unauthorized-exception";

export class MissingTokenException extends UnauthorizedException {
  /**
   * Construtor do erro "MissingTokenException"
   *
   * @param message - Mensagem de erro @default "Token de acesso não informado"
   * @param details - Detalhes do erro
   */
  constructor({ message = "Token de acesso não informado", details }: AppExceptionConstructorProps) {
    super({
      name: AppExceptionEnum.MISSING_TOKEN,
      message,
      details,
    });
  }
}
