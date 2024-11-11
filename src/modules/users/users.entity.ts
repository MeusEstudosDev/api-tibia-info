import createCuid from "cuid";
import * as bcrypt from "bcrypt";
import { env } from "../../configs/env";
import { Security } from "../../utils/security.util";
import { ConflictException } from "@nestjs/common";
import { UsersResponseDto, UsersDto } from "./dtos/users.dto";
import { UsersCreateDto } from "./dtos/users.create.dto";
import { UsersUpdateDto } from "./dtos/users.update.dto";

export class User {
  private _id: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _disabledAt: Date | null;
  private _firstName: string;
  private _lastName: string;
  private _username: string;
  private _usernameHash: string;
  private _email: string;
  private _emailHash: string;
  private _passwordHash: string;
  private _pictureUri: string;
  private _permissions: string[];

  constructor(dto?: UsersDto) {
    this._id = dto?.id;
    this._createdAt = dto?.createdAt;
    this._updatedAt = dto?.updatedAt;
    this._disabledAt = dto?.disabledAt;
    this._firstName = dto?.firstName;
    this._lastName = dto?.lastName;
    this._username = dto?.username;
    this._usernameHash = dto?.usernameHash;
    this._email = dto?.email;
    this._emailHash = dto?.emailHash;
    this._passwordHash = dto?.passwordHash;
    this._pictureUri = dto?.pictureUri;
    this._permissions = dto?.permissions;
  }

  get toJson(): UsersDto {
    return {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      disabledAt: this._disabledAt,
      firstName: this._firstName,
      lastName: this._lastName,
      username: this._username,
      usernameHash: this._usernameHash,
      email: this._email,
      emailHash: this._emailHash,
      passwordHash: this._passwordHash,
      pictureUri: this._pictureUri,
      permissions: this._permissions,
    };
  }

  get response(): UsersResponseDto {
    return {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      disabledAt: this._disabledAt,
      firstName: this._firstName,
      lastName: this._lastName,
      username: this._usernameHash,
      email: this._emailHash,
      pictureUri: this._pictureUri,
      permissions: this._permissions,
    };
  }

  set username(username: string) {
    this._username = Security.hash(username);
    this._usernameHash = Security.encrypt(username);
  }

  set email(email: string) {
    this._email = Security.hash(email);
    this._emailHash = Security.encrypt(email);
  }

  set password(password: string) {
    const salt = bcrypt.genSaltSync(env.SALT_OR_ROUNDS);
    this._passwordHash = bcrypt.hashSync(password, salt);
  }

  set pictureUri(uri: string) {
    this._pictureUri = uri;
  }

  set create(dto: UsersCreateDto) {
    const date = new Date();
    this._id = createCuid();
    this._createdAt = date;
    this._updatedAt = date;
    this._disabledAt = null;
    this._firstName = dto.firstName;
    this._lastName = dto.lastName;
    this.username = dto.username;
    this.email = dto.email;
    this.password = dto.password;
    this.pictureUri = "/images/default-profile-picture.png";
    this._permissions = dto.permissions.map((permission) => String(permission));
  }

  set update(dto: UsersUpdateDto) {
    if (!dto.firstName && !dto.lastName && !dto.username && !dto.permissions) {
      throw new ConflictException("Pelo menos um campo deve ser preenchido");
    }
    this._updatedAt = new Date();
    if (dto.firstName) this._firstName = dto.firstName;
    if (dto.lastName) this._lastName = dto.lastName;
    if (dto.username) this.username = dto.username;
    if (dto.permissions)
      this._permissions = dto.permissions.map((permission) =>
        String(permission),
      );
  }
}
