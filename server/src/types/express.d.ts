import { JwtUserPayload } from '../auth/jwt-payload.interface';

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

// import { JwtUserPayload } from '../auth/jwt-payload.interface';

// declare global {
//   namespace Express {
//     interface Request {
//       user?: JwtUserPayload;
//     }
//   }
// }
