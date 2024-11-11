import { ApiProperty, OmitType } from "@nestjs/swagger";

export class UsersDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty({ nullable: true, type: Date })
  readonly disabledAt: Date | null;

  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly lastName: string;

  @ApiProperty()
  readonly username: string;

  @ApiProperty()
  readonly usernameHash: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly emailHash: string;

  @ApiProperty()
  readonly passwordHash: string;

  @ApiProperty()
  readonly pictureUri: string;

  @ApiProperty()
  readonly permissions: string[];
}

export class UsersResponseDto extends OmitType(UsersDto, [
  "usernameHash",
  "emailHash",
  "passwordHash",
]) {}
