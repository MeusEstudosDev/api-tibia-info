import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UsersChangePasswordDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  password: string;
}
