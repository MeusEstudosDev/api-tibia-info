import { IsArray, IsEmail, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UsersPermissionsEnum } from "../enums/users.permissions.enum";

export class UsersCreateDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({ minLength: 4, maxLength: 32 })
  @IsString()
  @Length(4, 32)
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8, maxLength: 64 })
  @IsString()
  @Length(8, 64)
  password: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  permissions: UsersPermissionsEnum[];
}
