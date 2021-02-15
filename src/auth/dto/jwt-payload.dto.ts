export class JwtPayloadDTO {
  name: string;
  email: string;
  sub: string;
  iat?: string;
  exp?: string;
}
