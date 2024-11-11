import { ApiProperty } from "@nestjs/swagger";

export class UsersChangeEmailAlreadyExistsDto {
  @ApiProperty({
    description: "Mensagem de erro",
    example: "Já existe uma solicitação de troca de e-mail em andamento",
  })
  message: string;

  @ApiProperty({ description: "Tipo de erro", example: "Conflict" })
  error: string;

  @ApiProperty({ description: "Código do status HTTP", example: 409 })
  statusCode: number;
}
