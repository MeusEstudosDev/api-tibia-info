import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../providers/prisma/prisma.service";
import { UsersDto } from "../dtos/users.dto";

@Injectable()
export class UsersUpdateRepository {
  constructor(private readonly prisma: PrismaService) {}

  execute(data: UsersDto): Promise<UsersDto> {
    return this.prisma.user.update({
      where: { id: data.id },
      data,
    });
  }
}
