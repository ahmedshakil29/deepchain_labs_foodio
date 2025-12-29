import { Request } from 'express';
import { JwtPayload } from './jwt-payload.type';

export interface JwtRequest extends Request {
  user: JwtPayload;
}

// import { Request } from 'express';

// export interface JwtPayload {
//   sub: number;
//   role: 'ADMIN' | 'USER';
// }

// export interface JwtRequest extends Request {
//   user: JwtPayload;
// }

// import { Request } from 'express';
// import { JwtPayload } from './jwt-payload.type';

// export interface JwtRequest extends Request {
//   user?: JwtPayload;
// }
