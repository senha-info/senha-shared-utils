import { HttpStatusCodes } from "../http-status-enum";
import { AppException, AppExceptionEnum, AppExceptionProps } from "./app-exception";

export class UnauthorizedException extends AppException {
  /**
   * Construtor do erro "UnauthorizedException"
   *
   * @param name - Nome do erro @default AppExceptionEnum.UNAUTHORIZED
   * @param message - Mensagem de erro @default "Sem autorização"
   * @param details - Detalhes do erro
   */
  constructor(props?: AppExceptionProps) {
    if (!props) {
      props = {
        name: AppExceptionEnum.UNAUTHORIZED,
        message: "Sem autorização",
      };
    }

    super(props.name, props.message, HttpStatusCodes.UNAUTHORIZED, props.details);
  }
}
