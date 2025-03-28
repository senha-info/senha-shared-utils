import { BadRequestException } from "./bad-request-exception";

export class UnavailableStockException extends BadRequestException {
  constructor(message = "Estoque indisponível", details?: object) {
    super(message, details);
  }
}
