import { ConflictException } from "@nestjs/common";

export class UsersForgotPasswordExistsException extends ConflictException {
  constructor() {
    super("Já existe uma solicitação de alteração de senha para este usuário");
  }
}
