import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import ipinfo from "ipinfo";

class IpInfo {
  ip: string;
  // hostname: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  // postal: string;
  timezone: string;
}

@Injectable()
export class IpInfoService {
  get(ip: string): Promise<IpInfo> {
    return new Promise((resolve, reject) => {
      ipinfo(ip, (err, cLoc: IpInfo) => {
        if (err) reject(err);
        resolve(cLoc);
      });
    });
  }
}
