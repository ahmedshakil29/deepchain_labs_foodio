export interface JwtUserPayload {
  sub: number;
  email: string;
  role: 'user' | 'admin';
}

// export interface JwtUserPayload {
//   sub: number;
//   email: string;
//   role: string;
// }
