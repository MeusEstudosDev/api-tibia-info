import { ApiProperty } from "@nestjs/swagger";

export class UsersNotFoundExceptionDto {
  @ApiProperty({
    description: "Mensagem de erro",
    example: "Usuário não encontrado",
  })
  message: string;

  @ApiProperty({ description: "Tipo de erro", example: "Not Found" })
  error: string;

  @ApiProperty({ description: "Código do status HTTP", example: 404 })
  statusCode: number;
}
