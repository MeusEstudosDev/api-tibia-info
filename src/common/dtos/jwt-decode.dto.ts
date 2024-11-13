export class JwtDecodeDto {
  sessionId: string;
  userId: string;
  permissions: string;
  iat: number;
  exp: number;
}
