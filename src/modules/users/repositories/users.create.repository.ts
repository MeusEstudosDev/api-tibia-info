import { UsersDto } from "../dtos/users.dto";
import { PrismaService } from "../../../providers/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersCreateRepository {
  constructor(private readonly prisma: PrismaService) {}

  execute(data: UsersDto): Promise<UsersDto> {
    return this.prisma.user.create({ data });
  }
}
