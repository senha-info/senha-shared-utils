import { HttpStatusCodes } from "../http-status-enum";
import { AppException, AppExceptionEnum } from "./app-exception";

export class NotFoundException extends AppException {
  constructor(message = "Não encontrado") {
    super(AppExceptionEnum.NOT_FOUND, message, HttpStatusCodes.NOT_FOUND);
  }
}
