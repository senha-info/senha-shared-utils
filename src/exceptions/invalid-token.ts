import { HttpStatusCodes } from "../http-status-enum";
import { AppException, AppExceptionEnum } from "./app-exception";

export class InvalidTokenException extends AppException {
  constructor(message = "Token de acesso inválido, tente novamente!", details?: object) {
    super(AppExceptionEnum.INVALID_TOKEN, message, HttpStatusCodes.UNAUTHORIZED, details);
  }
}
