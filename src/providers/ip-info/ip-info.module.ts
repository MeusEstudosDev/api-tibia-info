import { Module } from "@nestjs/common";
import { IpInfoService } from "./ip-info.service";

@Module({
  providers: [IpInfoService],
  exports: [IpInfoService],
})
export class IpInfoModule {}
