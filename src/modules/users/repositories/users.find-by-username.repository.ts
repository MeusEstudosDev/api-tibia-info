import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../providers/prisma/prisma.service";
import { UsersDto } from "../dtos/users.dto";
import { UsersNotFoundException } from "../../../common/exceptions/users.not-found.exception";

@Injectable()
export class UsersFindByUsernameRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(username: string): Promise<UsersDto> {
    const userFound = await this.prisma.user.findUnique({
      where: { username, disabledAt: null },
    });
    if (!userFound) throw new UsersNotFoundException();
    return userFound;
  }
}
