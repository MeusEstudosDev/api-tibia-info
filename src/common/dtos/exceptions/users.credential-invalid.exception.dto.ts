import { ApiProperty } from "@nestjs/swagger";

export class UsersCredentialInvalidExceptionDto {
  @ApiProperty({
    description: "Mensagem de erro",
    example: "Credenciais inválidas",
  })
  message: string;

  @ApiProperty({ description: "Tipo de erro", example: "Unauthorized" })
  error: string;

  @ApiProperty({ description: "Código do status HTTP", example: 401 })
  statusCode: number;
}
