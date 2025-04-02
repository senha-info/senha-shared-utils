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
  constructor(props?: AppExceptionConstructorProps) {
    props = {
      ...props,
      message: props?.message ?? "Inativo",
    };

    super({
      name: AppExceptionEnum.INACTIVE,
      message: props.message,
      details: props.details,
    });
  }
}
