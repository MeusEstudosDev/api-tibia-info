import { NotFoundException } from "@nestjs/common";

export class UsersNotFoundException extends NotFoundException {
  constructor() {
    super("Usuário não encontrado");
  }
}
