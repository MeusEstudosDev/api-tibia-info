import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class UsersForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
