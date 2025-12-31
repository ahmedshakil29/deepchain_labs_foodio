import { Role } from "./admin";

export type User = {
  id: number;
  name: string;
  email: string;
  address: string;
  imageUrl?: string;
  roleId: number;
  role: Role;
  createdAt: string;
  updatedAt: string;
};
