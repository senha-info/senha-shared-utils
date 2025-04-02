import { HttpStatusCodes } from "../http-status-enum";
import { AppException, AppExceptionEnum, AppExceptionProps } from "./app-exception";

export class InternalServerException extends AppException {
  /**
   * Construtor do erro "InternalServerException"
   *
   * @param name - Nome do erro @default AppExceptionEnum.INTERNAL_SERVER_ERROR
   * @param message - Mensagem de erro @default "Erro ao processar requisição"
   * @param details - Detalhes do erro
   */
  constructor(props?: AppExceptionProps) {
    props = {
      name: props?.name ?? AppExceptionEnum.INTERNAL_SERVER_ERROR,
      message: props?.message ?? "Erro ao processar requisição",
    };

    super(props.name, props.message, HttpStatusCodes.INTERNAL_SERVER_ERROR, props.details);
  }
}
