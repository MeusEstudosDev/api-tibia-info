import { Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { env } from "../../configs/env";

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
    });
  }

  set(
    key: string,
    value: string,
    ttl: number | undefined = undefined,
  ): Promise<"OK"> {
    if (ttl) return this.client.set(key, value, "EX", ttl);
    this.client.set(key, value);
  }

  get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  del(key: string): void {
    this.client.del(key);
  }
}
