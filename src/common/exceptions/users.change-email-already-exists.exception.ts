import { ConflictException } from "@nestjs/common";

export class UsersChangeEmailAlreadyExistsException extends ConflictException {
  constructor() {
    super("Já existe uma solicitação de troca de e-mail em andamento");
  }
}
