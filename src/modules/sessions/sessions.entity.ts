import { SessionsDto } from "./dtos/sessions.dto";
import { SessionsCreateDto } from "./dtos/sessions.create.dto";
import createCuid from "cuid";
import { Security } from "../../utils/security.util";

export class Session {
  private _id: string;
  private _createdAt: Date;
  private _expiresAt: Date;
  private _revokedAt: Date | null;
  private _ipAddress: string;
  private _userId: string;

  constructor(dto?: SessionsDto) {
    this._id = dto?.id;
    this._createdAt = dto?.createdAt;
    this._expiresAt = dto?.expiresAt;
    this._revokedAt = dto?.revokedAt;
    this._ipAddress = dto?.ipAddress;
    this._userId = dto?.userId;
  }

  get toJson(): SessionsDto {
    return {
      id: this._id,
      createdAt: this._createdAt,
      expiresAt: this._expiresAt,
      revokedAt: this._revokedAt,
      ipAddress: this._ipAddress,
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
    this._ipAddress = Security.hash(dto.ipAddress);
    this._userId = dto.userId;
  }
}
