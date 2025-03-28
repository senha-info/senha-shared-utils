import { HttpStatusCodes } from "../http-status-enum";
import { AppException, AppExceptionEnum, AppExceptionProps } from "./app-exception";

export class BadRequestException extends AppException {
  /**
   * Construtor do erro "BadRequestException"
   *
   * @param name - Nome do erro @default AppExceptionEnum.BAD_REQUEST
   * @param message - Mensagem de erro @default "Erro ao processar requisição"
   * @param details - Detalhes do erro
   */
  constructor({
    name = AppExceptionEnum.BAD_REQUEST,
    message = "Erro ao processar requisição",
    details,
  }: AppExceptionProps) {
    super(name, message, HttpStatusCodes.BAD_REQUEST, details);
  }
}
