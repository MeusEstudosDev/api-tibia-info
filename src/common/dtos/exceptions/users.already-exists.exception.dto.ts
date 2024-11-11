import { ApiProperty } from "@nestjs/swagger";

export class UsersAlreadyExistsExceptionDto {
  @ApiProperty({
    description: "Mensagem de erro",
    example: "Usuário já existe",
  })
  message: string;

  @ApiProperty({ description: "Tipo de erro", example: "Conflict" })
  error: string;

  @ApiProperty({ description: "Código do status HTTP", example: 409 })
  statusCode: number;
}
