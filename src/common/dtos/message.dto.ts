import { ApiProperty } from "@nestjs/swagger";

export class MessageDto {
  @ApiProperty({ example: "Usuário criado com sucesso" })
  message: string;
}
