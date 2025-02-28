import { HttpStatusCodes } from "../http-status-enum";

import { AppException, AppExceptionEnum } from "./app-exception";

export class InactiveException extends AppException {
  constructor(message = "Inativo", details?: object) {
    super(AppExceptionEnum.INACTIVE, message, HttpStatusCodes.FORBIDDEN, details);
  }
}
