import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PrismaService } from "../../../providers/prisma/prisma.service";
import { SessionsDto } from "../dtos/sessions.dto";
import { SessionsNotFoundException } from "../../../common/exceptions/sessions.not-found.exception";

@Injectable()
export class SessionsFindByIdRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(sessionId: string): Promise<SessionsDto> {
    const sessionFound = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!sessionFound) throw new SessionsNotFoundException();
    return sessionFound;
  }
}
