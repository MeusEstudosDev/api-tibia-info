import { ConflictException } from "@nestjs/common";

export class UsersAlreadyExistsException extends ConflictException {
  constructor() {
    super("Usuário já existe");
  }
}
