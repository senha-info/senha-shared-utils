import { HttpStatusCodes } from "../http-status-enum";
import { AppException, AppExceptionEnum, AppExceptionProps } from "./app-exception";

export class ConflictException extends AppException {
  /**
   * Construtor do erro "ConflictException"
   *
   * @param name - Nome do erro @default AppExceptionEnum.CONFLICT
   * @param message - Mensagem de erro @default "Erro ao processar requisição"
   * @param details - Detalhes do erro
   */
  constructor(props?: AppExceptionProps) {
    props = {
      ...props,
      name: props?.name ?? AppExceptionEnum.CONFLICT,
      message: props?.message ?? "Erro ao processar requisição",
    };

    super(props.name, props.message, HttpStatusCodes.CONFLICT, props.details);
  }
}
