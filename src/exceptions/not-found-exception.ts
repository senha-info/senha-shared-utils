import { HttpStatusCodes } from "../http-status-enum";
import { AppException, AppExceptionEnum, AppExceptionProps } from "./app-exception";

export class NotFoundException extends AppException {
  /**
   * Construtor do erro "NotFoundException"
   *
   * @param name - Nome do erro @default AppExceptionEnum.NOT_FOUND
   * @param message - Mensagem de erro @default "Não encontrado"
   * @param details - Detalhes do erro
   */
  constructor(props?: AppExceptionProps) {
    props = {
      name: props?.name ?? AppExceptionEnum.NOT_FOUND,
      message: props?.message ?? "Não encontrado",
    };

    super(props.name, props.message, HttpStatusCodes.NOT_FOUND, props.details);
  }
}
