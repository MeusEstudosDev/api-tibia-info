export class RequestInfoDto {
  method: string;
  url: string;
  params: any;
  query: any;
  body: any;
  headers: Record<string, any>;
  ip: string;
  error?: any;
  token?: string;
}
