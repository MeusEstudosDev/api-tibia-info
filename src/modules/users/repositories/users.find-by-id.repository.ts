import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../providers/prisma/prisma.service";
import { UsersDto } from "../dtos/users.dto";
import { UsersNotFoundException } from "../../../common/exceptions/users.not-found.exception";

@Injectable()
export class UsersFindByIdRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string): Promise<UsersDto> {
    const userFound = await this.prisma.user.findUnique({
      where: { id, disabledAt: null },
    });
    if (!userFound) throw new UsersNotFoundException();
    return userFound;
  }
}
