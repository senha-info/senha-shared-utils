import { AppExceptionConstructorProps, AppExceptionEnum } from "./app-exception";
import { ForbiddenException } from "./forbidden-exception";

export class InactiveException extends ForbiddenException {
  /**
   * Construtor do erro "InactiveException"
   *
   * @param name - Nome do erro @default AppExceptionEnum.INACTIVE
   * @param message - Mensagem de erro @default "Inativo"
   * @param details - Detalhes do erro
   */
  constructor({ message = "Inativo", details }: AppExceptionConstructorProps) {
    super({
      name: AppExceptionEnum.INACTIVE,
      message,
      details,
    });
  }
}
