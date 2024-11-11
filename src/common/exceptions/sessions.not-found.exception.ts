import { NotFoundException } from "@nestjs/common";

export class SessionsNotFoundException extends NotFoundException {
  constructor() {
    super("Seção não encontrado");
  }
}
