import { UnauthorizedException } from "@nestjs/common";

export class AuthInvalidCredentialException extends UnauthorizedException {
  constructor() {
    super("Credenciais inválidas");
  }
}
