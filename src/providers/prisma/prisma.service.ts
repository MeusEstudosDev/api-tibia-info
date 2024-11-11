import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { OnModuleInit } from "@nestjs/common/interfaces/hooks/on-init.interface";
import { Logger } from "@nestjs/common/services/logger.service";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit(): Promise<void> {
        Logger.log("Connected", "PrismaService");
        await this.$connect();
    }

    async onModuleDestroy(): Promise<void> {
        Logger.warn("Disconnected", "PrismaService");
        await this.$disconnect();
    }
}