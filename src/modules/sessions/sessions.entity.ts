import { SessionsDto } from "./dtos/sessions.dto";
import { SessionsCreateDto } from "./dtos/sessions.create.dto";
import createCuid from "cuid";

export class Session {
  private _id: string;
  private _createdAt: Date;
  private _expiresAt: Date;
  private _revokedAt: Date | null;
  private _ipAddress: string;
  private _userAgent: string;
  private _city: string | null;
  private _region: string | null;
  private _country: string | null;
  private _loc: string | null;
  private _org: string | null;
  private _timezone: string | null;
  private _userId: string;

  constructor(dto?: SessionsDto) {
    this._id = dto?.id;
    this._createdAt = dto?.createdAt;
    this._expiresAt = dto?.expiresAt;
    this._revokedAt = dto?.revokedAt;
    this._ipAddress = dto?.ipAddress;
    this._userAgent = dto?.userAgent;
    this._city = dto?.city;
    this._region = dto?.region;
    this._country = dto?.country;
    this._loc = dto?.loc;
    this._org = dto?.org;
    this._timezone = dto?.timezone;
    this._userId = dto?.userId;
  }

  get toJson(): SessionsDto {
    return {
      id: this._id,
      createdAt: this._createdAt,
      expiresAt: this._expiresAt,
      revokedAt: this._revokedAt,
      ipAddress: this._ipAddress,
      userAgent: this._userAgent,
      city: this._city,
      region: this._region,
      country: this._country,
      loc: this._loc,
      org: this._org,
      timezone: this._timezone,
      userId: this._userId,
    };
  }

  revoke() {
    this._revokedAt = new Date();
  }

  set expiresAt(date: Date) {
    this._expiresAt = date;
  }

  set create(dto: SessionsCreateDto) {
    this._id = createCuid();
    this._createdAt = new Date();
    this._expiresAt = dto.expiresAt;
    this._revokedAt = null;
    this._ipAddress = dto.ipAddress;
    this._userAgent = dto.userAgent;
    this._city = dto.city;
    this._region = dto.region;
    this._country = dto.country;
    this._loc = dto.loc;
    this._org = dto.org;
    this._timezone = dto.timezone;
    this._userId = dto.userId;
  }
}
