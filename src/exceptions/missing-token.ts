import { HttpStatusCodes } from "../http-status-enum";
import { AppException, AppExceptionEnum } from "./app-exception";

export class MissingTokenException extends AppException {
  constructor(message = "Token de acesso não informado", details?: object) {
    super(AppExceptionEnum.MISSING_TOKEN, message, HttpStatusCodes.UNAUTHORIZED, details);
  }
}
