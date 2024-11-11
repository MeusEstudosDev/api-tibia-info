import { ApiProperty } from "@nestjs/swagger";

export class SecurityCryptInvalidExceptionDto {
  @ApiProperty({
    description: "Mensagem de erro",
    example: "Algorítimo de criptografia inválido",
  })
  message: string;

  @ApiProperty({ description: "Tipo de erro", example: "Bad Request" })
  error: string;

  @ApiProperty({ description: "Código do status HTTP", example: 400 })
  statusCode: number;
}
