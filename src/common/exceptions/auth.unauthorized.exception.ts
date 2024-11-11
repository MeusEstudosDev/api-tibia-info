import { UnauthorizedException } from "@nestjs/common";

export class AuthUnauthorizedException extends UnauthorizedException {
  constructor() {
    super("Sem autorização");
  }
}
