import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PrismaService } from "../../../providers/prisma/prisma.service";
import { SessionsCreateDto } from "../dtos/sessions.create.dto";
import { SessionsDto } from "../dtos/sessions.dto";

@Injectable()
export class SessionsCreateRepository {
  constructor(private readonly prisma: PrismaService) {}

  execute(data: SessionsCreateDto): Promise<SessionsDto> {
    return this.prisma.session.create({ data });
  }
}
