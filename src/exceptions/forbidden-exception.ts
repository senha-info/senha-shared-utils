import { HttpStatusCodes } from "../http-status-enum";
import { AppException, AppExceptionEnum, AppExceptionProps } from "./app-exception";

export class ForbiddenException extends AppException {
  /**
   * Construtor do erro "ForbiddenException"
   *
   * @param name - Nome do erro @default AppExceptionEnum.FORBIDDEN
   * @param message - Mensagem de erro @default "Sem permissão para acessar este recurso"
   * @param details - Detalhes do erro
   */
  constructor(props?: AppExceptionProps) {
    props = {
      ...props,
      name: props?.name ?? AppExceptionEnum.FORBIDDEN,
      message: props?.message ?? "Sem permissão para acessar este recurso",
    };

    super(props.name, props.message, HttpStatusCodes.FORBIDDEN, props.details);
  }
}
