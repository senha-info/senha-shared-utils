import { HttpStatusCodes } from "../http-status-enum";

export enum AppExceptionEnum {
  BAD_REQUEST = "SI_BAD_REQUEST",
  INTERNAL_SERVER_ERROR = "SI_INTERNAL_SERVER_ERROR",
  NOT_FOUND = "SI_NOT_FOUND",
  INVALID_CREDENTIALS = "SI_INVALID_CREDENTIALS",
  INVALID_TOKEN = "SI_INVALID_TOKEN",
  MISSING_TOKEN = "SI_MISSING_TOKEN",
  UNAUTHORIZED = "SI_UNAUTHORIZED",
  FORBIDDEN = "SI_FORBIDDEN",
  INVALID_REQUEST_BODY = "SI_INVALID_REQUEST_BODY",
  INACTIVE = "SI_INACTIVE",
}

export class AppException {
  public readonly name: string;
  public readonly message: string;
  public readonly status: HttpStatusCodes;
  public readonly details?: object;

  constructor(name: string, message: string, status = HttpStatusCodes.BAD_REQUEST, details?: object) {
    this.name = name;
    this.message = message;
    this.status = status;
    this.details = details;
  }
}
