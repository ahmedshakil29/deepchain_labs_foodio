import { Role } from '../../generated/prisma/client';

export interface JwtPayload {
  sub: number;
  role: Role;
  iat?: number;
  exp?: number;
}
