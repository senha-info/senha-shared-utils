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
  constructor({ name = AppExceptionEnum.NOT_FOUND, message = "Não encontrado", details }: AppExceptionProps) {
    super(name, message, HttpStatusCodes.NOT_FOUND, details);
  }
}
