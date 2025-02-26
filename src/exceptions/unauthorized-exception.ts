import { HttpStatusCodes } from "../http-status-enum";
import { AppException, AppExceptionEnum } from "./app-exception";

export class UnauthorizedException extends AppException {
  constructor(message = "Sem autorização") {
    super(AppExceptionEnum.UNAUTHORIZED, message, HttpStatusCodes.UNAUTHORIZED);
  }
}
