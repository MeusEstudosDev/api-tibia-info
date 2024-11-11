import { ConflictException } from "@nestjs/common";

export class UsersChangeEmailNotExistsException extends ConflictException {
  constructor() {
    super("Não existe solicitação de alteração de e-mail para este usuário");
  }
}
