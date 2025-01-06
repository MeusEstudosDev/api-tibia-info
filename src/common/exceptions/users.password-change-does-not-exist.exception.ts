import { ConflictException } from "@nestjs/common";

export class UsersPasswordChangeDoesNotExistException extends ConflictException {
  constructor() {
    super("Usuário não tem solicitação para alteração de senha");
  }
}
