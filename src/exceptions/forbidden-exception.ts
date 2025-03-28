import { HttpStatusCodes } from "../http-status-enum";

import { AppException, AppExceptionEnum } from "./app-exception";

export class ForbiddenException extends AppException {
  constructor(message = "Sem permissão para acessar este recurso", details?: object) {
    super(AppExceptionEnum.FORBIDDEN, message, HttpStatusCodes.FORBIDDEN, details);
  }
}
