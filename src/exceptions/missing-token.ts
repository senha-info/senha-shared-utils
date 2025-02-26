import { HttpStatusCodes } from "../http-status-enum";
import { AppException, AppExceptionEnum } from "./app-exception";

export class MissingTokenException extends AppException {
  constructor(message = "Token de acesso não informado") {
    super(AppExceptionEnum.MISSING_TOKEN, message, HttpStatusCodes.UNAUTHORIZED);
  }
}
