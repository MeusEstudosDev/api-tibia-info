import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PrismaService } from "../../../providers/prisma/prisma.service";
import { UsersNotFoundException } from "../../../common/exceptions/users.not-found.exception";

@Injectable()
export class UsersFindByEmailRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(email: string) {
    const userFound = await this.prisma.user.findUnique({
      where: { email, disabledAt: null },
    });
    if (!userFound) throw new UsersNotFoundException();
    return userFound;
  }
}
