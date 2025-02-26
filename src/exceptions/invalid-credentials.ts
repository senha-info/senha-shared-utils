import { UnauthorizedException } from "./unauthorized-exception";

export class InvalidCredentialsException extends UnauthorizedException {
  constructor(message = "Usuário ou senha incorretos") {
    super(message);
  }
}
