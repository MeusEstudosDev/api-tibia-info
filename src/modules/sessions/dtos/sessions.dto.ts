export class SessionsDto {
  id: string;
  createdAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
  ipAddress: string;
  userId: string;
}
