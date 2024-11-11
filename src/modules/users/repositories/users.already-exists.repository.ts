import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../providers/prisma/prisma.service";
import { UsersAlreadyExistsException } from "../../../common/exceptions/users.already-exists.exception";

interface UsersAlreadyExistsDto {
  username?: string;
  email?: string;
}

@Injectable()
export class UsersAlreadyExistsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: UsersAlreadyExistsDto, userId?: string): Promise<void> {
    if (!dto.username && !dto.email) return;
    const userFound = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: dto.username }, { email: dto.email }],
      },
    });
    if (userFound && (userId ? userFound.id !== userId : true)) {
      throw new UsersAlreadyExistsException();
    }
  }
}
