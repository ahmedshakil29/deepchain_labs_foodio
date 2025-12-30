export interface User {
  id: number;
  name: string;
  email: string;
  role: string; // could be "admin" or "user"
  address?: string;
  profileUrl?: string;
}
