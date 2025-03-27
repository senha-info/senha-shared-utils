import { HttpStatusCodes } from "../http-status-enum";
import { AppException, AppExceptionEnum } from "./app-exception";

export class BadRequestException extends AppException {
  constructor(message = "Erro ao processar requisição", details?: object) {
    super(AppExceptionEnum.BAD_REQUEST, message, HttpStatusCodes.BAD_REQUEST, details);
  }
}
