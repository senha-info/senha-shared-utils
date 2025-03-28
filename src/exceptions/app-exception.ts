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
  UNAVAILABLE_STOCK = "SI_UNAVAILABLE_STOCK",
}

export interface AppExceptionProps {
  name?: AppExceptionEnum;
  message?: string;
  details?: object;
}

export type AppExceptionConstructorProps = Omit<AppExceptionProps, "name">;

export class AppException {
  public readonly name: string;
  public readonly message: string;
  public readonly status: HttpStatusCodes;
  public readonly details?: object;

  /**
   * Construtor do erro "AppException"
   *
   * @param name - Nome do erro @default AppExceptionEnum.BAD_REQUEST
   * @param message - Mensagem de erro
   * @param status - Código de status HTTP @default HttpStatusCodes.BAD_REQUEST
   * @param details - Detalhes do erro
   */
  constructor(
    name = AppExceptionEnum.BAD_REQUEST,
    message: string,
    status = HttpStatusCodes.BAD_REQUEST,
    details?: object
  ) {
    this.name = name;
    this.message = message;
    this.status = status;
    this.details = details;
  }
}
