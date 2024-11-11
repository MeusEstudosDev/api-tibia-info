import { OmitType, PartialType } from "@nestjs/swagger";
import { UsersCreateDto } from "./users.create.dto";

export class UsersUpdateDto extends PartialType(
  OmitType(UsersCreateDto, ["email", "password"]),
) {}
