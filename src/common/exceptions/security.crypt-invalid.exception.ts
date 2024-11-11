import { BadRequestException } from "@nestjs/common";

export class SecurityCryptInvalidException extends BadRequestException {
  constructor() {
    super("Algorítimo de criptografia inválido");
  }
}
