export class SessionsCreateDto {
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  loc?: string | null;
  org?: string | null;
  timezone?: string | null;
  userId: string;
}
